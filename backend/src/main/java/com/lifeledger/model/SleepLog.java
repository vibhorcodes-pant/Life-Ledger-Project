package com.lifeledger.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "sleep_logs")
public class SleepLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime bedTime;
    private LocalTime wakeTime;
    private Integer durationMinutes;
    private Integer deepSleepMinutes;

    @Enumerated(EnumType.STRING)
    private SleepQuality quality;

    private Integer score;

    public SleepLog() {}

    public SleepLog(LocalDate date, LocalTime bedTime, LocalTime wakeTime, Integer durationMinutes, Integer deepSleepMinutes, SleepQuality quality, Integer score) {
        this.date = date;
        this.bedTime = bedTime;
        this.wakeTime = wakeTime;
        this.durationMinutes = durationMinutes;
        this.deepSleepMinutes = deepSleepMinutes;
        this.quality = quality;
        this.score = score;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getBedTime() { return bedTime; }
    public void setBedTime(LocalTime bedTime) { this.bedTime = bedTime; }
    public LocalTime getWakeTime() { return wakeTime; }
    public void setWakeTime(LocalTime wakeTime) { this.wakeTime = wakeTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Integer getDeepSleepMinutes() { return deepSleepMinutes; }
    public void setDeepSleepMinutes(Integer deepSleepMinutes) { this.deepSleepMinutes = deepSleepMinutes; }
    public SleepQuality getQuality() { return quality; }
    public void setQuality(SleepQuality quality) { this.quality = quality; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}
