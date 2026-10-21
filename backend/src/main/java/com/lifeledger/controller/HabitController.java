package com.lifeledger.controller;

import com.lifeledger.dto.HabitRequest;
import com.lifeledger.model.Habit;
import com.lifeledger.service.HabitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public ResponseEntity<List<Habit>> getHabits() {
        return ResponseEntity.ok(habitService.getAllHabits());
    }

    @PostMapping
    public ResponseEntity<Habit> createHabit(@Valid @RequestBody HabitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(habitService.createHabit(request));
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<Habit> toggleHabit(@PathVariable Long id) {
        return ResponseEntity.ok(habitService.toggleHabit(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.noContent().build();
    }
}
