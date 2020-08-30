package com.feed_grabber.core.response;

import com.feed_grabber.core.exceptions.NotFoundException;
import com.feed_grabber.core.apiContract.AppResponse;
import com.feed_grabber.core.auth.security.TokenService;
import com.feed_grabber.core.response.dto.ResponseDto;
import com.feed_grabber.core.response.dto.UserResponseShortDto;
import com.feed_grabber.core.responseDeadline.exceptions.DeadlineExpiredException;
import com.feed_grabber.core.response.dto.ResponseUpdateDto;
import com.feed_grabber.core.response.exceptions.ResponseNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.feed_grabber.core.role.RoleConstants.*;

@RestController
@RequestMapping("api/response")
public class ResponseController {
    @Autowired
    ResponseService service;

    @GetMapping("/request/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AppResponse<ResponseDto> getCurrentUserResponse(@PathVariable UUID id) throws ResponseNotFoundException {
        UUID userId = TokenService.getUserId();
        return new AppResponse<>(
                service.getOneByRequestAndUser(id, userId)
                        .orElseThrow(ResponseNotFoundException::new)
        );
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public AppResponse<ResponseDto> getById(@RequestParam UUID responseId) throws ResponseNotFoundException {
        return new AppResponse<>(service.getById(responseId));
    }

    @GetMapping("/users")
    @Secured(value = {ROLE_COMPANY_OWNER, ROLE_HR})
    public AppResponse<List<UserResponseShortDto>> getRespondentsShortInfo(@RequestParam UUID requestId) {
        return new AppResponse<>(service.getRespondents(requestId));
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public AppResponse<ResponseDto> update(@RequestBody ResponseUpdateDto dto) throws ResponseNotFoundException,
           DeadlineExpiredException,
           NotFoundException {
        return new AppResponse<>(service.update(dto).orElseThrow(ResponseNotFoundException::new));
    }


}
