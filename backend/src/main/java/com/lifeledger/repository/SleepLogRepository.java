package com.lifeledger.repository;

import com.lifeledger.model.SleepLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SleepLogRepository extends JpaRepository<SleepLog, Long> {
    Optional<SleepLog> findByDate(LocalDate date);
    List<SleepLog> findByDateBetweenOrderByDateAsc(LocalDate startDate, LocalDate endDate);
}
