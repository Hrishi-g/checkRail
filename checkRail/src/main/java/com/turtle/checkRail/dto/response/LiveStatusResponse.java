package com.turtle.checkRail.dto.response;

import com.turtle.checkRail.model.GeoCoordinate;
import com.turtle.checkRail.model.RunningStatus;
import com.turtle.checkRail.model.StationInfo;
import com.turtle.checkRail.model.StationStatus;

import java.util.List;

public record LiveStatusResponse(
    String trainNumber,
    String trainName,
    StationInfo source,
    StationInfo destination,
    CurrentPosition currentPosition,
    RunningStatus runningStatus,
    StationStatus currentStation,
    StationStatus nextStation,
    List<StationStatus> stations,
    String lastUpdatedAt,
    String journeyDate
) {
    public record CurrentPosition(
        double lat,
        double lng,
        String nearestStation,
        String nearestStationCode
    ) {}
}
