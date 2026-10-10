package com.lifledger.model;

import jakarta.persistence.Embeddable;

/**
 * Represents a single logged food item with estimated nutritional breakdown.
 * Demonstrates encapsulation in Java.
 */
@Embeddable
public class FoodItem {

    private String name;
    private Integer calories;
    private Double proteinGrams;
    private Double carbsGrams;
    private Double fatGrams;

    public FoodItem() {}

    public FoodItem(String name, Integer calories, Double proteinGrams, Double carbsGrams, Double fatGrams) {
        this.name = name;
        this.calories = calories;
        this.proteinGrams = proteinGrams;
        this.carbsGrams = carbsGrams;
        this.fatGrams = fatGrams;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCalories() {
        return calories != null ? calories : 0;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public Double getProteinGrams() {
        return proteinGrams != null ? proteinGrams : 0.0;
    }

    public void setProteinGrams(Double proteinGrams) {
        this.proteinGrams = proteinGrams;
    }

    public Double getCarbsGrams() {
        return carbsGrams != null ? carbsGrams : 0.0;
    }

    public void setCarbsGrams(Double carbsGrams) {
        this.carbsGrams = carbsGrams;
    }

    public Double getFatGrams() {
        return fatGrams != null ? fatGrams : 0.0;
    }

    public void setFatGrams(Double fatGrams) {
        this.fatGrams = fatGrams;
    }

    @Override
    public String toString() {
        return "FoodItem{" +
                "name='" + name + '\'' +
                ", calories=" + calories +
                ", protein=" + proteinGrams + "g" +
                ", carbs=" + carbsGrams + "g" +
                ", fat=" + fatGrams + "g" +
                '}';
    }
}
