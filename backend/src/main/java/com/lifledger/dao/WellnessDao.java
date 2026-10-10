package com.lifledger.dao;

import com.lifledger.model.WellnessEntry;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Data Access Object (DAO) Interface defining CRUD operations for wellness records.
 * Demonstrates the DAO Design Pattern in Java.
 */
public interface WellnessDao {

    /**
     * Retrieves an entry by its date.
     */
    Optional<WellnessEntry> findByDate(LocalDate date);

    /**
     * Retrieves all recorded wellness entries sorted descending by date.
     */
    List<WellnessEntry> findAll();

    /**
     * Saves or updates a wellness entry using JDBC PreparedStatement.
     */
    WellnessEntry saveOrUpdate(WellnessEntry entry);

    /**
     * Deletes a wellness record by date.
     * @return true if deleted, false if not found
     */
    boolean deleteByDate(LocalDate date);

    /**
     * Counts the total number of entries in the database.
     */
    long countEntries();
}
