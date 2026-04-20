package com.matchcv.controller;

import com.matchcv.dto.api.GenerateCvRequest;
import com.matchcv.service.CvOrchestratorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
public class CvController {

    private final CvOrchestratorService orchestratorService;

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generate(@Valid @RequestBody GenerateCvRequest request,
                                           Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        byte[] pdf = orchestratorService.generate(userId, request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment().filename("cv_" + userId + ".pdf").build()
        );

        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}
