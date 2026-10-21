package com.lifeledger.dto;

import com.lifeledger.model.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ActivityRequest {
    @NotBlank
    private String title;

    @NotNull
    private ActivityType type;

    @NotNull
    private Integer durationMinutes;

    private Integer caloriesBurned;
    private String intensity;

    public ActivityRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public ActivityType getType() { return type; }
    public void setType(ActivityType type) { this.type = type; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Integer getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }
    public String getIntensity() { return intensity; }
    public void setIntensity(String intensity) { this.intensity = intensity; }
}
