package com.turtle.checkRail.dto.response;

import java.util.List;

public record ApiErrorResponse(
    String code,
    String message,
    long timestamp
) {
    public ApiErrorResponse(String code, String message) {
        this(code, message, System.currentTimeMillis());
    }
}
