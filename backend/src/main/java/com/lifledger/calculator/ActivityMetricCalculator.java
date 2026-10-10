package com.lifledger.calculator;

import com.lifledger.model.WellnessEntry;
import org.springframework.stereotype.Component;

/**
 * Calculates activity score based on daily steps (target: 10,000) and exercise minutes (target: 30).
 * Implements MetricCalculator demonstrating Polymorphism.
 */
@Component
public class ActivityMetricCalculator implements MetricCalculator {

    private static final int TARGET_STEPS = 10000;
    private static final int TARGET_EXERCISE_MINUTES = 30;

    @Override
    public double calculateScore(WellnessEntry entry) {
        if (entry == null) return 0.0;
        
        double stepScore = Math.min(100.0, ((double) entry.getSteps() / TARGET_STEPS) * 60.0);
        double exerciseScore = Math.min(100.0, ((double) entry.getExerciseMinutes() / TARGET_EXERCISE_MINUTES) * 40.0);
        
        return Math.min(100.0, Math.round((stepScore + exerciseScore) * 10.0) / 10.0);
    }

    @Override
    public String getCategoryName() {
        return "Activity & Fitness";
    }
}
