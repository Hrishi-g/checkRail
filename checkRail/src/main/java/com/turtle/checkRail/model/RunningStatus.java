package com.turtle.checkRail.model;

public record RunningStatus(
    RunningStatusType status,
    int delayMinutes,
    int speedKmh,
    int distanceCoveredKm,
    int totalDistanceKm
) {}
