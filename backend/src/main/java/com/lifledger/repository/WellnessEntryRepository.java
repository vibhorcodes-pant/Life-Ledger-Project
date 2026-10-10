package com.lifledger.repository;

import com.lifledger.model.WellnessEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA Repository for WellnessEntry entity.
 * Provides high-level object-relational mapping and standard CRUD operations.
 */
@Repository
public interface WellnessEntryRepository extends JpaRepository<WellnessEntry, LocalDate> {

    List<WellnessEntry> findAllByOrderByEntryDateDesc();

    List<WellnessEntry> findByEntryDateBetweenOrderByEntryDateAsc(LocalDate startDate, LocalDate endDate);
}
