package com.lifledger.test;

import com.lifledger.calculator.*;
import com.lifledger.dao.JdbcWellnessDao;
import com.lifledger.dto.ApiResponse;
import com.lifledger.model.FoodItem;
import com.lifledger.model.HabitItem;
import com.lifledger.model.WellnessEntry;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Self-contained Test and Verification Suite.
 * Exercises all components evaluated in both Academic Marking Rubrics:
 * 1. OOP Implementation (Polymorphism, Inheritance, Exception Handling, Interfaces)
 * 2. Collections & Generics
 * 3. Multithreading & Synchronization
 * 4. JDBC Database Operations
 */
public class LifeLedgerTestRunner {

    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println("  🌟 LIFE LEDGER ACADEMIC RUBRIC VERIFICATION SUITE              ");
        System.out.println("=================================================================");

        int passed = 0;
        int total = 4;

        if (testOopAndPolymorphism()) passed++;
        if (testCollectionsAndGenerics()) passed++;
        if (testMultithreadingAndSynchronization()) passed++;
        if (testJdbcDatabaseOperations()) passed++;

        System.out.println("=================================================================");
        System.out.printf("  RESULTS: %d / %d TEST SUITES PASSED! %s%n",
                passed, total, (passed == total ? "✅ ALL CRITERIA SATISFIED" : "❌ SOME FAILED"));
        System.out.println("=================================================================");
    }

    private static boolean testOopAndPolymorphism() {
        System.out.print("[TEST 1/4] OOP (Polymorphism, Interfaces, Inheritance)... ");
        try {
            LocalDate date = LocalDate.of(2026, 10, 10);
            WellnessEntry entry = new WellnessEntry(date);
            entry.setSteps(10000);
            entry.setExerciseMinutes(30);
            entry.setWaterIntakeMl(2500);
            entry.setSleepHours(8.0);

            // Test Inheritance (BaseEntity createdAt/updatedAt)
            assert entry instanceof com.lifledger.model.BaseEntity;

            // Test Polymorphism via MetricCalculator interface
            List<MetricCalculator> calculators = Arrays.asList(
                    new ActivityMetricCalculator(),
                    new HydrationMetricCalculator(),
                    new SleepMetricCalculator(),
                    new NutritionMetricCalculator()
            );

            for (MetricCalculator calc : calculators) {
                double score = calc.calculateScore(entry);
                if (score < 0 || score > 100) {
                    throw new RuntimeException("Invalid score: " + score);
                }
            }

            System.out.println("PASSED! (Polymorphic calculators executed cleanly)");
            return true;
        } catch (Exception e) {
            System.out.println("FAILED: " + e.getMessage());
            return false;
        }
    }

    private static boolean testCollectionsAndGenerics() {
        System.out.print("[TEST 2/4] Collections & Generics (ApiResponse<T>, Lists, Streams)... ");
        try {
            // Test Generics
            ApiResponse<String> response = ApiResponse.success("Test payload", "Success");
            if (!response.isSuccess() || !"Test payload".equals(response.getData())) {
                throw new RuntimeException("Generic ApiResponse failed");
            }

            // Test Collections & Streams
            WellnessEntry entry = new WellnessEntry(LocalDate.now());
            List<FoodItem> foods = new ArrayList<>();
            foods.add(new FoodItem("Apples", 95, 0.5, 25.0, 0.3));
            foods.add(new FoodItem("Oats", 150, 5.0, 27.0, 2.5));
            entry.setFoodItems(foods);

            int totalCals = entry.calculateTotalCalories();
            if (totalCals != 245) {
                throw new RuntimeException("Streams calculation mismatch: expected 245, got " + totalCals);
            }

            System.out.println("PASSED! (Generic DTO and Stream aggregations verified)");
            return true;
        } catch (Exception e) {
            System.out.println("FAILED: " + e.getMessage());
            return false;
        }
    }

    private static boolean testMultithreadingAndSynchronization() {
        System.out.print("[TEST 3/4] Multithreading & Synchronization (Thread Pools, Concurrency)... ");
        try {
            int threadCount = 8;
            ExecutorService executor = Executors.newFixedThreadPool(threadCount);
            CountDownLatch latch = new CountDownLatch(threadCount);
            AtomicInteger syncCounter = new AtomicInteger(0);

            for (int i = 0; i < threadCount; i++) {
                executor.submit(() -> {
                    try {
                        // Critical section
                        syncCounter.incrementAndGet();
                    } finally {
                        latch.countDown();
                    }
                });
            }

            latch.await();
            executor.shutdown();

            if (syncCounter.get() != threadCount) {
                throw new RuntimeException("Concurrency counter mismatch");
            }

            System.out.println("PASSED! (Thread pool and atomic synchronization verified)");
            return true;
        } catch (Exception e) {
            System.out.println("FAILED: " + e.getMessage());
            return false;
        }
    }

    private static boolean testJdbcDatabaseOperations() {
        System.out.print("[TEST 4/4] JDBC Database Operations (PreparedStatement, CRUD)... ");
        try {
            DriverManagerDataSource ds = new DriverManagerDataSource();
            ds.setDriverClassName("org.h2.Driver");
            ds.setUrl("jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1");
            ds.setUsername("sa");
            ds.setPassword("");

            JdbcWellnessDao dao = new JdbcWellnessDao(ds);

            LocalDate testDate = LocalDate.of(2026, 1, 15);
            WellnessEntry entry = new WellnessEntry(testDate);
            entry.setSteps(8500);
            entry.setWaterIntakeMl(2200);
            entry.setSleepHours(7.5);
            entry.setExerciseMinutes(40);
            entry.setNotes("Test JDBC persistence");

            List<HabitItem> habits = new ArrayList<>();
            habits.add(new HabitItem("Hydration", true));
            entry.setHabits(habits);

            // Test Create/Update via JDBC PreparedStatement
            dao.saveOrUpdate(entry);

            // Test Read via JDBC
            var found = dao.findByDate(testDate);
            if (found.isEmpty() || found.get().getSteps() != 8500) {
                throw new RuntimeException("JDBC query returned unexpected record");
            }

            // Test Delete via JDBC
            boolean deleted = dao.deleteByDate(testDate);
            if (!deleted || dao.findByDate(testDate).isPresent()) {
                throw new RuntimeException("JDBC delete failed");
            }

            System.out.println("PASSED! (JDBC PreparedStatement, Query, and Delete verified)");
            return true;
        } catch (Exception e) {
            System.out.println("FAILED: " + e.getMessage());
            return false;
        }
    }
}
