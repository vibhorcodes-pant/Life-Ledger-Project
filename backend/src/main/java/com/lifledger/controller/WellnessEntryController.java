package com.lifledger.controller;

import com.lifledger.dto.ApiResponse;
import com.lifledger.dto.DailySummaryDto;
import com.lifledger.dto.WellnessEntryDto;
import com.lifledger.model.FoodItem;
import com.lifledger.model.HabitItem;
import com.lifledger.service.WellnessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * REST Controller exposing endpoints for Wellness Entries.
 * Implements PRD Functional Requirements (FR-01, FR-02, FR-09, FR-10).
 *
 * Supported Endpoints:
 * - GET /api/entries — retrieves available entries.
 * - GET /api/entries/{date} — retrieves an entry for a specific date.
 * - PUT /api/entries/{date} — creates or updates an entry for a date.
 * - DELETE /api/entries/{date} — deletes an entry for a date.
 * - GET /api/entries/summary — retrieves aggregated analytics.
 * - POST /api/entries/seed — populates demo data for demonstration.
 */
@RestController
@RequestMapping("/api/entries")
public class WellnessEntryController {

    private static final Logger logger = LoggerFactory.getLogger(WellnessEntryController.class);
    private final WellnessService wellnessService;

    public WellnessEntryController(WellnessService wellnessService) {
        this.wellnessService = wellnessService;
    }

    /**
     * GET /api/entries
     * Retrieves all available entries.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<WellnessEntryDto>>> getAllEntries() {
        logger.info("REST: Fetching all entries");
        List<WellnessEntryDto> entries = wellnessService.getAllEntries();
        return ResponseEntity.ok(ApiResponse.success(entries, "Retrieved " + entries.size() + " entries"));
    }

    /**
     * GET /api/entries/{date}
     * Retrieves an entry for a specific date (Format: YYYY-MM-DD).
     */
    @GetMapping("/{date}")
    public ResponseEntity<ApiResponse<WellnessEntryDto>> getEntryByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        logger.info("REST: Fetching entry for date: {}", date);
        WellnessEntryDto entry = wellnessService.getEntryByDate(date);
        return ResponseEntity.ok(ApiResponse.success(entry, "Entry retrieved successfully"));
    }

    /**
     * PUT /api/entries/{date}
     * Creates or updates an entry for a specific date.
     */
    @PutMapping("/{date}")
    public ResponseEntity<ApiResponse<WellnessEntryDto>> createOrUpdateEntry(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody WellnessEntryDto entryDto) {
        logger.info("REST: Saving entry for date: {}", date);
        WellnessEntryDto saved = wellnessService.saveOrUpdateEntry(date, entryDto);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(saved, "Entry saved successfully for " + date));
    }

    /**
     * DELETE /api/entries/{date}
     * Deletes an entry for a specific date.
     */
    @DeleteMapping("/{date}")
    public ResponseEntity<ApiResponse<Void>> deleteEntry(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        logger.info("REST: Deleting entry for date: {}", date);
        wellnessService.deleteEntry(date);
        return ResponseEntity.ok(ApiResponse.success(null, "Entry deleted successfully for " + date));
    }

    /**
     * GET /api/entries/summary
     * Retrieves aggregated analytics and life score across all recorded history.
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DailySummaryDto>> getSummary() {
        logger.info("REST: Fetching summary analytics");
        DailySummaryDto summary = wellnessService.getSummaryAnalytics();
        return ResponseEntity.ok(ApiResponse.success(summary, "Analytics computed successfully"));
    }

    /**
     * POST /api/entries/seed
     * Seeds initial demonstration records into the system.
     */
    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<String>> seedDemoData() {
        LocalDate today = LocalDate.now();

        // Entry 1: Today
        WellnessEntryDto entry1 = new WellnessEntryDto();
        entry1.setSteps(8420);
        entry1.setWaterIntakeMl(2250);
        entry1.setSleepHours(7.5);
        entry1.setExerciseMinutes(45);
        entry1.setNotes("Great productive morning workout, felt energetic throughout the day.");
        entry1.setFoodItems(Arrays.asList(
                new FoodItem("Oatmeal & Berries", 350, 12.0, 58.0, 6.0),
                new FoodItem("Grilled Chicken Salad", 520, 42.0, 18.0, 14.0),
                new FoodItem("Greek Yogurt & Almonds", 210, 18.0, 12.0, 8.0)
        ));
        entry1.setHabits(Arrays.asList(
                new HabitItem("Morning Meditation", true),
                new HabitItem("Read 20 mins", true),
                new HabitItem("No Sugar", false),
                new HabitItem("8 Hours Sleep", true)
        ));
        wellnessService.saveOrUpdateEntry(today, entry1);

        // Entry 2: Yesterday
        WellnessEntryDto entry2 = new WellnessEntryDto();
        entry2.setSteps(10250);
        entry2.setWaterIntakeMl(2600);
        entry2.setSleepHours(8.0);
        entry2.setExerciseMinutes(60);
        entry2.setNotes("Exceeded 10k step goal! Evening run by the lake.");
        entry2.setFoodItems(Arrays.asList(
                new FoodItem("Avocado Toast & Eggs", 480, 22.0, 36.0, 24.0),
                new FoodItem("Salmon with Quinoa", 650, 48.0, 45.0, 22.0),
                new FoodItem("Protein Shake", 200, 30.0, 5.0, 3.0)
        ));
        entry2.setHabits(Arrays.asList(
                new HabitItem("Morning Meditation", true),
                new HabitItem("Read 20 mins", true),
                new HabitItem("No Sugar", true),
                new HabitItem("8 Hours Sleep", true)
        ));
        wellnessService.saveOrUpdateEntry(today.minusDays(1), entry2);

        // Entry 3: 2 days ago
        WellnessEntryDto entry3 = new WellnessEntryDto();
        entry3.setSteps(6300);
        entry3.setWaterIntakeMl(1800);
        entry3.setSleepHours(6.2);
        entry3.setExerciseMinutes(20);
        entry3.setNotes("Busy study and coding day. Rehydrated in the evening.");
        entry3.setFoodItems(Arrays.asList(
                new FoodItem("Whole Wheat Pasta", 580, 20.0, 82.0, 12.0),
                new FoodItem("Fruit Bowl", 190, 3.0, 45.0, 1.0)
        ));
        entry3.setHabits(Arrays.asList(
                new HabitItem("Morning Meditation", false),
                new HabitItem("Read 20 mins", true),
                new HabitItem("No Sugar", false),
                new HabitItem("8 Hours Sleep", false)
        ));
        wellnessService.saveOrUpdateEntry(today.minusDays(2), entry3);

        return ResponseEntity.ok(ApiResponse.success("Demo data seeded successfully for 3 days"));
    }
}
