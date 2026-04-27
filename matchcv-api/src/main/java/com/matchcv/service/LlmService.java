package com.matchcv.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.matchcv.dto.api.OptimizedCvResponse;
import com.matchcv.dto.llm.LlmMessage;
import com.matchcv.dto.llm.LlmRequest;
import com.matchcv.dto.llm.LlmResponse;
import com.matchcv.dto.llm.OptimizeCvRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class LlmService {

    private static final String SYSTEM_PROMPT = """
            [SYSTEM]
            You are a Senior FAANG Technical Recruiter and ATS optimization expert.

            Task:
            Rewrite CV bullet points to match the job description using STAR (Situation, Task, Action, Result) with strong impact.

            Rules:
            - Output ONLY valid JSON (no extra text)
            - Do NOT include markdown (no ```json)
            - Response must start with { and end with }
            - Language: %s
            - Use strong action verbs
            - Include measurable impact (%%, scale, time, cost) OR clear technical impact
            - If metrics are missing, use [X] placeholders (do NOT invent numbers)
            - Do NOT invent technologies, roles, or results
            - Optimize for ATS keywords from JOB_DESCRIPTION
            - Keep bullets concise and high-impact

            Scoring (0–100):
            - Impact (metrics or clear results)
            - Technical depth
            - Clarity
            - Relevance to JOB_DESCRIPTION

            Output format:
            {
              "optimized_bullets": ["string"],
              "faang_ready_score": number,
              "improvements": ["string"]
            }
            """;

    private final RestClient restClient;
    private final String model;
    private final ObjectMapper objectMapper;

    public LlmService(
            @Value("${llm.api-url}") String apiUrl,
            @Value("${llm.model-name}") String model) {
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .build();
        this.model = model;
        this.objectMapper = new ObjectMapper();
    }

    public OptimizedCvResponse optimizeCv(OptimizeCvRequest request) {
        String systemContent = SYSTEM_PROMPT.formatted(request.language());

        String userContent = """
                JOB_DESCRIPTION:
                %s

                CV_BASE:
                %s
                """.formatted(request.jobDescription(), request.cv());

        LlmRequest llmRequest = new LlmRequest(
                model,
                List.of(
                        new LlmMessage("system", systemContent),
                        new LlmMessage("user", userContent)
                ),
                0.3
        );

        LlmResponse response = restClient.post()
                .contentType(MediaType.APPLICATION_JSON)
                .body(llmRequest)
                .retrieve()
                .body(LlmResponse.class);

        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            throw new RuntimeException("Invalid or empty response from LLM");
        }

        String rawJson = response.choices().getFirst().message().content();

        if (rawJson == null || rawJson.isBlank()) {
            throw new RuntimeException("LLM returned null or empty content");
        }

        try {
            return objectMapper.readValue(rawJson, OptimizedCvResponse.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao processar resposta da IA", e);
        }
    }
}
