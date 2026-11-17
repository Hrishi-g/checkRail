package com.turtle.checkRail;

import com.turtle.checkRail.dto.response.LiveStatusResponse;
import com.turtle.checkRail.dto.response.TrainSearchResponse;
import com.turtle.checkRail.model.GeoCoordinate;
import com.turtle.checkRail.service.TrainService;
import com.turtle.checkRail.util.StationCoordinateRegistry;
import com.turtle.checkRail.util.StationCoordinateRegistry.StopQueryItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CheckRailApplicationTests {

    @Autowired
    private TrainService trainService;

    @Test
    void contextLoads() {
        assertNotNull(trainService);
    }

    @Test
    void testSearchTrainByName() {
        TrainSearchResponse response = trainService.searchTrains("Rajdhani");
        assertNotNull(response);
        assertFalse(response.results().isEmpty());
        assertTrue(response.results().getFirst().trainName().contains("Rajdhani"));
    }

    @Test
    void testSearchTrainByNumber() {
        TrainSearchResponse response = trainService.searchTrains("12951");
        assertNotNull(response);
        assertEquals("12951", response.results().getFirst().trainNumber());
    }

    @Test
    void testGetLiveStatus() {
        LiveStatusResponse liveStatus = trainService.getLiveStatus("12951", LocalDate.now());
        assertNotNull(liveStatus);
        assertEquals("12951", liveStatus.trainNumber());
        assertNotNull(liveStatus.currentPosition());
        assertNotNull(liveStatus.runningStatus());
        assertNotNull(liveStatus.currentStation());
        assertNotNull(liveStatus.nextStation());
        assertFalse(liveStatus.stations().isEmpty());

        // Validate real coordinates
        GeoCoordinate srcCoord = liveStatus.source().coordinates();
        assertTrue(srcCoord.lat() > 18.0 && srcCoord.lat() < 29.0);
        assertTrue(srcCoord.lng() > 72.0 && srcCoord.lng() < 89.0);
    }

    @Test
    void testStationCoordinateRegistry() {
        // Direct station code lookups
        Optional<GeoCoordinate> mmct = StationCoordinateRegistry.find("MMCT");
        assertTrue(mmct.isPresent());
        assertEquals(18.9696, mmct.get().lat(), 0.01);
        assertEquals(72.8195, mmct.get().lng(), 0.01);

        Optional<GeoCoordinate> ndls = StationCoordinateRegistry.find("NDLS");
        assertTrue(ndls.isPresent());
        assertEquals(28.6415, ndls.get().lat(), 0.01);
        assertEquals(77.2209, ndls.get().lng(), 0.01);

        // Alias and normalized name lookups
        Optional<GeoCoordinate> mum = StationCoordinateRegistry.find("MUM");
        assertTrue(mum.isPresent());

        Optional<GeoCoordinate> bor = StationCoordinateRegistry.find("BOR");
        assertTrue(bor.isPresent());

        Optional<GeoCoordinate> vadodara = StationCoordinateRegistry.find("Vadodara Jn");
        assertTrue(vadodara.isPresent());

        // Route resolution with unknown intermediate stops
        List<StopQueryItem> route = List.of(
                new StopQueryItem("MMCT", "Mumbai Central", 0),
                new StopQueryItem("UNK1", "Small Halt A", 100),
                new StopQueryItem("ST", "Surat", 263),
                new StopQueryItem("NDLS", "New Delhi", 1384)
        );

        List<GeoCoordinate> resolved = StationCoordinateRegistry.resolveRouteCoordinates(route);
        assertEquals(4, resolved.size());
        // Unknown station interpolated between Mumbai and Surat
        assertTrue(resolved.get(1).lat() > mmct.get().lat() && resolved.get(1).lat() < 22.0);
    }
}
