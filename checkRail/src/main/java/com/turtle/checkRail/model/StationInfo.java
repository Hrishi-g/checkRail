package com.turtle.checkRail.model;

public record StationInfo(
    String name,
    String code,
    String scheduledTime,
    GeoCoordinate coordinates
) {}
