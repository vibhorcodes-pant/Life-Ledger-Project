package com.lifeledger.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String title;

    @Enumerated(EnumType.STRING)
    private ActivityType type;

    private Integer durationMinutes;
    private Integer caloriesBurned;
    private String intensity;
    private LocalTime timeOfDay;

    public Activity() {}

    public Activity(LocalDate date, String title, ActivityType type, Integer durationMinutes, Integer caloriesBurned, String intensity, LocalTime timeOfDay) {
        this.date = date;
        this.title = title;
        this.type = type;
        this.durationMinutes = durationMinutes;
        this.caloriesBurned = caloriesBurned;
        this.intensity = intensity;
        this.timeOfDay = timeOfDay;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
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
    public LocalTime getTimeOfDay() { return timeOfDay; }
    public void setTimeOfDay(LocalTime timeOfDay) { this.timeOfDay = timeOfDay; }
}
