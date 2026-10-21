package com.lifeledger.dto;

import com.lifeledger.model.MealType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MealRequest {
    @NotNull
    private MealType mealType;

    @NotBlank
    private String foodName;

    @NotNull
    private Integer calories;

    private Double proteinGrams;
    private Double carbsGrams;
    private Double fatGrams;

    public MealRequest() {}

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
}
