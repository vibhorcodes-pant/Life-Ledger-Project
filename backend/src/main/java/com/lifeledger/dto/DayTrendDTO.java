package com.lifeledger.dto;

import java.time.LocalDate;

public class DayTrendDTO {
    private LocalDate date;
    private String dayOfWeek;
    private int steps;
    private int waterMl;
    private int caloriesBurned;
    private int caloriesConsumed;
    private double sleepHours;
    private int wellnessScore;

    public DayTrendDTO() {}

    public DayTrendDTO(LocalDate date, String dayOfWeek, int steps, int waterMl, int caloriesBurned, int caloriesConsumed, double sleepHours, int wellnessScore) {
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.steps = steps;
        this.waterMl = waterMl;
        this.caloriesBurned = caloriesBurned;
        this.caloriesConsumed = caloriesConsumed;
        this.sleepHours = sleepHours;
        this.wellnessScore = wellnessScore;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public int getSteps() { return steps; }
    public void setSteps(int steps) { this.steps = steps; }
    public int getWaterMl() { return waterMl; }
    public void setWaterMl(int waterMl) { this.waterMl = waterMl; }
    public int getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(int caloriesBurned) { this.caloriesBurned = caloriesBurned; }
    public int getCaloriesConsumed() { return caloriesConsumed; }
    public void setCaloriesConsumed(int caloriesConsumed) { this.caloriesConsumed = caloriesConsumed; }
    public double getSleepHours() { return sleepHours; }
    public void setSleepHours(double sleepHours) { this.sleepHours = sleepHours; }
    public int getWellnessScore() { return wellnessScore; }
    public void setWellnessScore(int wellnessScore) { this.wellnessScore = wellnessScore; }
}
