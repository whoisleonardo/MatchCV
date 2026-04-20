package com.matchcv.dto.llm;

import java.util.List;

public record LlmRequest(String model, List<LlmMessage> messages, double temperature) {}
