package com.lifeledger.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class QuickHydrationRequest {
    @NotNull
    @Min(50)
    private Integer amountMl;

    public QuickHydrationRequest() {}

    public QuickHydrationRequest(Integer amountMl) {
        this.amountMl = amountMl;
    }

    public Integer getAmountMl() { return amountMl; }
    public void setAmountMl(Integer amountMl) { this.amountMl = amountMl; }
}
