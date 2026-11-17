package com.turtle.checkRail.model;

public record StationStatus(
    int sequenceNumber,
    String name,
    String code,
    String scheduledArrival,
    String scheduledDeparture,
    String actualArrival,
    String actualDeparture,
    String platformNumber,
    int haltMinutes,
    int distanceFromSourceKm,
    StopStatus status,
    GeoCoordinate coordinates,
    Integer minutesAway
) {}
