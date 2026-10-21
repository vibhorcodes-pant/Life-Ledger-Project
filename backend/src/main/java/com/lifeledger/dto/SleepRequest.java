package com.lifeledger.dto;

import com.lifeledger.model.SleepQuality;
import jakarta.validation.constraints.NotNull;

public class SleepRequest {
    private String bedTime;
    private String wakeTime;

    @NotNull
    private Integer durationMinutes;

    private Integer deepSleepMinutes;
    private SleepQuality quality;
    private Integer score;

    public SleepRequest() {}

    public String getBedTime() { return bedTime; }
    public void setBedTime(String bedTime) { this.bedTime = bedTime; }
    public String getWakeTime() { return wakeTime; }
    public void setWakeTime(String wakeTime) { this.wakeTime = wakeTime; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public Integer getDeepSleepMinutes() { return deepSleepMinutes; }
    public void setDeepSleepMinutes(Integer deepSleepMinutes) { this.deepSleepMinutes = deepSleepMinutes; }
    public SleepQuality getQuality() { return quality; }
    public void setQuality(SleepQuality quality) { this.quality = quality; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}
