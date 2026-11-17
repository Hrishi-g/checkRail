package com.turtle.checkRail.service;

import com.turtle.checkRail.dto.response.LiveStatusResponse;
import com.turtle.checkRail.dto.response.TrainSearchResponse;

import java.time.LocalDate;

public interface TrainService {
    TrainSearchResponse searchTrains(String query);
    TrainSearchResponse searchByNumber(String number);
    TrainSearchResponse searchByName(String name);
    TrainSearchResponse searchBetweenStations(String from, String to, LocalDate date);
    LiveStatusResponse getLiveStatus(String trainNumber, LocalDate date);
}
