package com.lifledger.service;

import com.lifledger.calculator.MetricCalculator;
import com.lifledger.dao.WellnessDao;
import com.lifledger.dto.DailySummaryDto;
import com.lifledger.dto.WellnessEntryDto;
import com.lifledger.exception.InvalidEntryException;
import com.lifledger.exception.ResourceNotFoundException;
import com.lifledger.model.WellnessEntry;
import com.lifledger.repository.WellnessEntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * Core business service implementing WellnessService.
 * Demonstrates:
 * 1. Polymorphism via List<MetricCalculator> strategy pattern.
 * 2. Java Collections and Generics (List, Map, Set).
 * 3. Java 8+ Streams and Lambda expressions.
 * 4. Dual Persistence: Spring Data JPA + JDBC DAO fallback.
 * 5. Clean Input Validation (FR-11).
 */
@Service
public class WellnessServiceImpl implements WellnessService {

    private static final Logger logger = LoggerFactory.getLogger(WellnessServiceImpl.class);

    private final WellnessEntryRepository jpaRepository;
    private final WellnessDao jdbcDao;
    private final List<MetricCalculator> metricCalculators;
    private final AsyncAnalyticsService asyncAnalyticsService;

    public WellnessServiceImpl(
            WellnessEntryRepository jpaRepository,
            @Qualifier("jdbcWellnessDao") WellnessDao jdbcDao,
            List<MetricCalculator> metricCalculators,
            AsyncAnalyticsService asyncAnalyticsService) {
        this.jpaRepository = jpaRepository;
        this.jdbcDao = jdbcDao;
        this.metricCalculators = metricCalculators;
        this.asyncAnalyticsService = asyncAnalyticsService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WellnessEntryDto> getAllEntries() {
        logger.info("Fetching all wellness entries from database...");
        List<WellnessEntry> entries = jpaRepository.findAllByOrderByEntryDateDesc();
        return entries.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WellnessEntryDto getEntryByDate(LocalDate date) {
        if (date == null) {
            throw new InvalidEntryException("Date cannot be null.");
        }
        logger.info("Retrieving entry for date: {}", date);
        WellnessEntry entry = jpaRepository.findById(date)
                .orElseThrow(() -> new ResourceNotFoundException("Daily entry", date));
        return convertToDto(entry);
    }

    @Override
    @Transactional
    public WellnessEntryDto saveOrUpdateEntry(LocalDate date, WellnessEntryDto dto) {
        validateEntry(date, dto);

        logger.info("Saving/updating wellness entry for date: {}", date);

        WellnessEntry entry = jpaRepository.findById(date)
                .orElse(new WellnessEntry(date));

        // Update fields from DTO
        entry.setEntryDate(date);
        entry.setWaterIntakeMl(dto.getWaterIntakeMl());
        entry.setSteps(dto.getSteps());
        entry.setSleepHours(dto.getSleepHours());
        entry.setExerciseMinutes(dto.getExerciseMinutes());
        entry.setNotes(dto.getNotes());
        entry.setFoodItems(dto.getFoodItems());
        entry.setHabits(dto.getHabits());

        // Save via Spring Data JPA
        WellnessEntry savedEntry = jpaRepository.save(entry);

        // Also demonstrate synchronization with JDBC DAO
        try {
            jdbcDao.saveOrUpdate(savedEntry);
        } catch (Exception e) {
            logger.warn("JDBC mirror save notice: {}", e.getMessage());
        }

        return convertToDto(savedEntry);
    }

    @Override
    @Transactional
    public void deleteEntry(LocalDate date) {
        if (date == null) {
            throw new InvalidEntryException("Date cannot be null.");
        }
        logger.info("Deleting wellness entry for date: {}", date);

        if (!jpaRepository.existsById(date)) {
            throw new ResourceNotFoundException("Daily entry", date);
        }

        jpaRepository.deleteById(date);
        try {
            jdbcDao.deleteByDate(date);
        } catch (Exception e) {
            logger.warn("JDBC mirror delete notice: {}", e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DailySummaryDto getSummaryAnalytics() {
        logger.info("Computing summary analytics across all recorded history...");
        List<WellnessEntry> entries = jpaRepository.findAllByOrderByEntryDateDesc();

        try {
            // Leverage multithreaded asynchronous service
            DailySummaryDto summary = asyncAnalyticsService.calculateTrendsAsync(entries).get();

            // Compute category breakdown polymorphically using MetricCalculators
            Map<String, Double> breakdown = new HashMap<>();
            double totalLifeScore = 0.0;

            if (!entries.isEmpty() && !metricCalculators.isEmpty()) {
                for (MetricCalculator calculator : metricCalculators) {
                    double avgScore = entries.stream()
                            .mapToDouble(calculator::calculateScore)
                            .average()
                            .orElse(0.0);
                    breakdown.put(calculator.getCategoryName(), Math.round(avgScore * 10.0) / 10.0);
                    totalLifeScore += avgScore;
                }
                summary.setCategoryBreakdown(breakdown);
                summary.setOverallLifeScore(Math.round((totalLifeScore / metricCalculators.size()) * 10.0) / 10.0);
            } else {
                summary.setOverallLifeScore(0.0);
            }

            return summary;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            logger.error("Error executing asynchronous analytics: {}", e.getMessage());
            DailySummaryDto fallback = new DailySummaryDto();
            fallback.setTotalLoggedDays(entries.size());
            return fallback;
        }
    }

    /**
     * Business validation logic for FR-11.
     */
    private void validateEntry(LocalDate date, WellnessEntryDto dto) {
        if (date == null) {
            throw new InvalidEntryException("Entry date is required.");
        }
        if (dto.getSteps() != null && dto.getSteps() < 0) {
            throw new InvalidEntryException("Steps cannot be negative.");
        }
        if (dto.getWaterIntakeMl() != null && dto.getWaterIntakeMl() < 0) {
            throw new InvalidEntryException("Water intake cannot be negative.");
        }
        if (dto.getSleepHours() != null && (dto.getSleepHours() < 0 || dto.getSleepHours() > 24)) {
            throw new InvalidEntryException("Sleep hours must be between 0 and 24 hours.");
        }
        if (dto.getExerciseMinutes() != null && (dto.getExerciseMinutes() < 0 || dto.getExerciseMinutes() > 1440)) {
            throw new InvalidEntryException("Exercise minutes must be between 0 and 1440 minutes.");
        }
    }

    /**
     * Converts a JPA Entity into an API DTO and computes dynamic metrics.
     */
    private WellnessEntryDto convertToDto(WellnessEntry entry) {
        WellnessEntryDto dto = new WellnessEntryDto();
        dto.setEntryDate(entry.getEntryDate());
        dto.setWaterIntakeMl(entry.getWaterIntakeMl());
        dto.setSteps(entry.getSteps());
        dto.setSleepHours(entry.getSleepHours());
        dto.setExerciseMinutes(entry.getExerciseMinutes());
        dto.setNotes(entry.getNotes());
        dto.setFoodItems(entry.getFoodItems());
        dto.setHabits(entry.getHabits());

        // Derived analytics
        dto.setTotalCalories(entry.calculateTotalCalories());
        dto.setCompletedHabitsCount(entry.countCompletedHabits());

        // Compute composite score using polymorphic calculators
        double scoreSum = 0.0;
        if (!metricCalculators.isEmpty()) {
            for (MetricCalculator calculator : metricCalculators) {
                scoreSum += calculator.calculateScore(entry);
            }
            dto.setWellnessScore(Math.round((scoreSum / metricCalculators.size()) * 10.0) / 10.0);
        } else {
            dto.setWellnessScore(0.0);
        }

        return dto;
    }
}
