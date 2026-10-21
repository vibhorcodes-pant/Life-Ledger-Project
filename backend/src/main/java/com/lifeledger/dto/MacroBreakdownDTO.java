package com.lifeledger.dto;

public class MacroBreakdownDTO {
    private double proteinGrams;
    private double carbsGrams;
    private double fatGrams;

    public MacroBreakdownDTO() {}

    public MacroBreakdownDTO(double proteinGrams, double carbsGrams, double fatGrams) {
        this.proteinGrams = proteinGrams;
        this.carbsGrams = carbsGrams;
        this.fatGrams = fatGrams;
    }

    public double getProteinGrams() { return proteinGrams; }
    public void setProteinGrams(double proteinGrams) { this.proteinGrams = proteinGrams; }
    public double getCarbsGrams() { return carbsGrams; }
    public void setCarbsGrams(double carbsGrams) { this.carbsGrams = carbsGrams; }
    public double getFatGrams() { return fatGrams; }
    public void setFatGrams(double fatGrams) { this.fatGrams = fatGrams; }
}
