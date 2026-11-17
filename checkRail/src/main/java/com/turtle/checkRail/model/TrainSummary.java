package com.turtle.checkRail.model;

import java.util.List;

public record TrainSummary(
    String trainNumber,
    String trainName,
    String source,
    String sourceCode,
    String destination,
    String destinationCode,
    List<String> runsDays
) {}
