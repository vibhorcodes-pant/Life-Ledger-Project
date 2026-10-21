package com.lifeledger.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_metrics")
public class DailyMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private LocalDate date;

    private Integer steps;
    private Integer stepsTarget;
    private Integer caloriesBurnedTarget;
    private Integer caloriesIntakeTarget;
    private Integer waterTargetMl;
    private Double sleepHoursTarget;

    public DailyMetric() {}

    public DailyMetric(LocalDate date, Integer steps, Integer stepsTarget, Integer caloriesBurnedTarget, Integer caloriesIntakeTarget, Integer waterTargetMl, Double sleepHoursTarget) {
        this.date = date;
        this.steps = steps;
        this.stepsTarget = stepsTarget;
        this.caloriesBurnedTarget = caloriesBurnedTarget;
        this.caloriesIntakeTarget = caloriesIntakeTarget;
        this.waterTargetMl = waterTargetMl;
        this.sleepHoursTarget = sleepHoursTarget;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Integer getSteps() { return steps; }
    public void setSteps(Integer steps) { this.steps = steps; }
    public Integer getStepsTarget() { return stepsTarget; }
    public void setStepsTarget(Integer stepsTarget) { this.stepsTarget = stepsTarget; }
    public Integer getCaloriesBurnedTarget() { return caloriesBurnedTarget; }
    public void setCaloriesBurnedTarget(Integer caloriesBurnedTarget) { this.caloriesBurnedTarget = caloriesBurnedTarget; }
    public Integer getCaloriesIntakeTarget() { return caloriesIntakeTarget; }
    public void setCaloriesIntakeTarget(Integer caloriesIntakeTarget) { this.caloriesIntakeTarget = caloriesIntakeTarget; }
    public Integer getWaterTargetMl() { return waterTargetMl; }
    public void setWaterTargetMl(Integer waterTargetMl) { this.waterTargetMl = waterTargetMl; }
    public Double getSleepHoursTarget() { return sleepHoursTarget; }
    public void setSleepHoursTarget(Double sleepHoursTarget) { this.sleepHoursTarget = sleepHoursTarget; }
}
