package com.turtle.checkRail.controller;

import com.turtle.checkRail.dto.response.LiveStatusResponse;
import com.turtle.checkRail.dto.response.TrainSearchResponse;
import com.turtle.checkRail.service.TrainService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "checkRail Backend",
                "timestamp", System.currentTimeMillis()
        ));
    }

    /**
     * Search trains endpoint.
     * Supports both query string (?q=...) and between stations (?from=...&to=...).
     */
    @GetMapping("/trains/search")
    public ResponseEntity<TrainSearchResponse> searchTrains(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "from", required = false) String from,
            @RequestParam(value = "to", required = false) String to,
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (from != null && !from.trim().isEmpty() && to != null && !to.trim().isEmpty()) {
            return ResponseEntity.ok(trainService.searchBetweenStations(from, to, date));
        }

        String searchTarget = query != null ? query : (from != null ? from : "");
        TrainSearchResponse response = trainService.searchTrains(searchTarget);
        return ResponseEntity.ok(response);
    }

    /**
     * Search by Train Number (e.g. 12951)
     */
    @GetMapping("/trains/search/number")
    public ResponseEntity<TrainSearchResponse> searchByNumber(@RequestParam("number") String number) {
        TrainSearchResponse response = trainService.searchByNumber(number);
        return ResponseEntity.ok(response);
    }

    /**
     * Direct train by number path parameter (e.g. /api/v1/trains/12951)
     */
    @GetMapping("/trains/{trainNumber}")
    public ResponseEntity<TrainSearchResponse> getTrainByNumber(@PathVariable("trainNumber") String trainNumber) {
        TrainSearchResponse response = trainService.searchByNumber(trainNumber);
        return ResponseEntity.ok(response);
    }

    /**
     * Search by Train Name (e.g. Rajdhani, Vande, Duronto)
     */
    @GetMapping("/trains/search/name")
    public ResponseEntity<TrainSearchResponse> searchByName(@RequestParam("name") String name) {
        TrainSearchResponse response = trainService.searchByName(name);
        return ResponseEntity.ok(response);
    }

    /**
     * Search Trains Between Stations (e.g. from NDLS to GD)
     */
    @GetMapping("/trains/search/stations")
    public ResponseEntity<TrainSearchResponse> searchBetweenStations(
            @RequestParam("from") String from,
            @RequestParam("to") String to,
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        TrainSearchResponse response = trainService.searchBetweenStations(from, to, date);
        return ResponseEntity.ok(response);
    }

    /**
     * Live train running status
     */
    @GetMapping({"/trains/{trainNumber}/live", "/live/{trainNumber}"})
    public ResponseEntity<LiveStatusResponse> getLiveStatus(
            @PathVariable("trainNumber") String trainNumber,
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LiveStatusResponse response = trainService.getLiveStatus(trainNumber, date);
        return ResponseEntity.ok(response);
    }
}
