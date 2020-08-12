package com.feed_grabber.core.questionnaire;

import com.feed_grabber.core.auth.security.TokenService;

import com.feed_grabber.core.company.exceptions.CompanyNotFoundException;
import com.feed_grabber.core.exceptions.AlreadyExistsException;
import com.feed_grabber.core.questionnaire.dto.QuestionnaireCreateDto;
import com.feed_grabber.core.questionnaire.dto.QuestionnaireDto;
import com.feed_grabber.core.questionnaire.dto.QuestionnaireUpdateDto;
import com.feed_grabber.core.questionnaire.exceptions.QuestionnaireExistsException;
import com.feed_grabber.core.questionnaire.exceptions.QuestionnaireNotFoundException;
import com.feed_grabber.core.response.AppResponse;
import com.feed_grabber.core.response.DataList;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/questionnaires")
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;

    @Autowired
    public QuestionnaireController(QuestionnaireService questionnaireService) {
        this.questionnaireService = questionnaireService;
    }

    @ApiOperation("Get all questionnaires")
    @GetMapping
    public AppResponse<DataList<QuestionnaireDto>> getAll(
                @RequestParam Integer page,
                @RequestParam Integer size
    ) {
        var companyId = TokenService.getCompanyId();
        var dataList = new DataList<>(
                questionnaireService.getAllByCompanyId(companyId, page, size),
                questionnaireService.getCountByCompanyId(companyId),
                page,
                size
        );
        return new AppResponse<>(dataList, HttpStatus.OK);
    }
//    @ApiOperation("Get all questionnaires of company by companyID")
//    @GetMapping("/companies/{id}")
//    public AppResponse<List<QuestionnaireDto>> getAllByCompany(@PathVariable UUID id) {
//        return new AppResponse<>(
//                questionnaireService.getAllByCompanyId(id),
//                HttpStatus.OK
//        );
//    }

    @ApiOperation("Get one questionnaire by id")
    @GetMapping("/{id}")
    public AppResponse<QuestionnaireDto> getOne(@PathVariable UUID id) throws QuestionnaireNotFoundException {
        return new AppResponse<>(
                questionnaireService.getOne(id)
                        .orElseThrow(QuestionnaireNotFoundException::new),
                HttpStatus.OK
        );
    }

    @ApiOperation("Create a questionnaire")
    @PostMapping
    public AppResponse<QuestionnaireDto> create(@RequestBody QuestionnaireCreateDto createDto) throws CompanyNotFoundException, AlreadyExistsException {
        return new AppResponse<>(
                questionnaireService.create(createDto, TokenService.getCompanyId()),
                HttpStatus.OK
        );
    }

    @ApiOperation("Update the questionnaire")
    @PutMapping
    public AppResponse<QuestionnaireDto> update(@RequestBody QuestionnaireUpdateDto updateDto) throws QuestionnaireNotFoundException, CompanyNotFoundException, QuestionnaireExistsException {
        return new AppResponse<>(
                questionnaireService.update(updateDto, TokenService.getCompanyId()),
                HttpStatus.OK
        );
    }

    @ApiOperation("Delete one")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        questionnaireService.delete(id);
    }
}
