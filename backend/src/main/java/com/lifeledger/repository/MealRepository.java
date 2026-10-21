package com.lifeledger.repository;

import com.lifeledger.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByDateOrderByRecordedAtAsc(LocalDate date);
    List<Meal> findByDateBetweenOrderByDateAsc(LocalDate startDate, LocalDate endDate);
}
