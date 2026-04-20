package com.matchcv.controller;

import com.matchcv.dto.api.OptimizedCvResponse;
import com.matchcv.dto.llm.OptimizeCvRequest;
import com.matchcv.service.LlmService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/llm")
public class LlmController {

    private final LlmService llmService;

    public LlmController(LlmService llmService) {
        this.llmService = llmService;
    }

    @PostMapping("/optimize")
    public OptimizedCvResponse optimize(@RequestBody OptimizeCvRequest request) {
        return llmService.optimizeCv(request);
    }
}
