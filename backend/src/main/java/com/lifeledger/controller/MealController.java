package com.lifeledger.controller;

import com.lifeledger.dto.MealRequest;
import com.lifeledger.model.Meal;
import com.lifeledger.service.MealService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public ResponseEntity<List<Meal>> getMeals(
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(mealService.getMealsForDate(queryDate));
    }

    @PostMapping
    public ResponseEntity<Meal> addMeal(@Valid @RequestBody MealRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mealService.addMeal(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        mealService.deleteMeal(id);
        return ResponseEntity.noContent().build();
    }
}
