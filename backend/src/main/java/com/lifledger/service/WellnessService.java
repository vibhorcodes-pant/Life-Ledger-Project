package com.lifledger.service;

import com.lifledger.dto.DailySummaryDto;
import com.lifledger.dto.WellnessEntryDto;
import java.time.LocalDate;
import java.util.List;

/**
 * Service interface defining business operations for daily wellness management.
 * Demonstrates Java Interfaces.
 */
public interface WellnessService {

    /**
     * Retrieves all wellness entries sorted by date descending.
     */
    List<WellnessEntryDto> getAllEntries();

    /**
     * Retrieves an entry for a specific date.
     */
    WellnessEntryDto getEntryByDate(LocalDate date);

    /**
     * Creates or updates a daily wellness entry.
     */
    WellnessEntryDto saveOrUpdateEntry(LocalDate date, WellnessEntryDto entryDto);

    /**
     * Deletes an entry for a specific date.
     */
    void deleteEntry(LocalDate date);

    /**
     * Calculates aggregated metrics across all recorded history.
     */
    DailySummaryDto getSummaryAnalytics();
}
