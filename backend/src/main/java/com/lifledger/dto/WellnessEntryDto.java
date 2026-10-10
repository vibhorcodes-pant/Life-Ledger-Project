package com.lifledger.dto;

import com.lifledger.model.FoodItem;
import com.lifledger.model.HabitItem;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Transfer Object (DTO) for Wellness Entries.
 * Decouples internal database entities from external API contracts.
 */
public class WellnessEntryDto {

    private LocalDate entryDate;
    private Integer waterIntakeMl;
    private Integer steps;
    private Double sleepHours;
    private Integer exerciseMinutes;
    private String notes;
    private List<FoodItem> foodItems = new ArrayList<>();
    private List<HabitItem> habits = new ArrayList<>();

    // Calculated fields
    private Integer totalCalories;
    private Long completedHabitsCount;
    private Double wellnessScore;

    public WellnessEntryDto() {
        this.waterIntakeMl = 0;
        this.steps = 0;
        this.sleepHours = 0.0;
        this.exerciseMinutes = 0;
        this.notes = "";
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public Integer getWaterIntakeMl() {
        return waterIntakeMl != null ? waterIntakeMl : 0;
    }

    public void setWaterIntakeMl(Integer waterIntakeMl) {
        this.waterIntakeMl = waterIntakeMl;
    }

    public Integer getSteps() {
        return steps != null ? steps : 0;
    }

    public void setSteps(Integer steps) {
        this.steps = steps;
    }

    public Double getSleepHours() {
        return sleepHours != null ? sleepHours : 0.0;
    }

    public void setSleepHours(Double sleepHours) {
        this.sleepHours = sleepHours;
    }

    public Integer getExerciseMinutes() {
        return exerciseMinutes != null ? exerciseMinutes : 0;
    }

    public void setExerciseMinutes(Integer exerciseMinutes) {
        this.exerciseMinutes = exerciseMinutes;
    }

    public String getNotes() {
        return notes != null ? notes : "";
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<FoodItem> getFoodItems() {
        return foodItems != null ? foodItems : new ArrayList<>();
    }

    public void setFoodItems(List<FoodItem> foodItems) {
        this.foodItems = foodItems != null ? foodItems : new ArrayList<>();
    }

    public List<HabitItem> getHabits() {
        return habits != null ? habits : new ArrayList<>();
    }

    public void setHabits(List<HabitItem> habits) {
        this.habits = habits != null ? habits : new ArrayList<>();
    }

    public Integer getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(Integer totalCalories) {
        this.totalCalories = totalCalories;
    }

    public Long getCompletedHabitsCount() {
        return completedHabitsCount;
    }

    public void setCompletedHabitsCount(Long completedHabitsCount) {
        this.completedHabitsCount = completedHabitsCount;
    }

    public Double getWellnessScore() {
        return wellnessScore;
    }

    public void setWellnessScore(Double wellnessScore) {
        this.wellnessScore = wellnessScore;
    }
}
