package com.lifeledger.service;

import com.lifeledger.dto.MealRequest;
import com.lifeledger.model.Meal;
import com.lifeledger.repository.MealRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class MealService {

    private final MealRepository mealRepository;

    public MealService(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    public List<Meal> getMealsForDate(LocalDate date) {
        return mealRepository.findByDateOrderByRecordedAtAsc(date);
    }

    @Transactional
    public Meal addMeal(MealRequest request) {
        Meal meal = new Meal(
                LocalDate.now(),
                request.getMealType(),
                request.getFoodName(),
                request.getCalories(),
                request.getProteinGrams() != null ? request.getProteinGrams() : 0.0,
                request.getCarbsGrams() != null ? request.getCarbsGrams() : 0.0,
                request.getFatGrams() != null ? request.getFatGrams() : 0.0,
                LocalTime.now()
        );
        return mealRepository.save(meal);
    }

    @Transactional
    public void deleteMeal(Long id) {
        mealRepository.deleteById(id);
    }
}
