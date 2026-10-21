package com.lifeledger.repository;

import com.lifeledger.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByDateOrderByTimeOfDayDesc(LocalDate date);
    List<Activity> findByDateBetweenOrderByDateAsc(LocalDate startDate, LocalDate endDate);
}
