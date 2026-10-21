package com.lifeledger.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "hydration_logs")
public class HydrationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Integer amountMl;
    private LocalTime loggedAt;

    public HydrationLog() {}

    public HydrationLog(LocalDate date, Integer amountMl, LocalTime loggedAt) {
        this.date = date;
        this.amountMl = amountMl;
        this.loggedAt = loggedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Integer getAmountMl() { return amountMl; }
    public void setAmountMl(Integer amountMl) { this.amountMl = amountMl; }
    public LocalTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(LocalTime loggedAt) { this.loggedAt = loggedAt; }
}
