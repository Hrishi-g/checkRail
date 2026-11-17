package com.turtle.checkRail.dto.response;

import com.turtle.checkRail.model.TrainSummary;
import java.util.List;

public record TrainSearchResponse(
    List<TrainSummary> results,
    int total
) {}
