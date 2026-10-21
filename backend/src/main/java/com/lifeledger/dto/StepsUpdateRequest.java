package com.lifeledger.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StepsUpdateRequest {
    @NotNull
    @Min(0)
    private Integer steps;

    public StepsUpdateRequest() {}

    public StepsUpdateRequest(Integer steps) {
        this.steps = steps;
    }

    public Integer getSteps() { return steps; }
    public void setSteps(Integer steps) { this.steps = steps; }
}
