package com.lifeledger.repository;

import com.lifeledger.model.HydrationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HydrationLogRepository extends JpaRepository<HydrationLog, Long> {
    List<HydrationLog> findByDateOrderByLoggedAtAsc(LocalDate date);
    List<HydrationLog> findByDateBetweenOrderByDateAsc(LocalDate startDate, LocalDate endDate);
}
