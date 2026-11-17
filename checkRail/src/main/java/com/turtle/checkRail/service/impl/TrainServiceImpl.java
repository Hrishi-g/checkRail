package com.turtle.checkRail.service.impl;

import com.turtle.checkRail.config.TtlCache;
import com.turtle.checkRail.dto.response.LiveStatusResponse;
import com.turtle.checkRail.dto.response.TrainSearchResponse;
import com.turtle.checkRail.exception.InvalidQueryException;
import com.turtle.checkRail.exception.TrainNotFoundException;
import com.turtle.checkRail.model.TrainSummary;
import com.turtle.checkRail.provider.IrctcApiProvider;
import com.turtle.checkRail.service.TrainService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrainServiceImpl implements TrainService {

    private final IrctcApiProvider irctcApiProvider;

    // Cache: 25 seconds TTL for live status
    private final TtlCache<String, LiveStatusResponse> liveStatusCache = new TtlCache<>(25);

    // Cache: 5 minutes TTL for search results
    private final TtlCache<String, TrainSearchResponse> searchCache = new TtlCache<>(300);

    public TrainServiceImpl(IrctcApiProvider irctcApiProvider) {
        this.irctcApiProvider = irctcApiProvider;
    }

    @Override
    public TrainSearchResponse searchTrains(String query) {
        if (query == null || query.trim().length() < 2) {
            throw new InvalidQueryException("Search query must be at least 2 characters");
        }

        String normalizedQuery = "query_" + query.trim().toLowerCase();
        TrainSearchResponse cached = searchCache.get(normalizedQuery);
        if (cached != null) {
            return cached;
        }

        List<TrainSummary> results = irctcApiProvider.searchTrains(query);
        TrainSearchResponse response = new TrainSearchResponse(results, results.size());
        searchCache.put(normalizedQuery, response);
        return response;
    }

    @Override
    public TrainSearchResponse searchByNumber(String number) {
        if (number == null || number.trim().isEmpty()) {
            throw new InvalidQueryException("Train number cannot be empty");
        }
        return searchTrains(number.trim());
    }

    @Override
    public TrainSearchResponse searchByName(String name) {
        if (name == null || name.trim().length() < 2) {
            throw new InvalidQueryException("Train name must be at least 2 characters");
        }
        return searchTrains(name.trim());
    }

    @Override
    public TrainSearchResponse searchBetweenStations(String from, String to, LocalDate date) {
        if (from == null || to == null || from.trim().isEmpty() || to.trim().isEmpty()) {
            throw new InvalidQueryException("Both source and destination stations are required");
        }

        String cacheKey = "stations_" + from.trim().toUpperCase() + "_" + to.trim().toUpperCase() + (date != null ? "_" + date : "");
        TrainSearchResponse cached = searchCache.get(cacheKey);
        if (cached != null) {
            return cached;
        }

        List<TrainSummary> results = irctcApiProvider.searchBetweenStations(from, to, date);
        TrainSearchResponse response = new TrainSearchResponse(results, results.size());
        searchCache.put(cacheKey, response);
        return response;
    }

    @Override
    public LiveStatusResponse getLiveStatus(String trainNumber, LocalDate date) {
        if (trainNumber == null || !trainNumber.trim().matches("\\d{4,5}")) {
            throw new InvalidQueryException("Invalid train number format. Expected 4 or 5 digits.");
        }

        LocalDate journeyDate = (date != null) ? date : LocalDate.now();
        String cacheKey = trainNumber.trim() + "_" + journeyDate;

        LiveStatusResponse cached = liveStatusCache.get(cacheKey);
        if (cached != null) {
            return cached;
        }

        LiveStatusResponse response = irctcApiProvider.getLiveStatus(trainNumber.trim(), journeyDate);
        if (response == null) {
            throw new TrainNotFoundException("Live running data not found for train " + trainNumber);
        }

        liveStatusCache.put(cacheKey, response);
        return response;
    }
}
