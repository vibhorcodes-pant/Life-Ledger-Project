package com.lifledger.model;

import jakarta.persistence.Embeddable;

/**
 * Represents a daily habit status item.
 */
@Embeddable
public class HabitItem {

    private String name;
    private Boolean completed;

    public HabitItem() {
        this.completed = false;
    }

    public HabitItem(String name, Boolean completed) {
        this.name = name;
        this.completed = completed != null ? completed : false;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getCompleted() {
        return completed != null ? completed : false;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    @Override
    public String toString() {
        return "HabitItem{" +
                "name='" + name + '\'' +
                ", completed=" + completed +
                '}';
    }
}
