package com.lifledger.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Core entity representing a user's daily wellness entry.
 * Extends BaseEntity to demonstrate OOP inheritance.
 * Uses Java Collections (List) to hold food items and habits.
 */
@Entity
@Table(name = "wellness_entries")
public class WellnessEntry extends BaseEntity {

    @Id
    @Column(name = "entry_date", nullable = false, unique = true)
    private LocalDate entryDate;

    @Column(name = "water_intake_ml")
    private Integer waterIntakeMl;

    @Column(name = "steps")
    private Integer steps;

    @Column(name = "sleep_hours")
    private Double sleepHours;

    @Column(name = "exercise_minutes")
    private Integer exerciseMinutes;

    @Column(name = "notes", length = 2000)
    private String notes;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "entry_food_items", joinColumns = @JoinColumn(name = "entry_date"))
    private List<FoodItem> foodItems = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "entry_habits", joinColumns = @JoinColumn(name = "entry_date"))
    private List<HabitItem> habits = new ArrayList<>();

    public WellnessEntry() {
        this.waterIntakeMl = 0;
        this.steps = 0;
        this.sleepHours = 0.0;
        this.exerciseMinutes = 0;
        this.notes = "";
    }

    public WellnessEntry(LocalDate entryDate) {
        this();
        this.entryDate = entryDate;
    }

    // Getters and Setters
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

    /**
     * Demonstrates Java Streams and Collections processing.
     * Computes the aggregated estimated calories for the day.
     */
    public int calculateTotalCalories() {
        if (foodItems == null || foodItems.isEmpty()) {
            return 0;
        }
        return foodItems.stream()
                .mapToInt(FoodItem::getCalories)
                .sum();
    }

    /**
     * Demonstrates Java Streams to count completed daily habits.
     */
    public long countCompletedHabits() {
        if (habits == null || habits.isEmpty()) {
            return 0;
        }
        return habits.stream()
                .filter(HabitItem::getCompleted)
                .count();
    }
}
