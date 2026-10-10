package com.lifledger.calculator;

import com.lifledger.model.WellnessEntry;

/**
 * Interface defining calculation strategy for wellness components.
 * Demonstrates Java Interfaces and Polymorphic design.
 */
public interface MetricCalculator {

    /**
     * Calculates a normalized performance score between 0 and 100 for the daily entry.
     *
     * @param entry the daily wellness entry
     * @return score from 0 to 100
     */
    double calculateScore(WellnessEntry entry);

    /**
     * Returns the name of the metric category (e.g., "Hydration", "Activity").
     */
    String getCategoryName();
}
