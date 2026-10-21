package com.lifeledger.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "habits")
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Integer targetDaysPerWeek;
    private Integer currentStreak;
    private Boolean completedToday;
    private LocalDate lastCompletedDate;
    private String icon;

    public Habit() {}

    public Habit(String name, String category, Integer targetDaysPerWeek, Integer currentStreak, Boolean completedToday, LocalDate lastCompletedDate, String icon) {
        this.name = name;
        this.category = category;
        this.targetDaysPerWeek = targetDaysPerWeek;
        this.currentStreak = currentStreak;
        this.completedToday = completedToday;
        this.lastCompletedDate = lastCompletedDate;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getTargetDaysPerWeek() { return targetDaysPerWeek; }
    public void setTargetDaysPerWeek(Integer targetDaysPerWeek) { this.targetDaysPerWeek = targetDaysPerWeek; }
    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }
    public Boolean getCompletedToday() { return completedToday; }
    public void setCompletedToday(Boolean completedToday) { this.completedToday = completedToday; }
    public LocalDate getLastCompletedDate() { return lastCompletedDate; }
    public void setLastCompletedDate(LocalDate lastCompletedDate) { this.lastCompletedDate = lastCompletedDate; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
