package com.matchcv.dto.llm;

import java.util.List;

public record LlmResponse(List<LlmChoice> choices) {}
