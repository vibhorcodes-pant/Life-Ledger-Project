package com.lifeledger.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private MealType mealType;

    private String foodName;
    private Integer calories;
    private Double proteinGrams;
    private Double carbsGrams;
    private Double fatGrams;
    private LocalTime recordedAt;

    public Meal() {}

    public Meal(LocalDate date, MealType mealType, String foodName, Integer calories, Double proteinGrams, Double carbsGrams, Double fatGrams, LocalTime recordedAt) {
        this.date = date;
        this.mealType = mealType;
        this.foodName = foodName;
        this.calories = calories;
        this.proteinGrams = proteinGrams;
        this.carbsGrams = carbsGrams;
        this.fatGrams = fatGrams;
        this.recordedAt = recordedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public MealType getMealType() { return mealType; }
    public void setMealType(MealType mealType) { this.mealType = mealType; }
    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public Double getProteinGrams() { return proteinGrams; }
    public void setProteinGrams(Double proteinGrams) { this.proteinGrams = proteinGrams; }
    public Double getCarbsGrams() { return carbsGrams; }
    public void setCarbsGrams(Double carbsGrams) { this.carbsGrams = carbsGrams; }
    public Double getFatGrams() { return fatGrams; }
    public void setFatGrams(Double fatGrams) { this.fatGrams = fatGrams; }
    public LocalTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalTime recordedAt) { this.recordedAt = recordedAt; }
}
