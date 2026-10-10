package com.lifledger.calculator;

import com.lifledger.model.WellnessEntry;
import org.springframework.stereotype.Component;

/**
 * Calculates hydration score based on daily water intake in ml (recommended: 2500 ml).
 * Implements MetricCalculator demonstrating Polymorphism.
 */
@Component
public class HydrationMetricCalculator implements MetricCalculator {

    private static final int TARGET_WATER_ML = 2500;

    @Override
    public double calculateScore(WellnessEntry entry) {
        if (entry == null || entry.getWaterIntakeMl() == null) return 0.0;
        double ratio = (double) entry.getWaterIntakeMl() / TARGET_WATER_ML;
        return Math.min(100.0, Math.round(ratio * 100.0 * 10.0) / 10.0);
    }

    @Override
    public String getCategoryName() {
        return "Hydration";
    }
}
