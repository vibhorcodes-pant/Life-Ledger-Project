package com.lifledger.dto;

import java.util.HashMap;
import java.util.Map;

/**
 * Aggregated summary metrics DTO.
 * Demonstrates Java Collections (Map) and Generics.
 */
public class DailySummaryDto {

    private long totalLoggedDays;
    private double averageSteps;
    private double averageWaterMl;
    private double averageSleepHours;
    private double averageExerciseMinutes;
    private double overallLifeScore;
    private Map<String, Double> categoryBreakdown = new HashMap<>();

    public DailySummaryDto() {}

    public long getTotalLoggedDays() {
        return totalLoggedDays;
    }

    public void setTotalLoggedDays(long totalLoggedDays) {
        this.totalLoggedDays = totalLoggedDays;
    }

    public double getAverageSteps() {
        return averageSteps;
    }

    public void setAverageSteps(double averageSteps) {
        this.averageSteps = averageSteps;
    }

    public double getAverageWaterMl() {
        return averageWaterMl;
    }

    public void setAverageWaterMl(double averageWaterMl) {
        this.averageWaterMl = averageWaterMl;
    }

    public double getAverageSleepHours() {
        return averageSleepHours;
    }

    public void setAverageSleepHours(double averageSleepHours) {
        this.averageSleepHours = averageSleepHours;
    }

    public double getAverageExerciseMinutes() {
        return averageExerciseMinutes;
    }

    public void setAverageExerciseMinutes(double averageExerciseMinutes) {
        this.averageExerciseMinutes = averageExerciseMinutes;
    }

    public double getOverallLifeScore() {
        return overallLifeScore;
    }

    public void setOverallLifeScore(double overallLifeScore) {
        this.overallLifeScore = overallLifeScore;
    }

    public Map<String, Double> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Double> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
