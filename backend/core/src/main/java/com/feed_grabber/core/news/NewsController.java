package com.feed_grabber.core.news;


import com.feed_grabber.core.apiContract.AppResponse;
import com.feed_grabber.core.exceptions.NotFoundException;
import com.feed_grabber.core.news.dto.NewsCreateDto;
import com.feed_grabber.core.news.dto.NewsDto;
import com.feed_grabber.core.news.dto.NewsUpdateDto;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.feed_grabber.core.auth.security.TokenService.getCompanyId;
import static com.feed_grabber.core.auth.security.TokenService.getUserId;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @ApiOperation("Load news from repo")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public AppResponse<List<NewsDto>> getAll(@RequestParam(defaultValue="0") Integer from,
                                         @RequestParam(defaultValue="10") Integer count) {
        var companyId = getCompanyId();
        return new AppResponse<>(newsService.getAllByCompanyId(from, count, companyId));
    }

    @ApiOperation(value = "Create new news",
                notes = "Provide object with body and imageId to create news")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public AppResponse<NewsDto> create(@RequestBody NewsCreateDto newsCreateDto) throws NotFoundException {
        newsCreateDto.setUserId(getUserId());
        newsCreateDto.setCompanyId(getCompanyId());
        return new AppResponse<>(newsService.create(newsCreateDto));
    }

    @ApiOperation(value = "Update news",
                notes = "Provide object with id, body and imageId to update the news")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping
    public AppResponse<NewsDto> update(@RequestBody NewsUpdateDto newsUpdateDto) throws NotFoundException {
        return new AppResponse<>(newsService.update(newsUpdateDto));
    }

    @ApiOperation(value = "Delete the news")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping
    public void delete(@RequestBody UUID id) {
        newsService.delete(id);
    }
}