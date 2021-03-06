package com.feed_grabber.core.request;

import com.feed_grabber.core.auth.exceptions.JwtTokenException;
import com.feed_grabber.core.auth.security.TokenService;
import com.feed_grabber.core.exceptions.NotFoundException;
import com.feed_grabber.core.file.FileRepository;
import com.feed_grabber.core.file.model.S3File;
import com.feed_grabber.core.localization.Translator;
import com.feed_grabber.core.notification.UserNotificationService;
import com.feed_grabber.core.questionCategory.exceptions.QuestionCategoryNotFoundException;
import com.feed_grabber.core.questionnaire.QuestionnaireRepository;
import com.feed_grabber.core.rabbit.Sender;
import com.feed_grabber.core.report.dto.FileReportsDto;
import com.feed_grabber.core.request.dto.CreateRequestDto;
import com.feed_grabber.core.request.dto.PendingRequestDto;
import com.feed_grabber.core.request.dto.RequestQuestionnaireDto;
import com.feed_grabber.core.request.dto.RequestShortDto;
import com.feed_grabber.core.request.model.Request;
import com.feed_grabber.core.response.ResponseRepository;
import com.feed_grabber.core.response.model.Response;
import com.feed_grabber.core.team.TeamRepository;
import com.feed_grabber.core.team.exceptions.TeamNotFoundException;
import com.feed_grabber.core.user.UserRepository;
import com.feed_grabber.core.user.exceptions.UserNotFoundException;
import com.feed_grabber.core.user.model.User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RequestService {
    private final RequestRepository requestRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final ResponseRepository responseRepository;
    private final FileRepository fileRepository;
    private final UserNotificationService userNotificationService;
    private final Sender sender;

    public RequestService(RequestRepository requestRepository,
                          QuestionnaireRepository questionnaireRepository,
                          UserRepository userRepository,
                          TeamRepository teamRepository,
                          ResponseRepository responseRepository,
                          FileRepository fileRepository,
                          UserNotificationService userNotificationService,
                          Sender sender) {
        this.requestRepository = requestRepository;
        this.questionnaireRepository = questionnaireRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.responseRepository = responseRepository;
        this.fileRepository = fileRepository;
        this.userNotificationService = userNotificationService;
        this.sender = sender;
    }

    public UUID createNew(CreateRequestDto dto) throws NotFoundException {
        var questionnaire = questionnaireRepository
                .findById(dto.getQuestionnaireId())
                .orElseThrow(QuestionCategoryNotFoundException::new);

        if (questionnaire.isEditingEnabled()) {
            questionnaire.setEditingEnabled(false);
            questionnaireRepository.save(questionnaire);
        }

        var currentUser = userRepository
                .findById(TokenService.getUserId())
                .orElseThrow(UserNotFoundException::new);

        var targetUser = dto.getTargetUserId() == null ? null :
                userRepository
                        .findById(dto.getTargetUserId())
                        .orElseThrow(() -> new UserNotFoundException(Translator.toLocale("target_not_found")));

        var date = dto.getExpirationDate();

        var toSave = RequestMapper.MAPPER
                .requestCreationRequestDtoToModel(dto, questionnaire, targetUser, currentUser, date);

        var request = requestRepository.save(toSave);

        var users = new HashSet<>(userRepository.findAllById(dto.getRespondentIds()));

        users.addAll(teamRepository
                .findAllById(dto.getTeamIds())
                .stream()
                .flatMap(team -> team.getUsers().stream())
                .collect(Collectors.toSet()));

        if (targetUser != null) {
            if (dto.getIncludeTargetUser()) users.add(targetUser);
            else users.remove(targetUser);
        }

        var responses = users.stream()
                .map(u -> Response.builder().user(u).request(request).build())
                .collect(Collectors.toList());

        responseRepository.saveAll(responses);

        var notifyUsers = dto.getNotifyUsers();
        if (notifyUsers) {
            for (User user : users) {
                userNotificationService.saveAndSendResponseNotification(request,
                        user,
                        Translator.toLocale("new_request"));
            }
        }

        if (request.getExpirationDate() != null) {
            sender.sendReportCloseRequest(request.getId(), request.getExpirationDate());
        }

        return request.getId();
    }

    public List<PendingRequestDto> getPending(UUID userId) {
        return responseRepository
                .findAllByUserIdAndRequestNotNull(userId)
                .stream()
                .map(RequestMapper.MAPPER::toPendingFromResponse)
                .sorted(
                        Comparator.comparing(PendingRequestDto::getExpirationDate
                                , Comparator.nullsFirst(Comparator.naturalOrder())).reversed()
                )
                .collect(Collectors.toList());
    }

    public List<RequestQuestionnaireDto> getAllByUserId(UUID id) {
        return requestRepository.findAllUnansweredByRespondentId(id)
                .stream()
                .map(request -> RequestMapper.MAPPER.
                        requestAndQuestionnaireToDto(request, request.getQuestionnaire()))
                .collect(Collectors.toList());
    }

    public void addFileReports(FileReportsDto dto) throws NotFoundException {
        if (dto.getExcelReport() != null && dto.getPptReport() != null) {
            var excelReport = fileRepository.save(
                    S3File.builder()
                            .link(dto.getExcelReport().getLink())
                            .key(dto.getExcelReport().getKey())
                            .build()
            );
            var pptReport = fileRepository.save(
                    S3File.builder()
                            .link(dto.getPptReport().getLink())
                            .key(dto.getPptReport().getKey())
                            .build()
            );
            var request = requestRepository.findById(dto.getRequestId()).orElseThrow(NotFoundException::new);
            request.setPowerPointReport(pptReport);
            request.setExcelReport(excelReport);
            requestRepository.save(request);
        }

    }

    public Date closeNow(UUID requestId) throws NotFoundException {
        var request = requestRepository
                .findById(requestId)
                .orElseThrow(() -> new NotFoundException(Translator.toLocale("request_not_found")));

        if (request.getCloseDate() != null) {
            return request.getCloseDate();
        }

        request.setCloseDate(new Date());
        var closeDate = requestRepository.save(request).getCloseDate();
        var questionnaireWithOpenRequests = questionnaireRepository
                .findByAllClosedRequests(request
                        .getQuestionnaire()
                        .getId());

        if (questionnaireWithOpenRequests.isEmpty()) {
            var questionnaire = request.getQuestionnaire();
            questionnaire.setEditingEnabled(true);
            questionnaireRepository.save(questionnaire);
        }
        return closeDate;
    }

    public void notifyAboutClosing(Request request) throws NotFoundException {
        User maker = request.getRequestMaker();
        User target = request.getTargetUser();
        ArrayList<User> users = new ArrayList<>();
        users.add(maker);

        if (request.getSendToTarget() && !maker.equals(target)) {
            users.add(target);
        }
        for (User user : users) {
            userNotificationService
                    .saveAndSendResponseNotification(
                            request,
                            user,
                            "Request " + request.getQuestionnaire().getTitle() + " was closed"
                    );
        }
    }

    public void close(UUID requestId) throws NotFoundException {
        var request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException(Translator.toLocale("request_not_found")));
        if (request.getCloseDate() != null) {
            return;
        }
        notifyAboutClosing(request);
    }

    public List<RequestShortDto> getAllByQuestionnaire(UUID id) {
        return requestRepository.findAllByQuestionnaireId(id)
                .stream()
                .map(RequestMapper.MAPPER::requestToShortDto)
                .collect(Collectors.toList());
    }

    public List<RequestShortDto> getAllByTeamId(UUID id, UUID userId, String roleName) throws TeamNotFoundException {
        if (roleName.equals("employee")) {
            var team = teamRepository.findById(id).orElseThrow(TeamNotFoundException::new);
            if (!team.getLead().getId().equals(userId)) {
                throw new JwtTokenException(Translator.toLocale("request_permission_denied"));
            }
        }
        return requestRepository.findAllByTeamId(id)
                .stream()
                .map(RequestMapper.MAPPER::requestToShortDto)
                .collect(Collectors.toList());
    }

}
