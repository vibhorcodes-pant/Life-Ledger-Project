package com.lifledger.calculator;

import com.lifledger.model.WellnessEntry;
import org.springframework.stereotype.Component;

/**
 * Calculates nutrition balance score based on logged food items and estimated calories.
 * Implements MetricCalculator demonstrating Polymorphism.
 */
@Component
public class NutritionMetricCalculator implements MetricCalculator {

    private static final int BASELINE_CALORIES = 2000;

    @Override
    public double calculateScore(WellnessEntry entry) {
        if (entry == null || entry.getFoodItems() == null || entry.getFoodItems().isEmpty()) {
            return 50.0; // Baseline neutral score if no log
        }
        int totalCalories = entry.calculateTotalCalories();
        // Ratio around baseline 2000 calories
        double diff = Math.abs(totalCalories - BASELINE_CALORIES);
        double score = Math.max(20.0, 100.0 - (diff / BASELINE_CALORIES) * 80.0);
        return Math.round(score * 10.0) / 10.0;
    }

    @Override
    public String getCategoryName() {
        return "Nutrition Balance";
    }
}
