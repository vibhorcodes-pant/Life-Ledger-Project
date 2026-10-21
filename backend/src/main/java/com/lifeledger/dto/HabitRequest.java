package com.lifeledger.dto;

import jakarta.validation.constraints.NotBlank;

public class HabitRequest {
    @NotBlank
    private String name;

    private String category;
    private Integer targetDaysPerWeek;
    private String icon;

    public HabitRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getTargetDaysPerWeek() { return targetDaysPerWeek; }
    public void setTargetDaysPerWeek(Integer targetDaysPerWeek) { this.targetDaysPerWeek = targetDaysPerWeek; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
