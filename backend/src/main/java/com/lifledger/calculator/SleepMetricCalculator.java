package com.lifledger.calculator;

import com.lifledger.model.WellnessEntry;
import org.springframework.stereotype.Component;

/**
 * Calculates sleep consistency score based on 7-9 hours optimal range.
 * Implements MetricCalculator demonstrating Polymorphism.
 */
@Component
public class SleepMetricCalculator implements MetricCalculator {

    @Override
    public double calculateScore(WellnessEntry entry) {
        if (entry == null || entry.getSleepHours() == null) return 0.0;
        double hours = entry.getSleepHours();
        if (hours >= 7.0 && hours <= 9.0) {
            return 100.0;
        } else if (hours >= 6.0 && hours < 7.0) {
            return 80.0;
        } else if (hours > 9.0 && hours <= 10.0) {
            return 85.0;
        } else if (hours > 4.0 && hours < 6.0) {
            return 55.0;
        } else {
            return 30.0;
        }
    }

    @Override
    public String getCategoryName() {
        return "Sleep Quality";
    }
}
