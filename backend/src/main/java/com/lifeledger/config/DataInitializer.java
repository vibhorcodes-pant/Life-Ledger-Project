package com.lifeledger.config;

import com.lifeledger.model.*;
import com.lifeledger.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final HabitRepository habitRepository;
    private final ActivityRepository activityRepository;
    private final MealRepository mealRepository;
    private final HydrationLogRepository hydrationLogRepository;
    private final SleepLogRepository sleepLogRepository;
    private final DailyMetricRepository dailyMetricRepository;

    public DataInitializer(
            HabitRepository habitRepository,
            ActivityRepository activityRepository,
            MealRepository mealRepository,
            HydrationLogRepository hydrationLogRepository,
            SleepLogRepository sleepLogRepository,
            DailyMetricRepository dailyMetricRepository) {
        this.habitRepository = habitRepository;
        this.activityRepository = activityRepository;
        this.mealRepository = mealRepository;
        this.hydrationLogRepository = hydrationLogRepository;
        this.sleepLogRepository = sleepLogRepository;
        this.dailyMetricRepository = dailyMetricRepository;
    }

    @Override
    public void run(String... args) {
        LocalDate today = LocalDate.now();

        if (habitRepository.count() == 0) {
            habitRepository.save(new Habit("Morning Mindfulness", "MIND", 7, 5, true, today, "brain"));
            habitRepository.save(new Habit("10,000 Daily Steps", "BODY", 7, 8, false, today.minusDays(1), "footprints"));
            habitRepository.save(new Habit("Drink 2.5L Water", "NUTRITION", 7, 12, true, today, "droplets"));
            habitRepository.save(new Habit("7.5h Restful Sleep", "SLEEP", 7, 6, true, today, "moon"));
            habitRepository.save(new Habit("Deep Focus Reading", "FOCUS", 5, 4, false, today.minusDays(1), "book-open"));
            habitRepository.save(new Habit("Evening Mobility & Stretch", "BODY", 5, 3, false, today.minusDays(1), "activity"));
        }

        if (mealRepository.count() == 0) {
            mealRepository.save(new Meal(today, MealType.BREAKFAST, "Avocado Toast & Poached Eggs", 420, 22.0, 34.0, 18.0, LocalTime.of(8, 30)));
            mealRepository.save(new Meal(today, MealType.LUNCH, "Grilled Chicken Quinoa Bowl", 640, 48.0, 52.0, 16.0, LocalTime.of(13, 15)));
            mealRepository.save(new Meal(today, MealType.SNACK, "Greek Yogurt with Berries & Walnuts", 210, 18.0, 16.0, 7.0, LocalTime.of(16, 45)));
            mealRepository.save(new Meal(today, MealType.DINNER, "Pan-Seared Salmon & Roast Veggies", 580, 42.0, 24.0, 28.0, LocalTime.of(19, 45)));
        }

        if (activityRepository.count() == 0) {
            activityRepository.save(new Activity(today, "Sunrise Trail Run", ActivityType.RUNNING, 35, 395, "HIGH", LocalTime.of(7, 15)));
            activityRepository.save(new Activity(today, "Lunchtime Brisk Walk", ActivityType.WALKING, 25, 110, "LOW", LocalTime.of(13, 45)));
            activityRepository.save(new Activity(today, "Core & Mobility Flow", ActivityType.YOGA, 20, 95, "MODERATE", LocalTime.of(18, 0)));
        }

        if (hydrationLogRepository.count() == 0) {
            hydrationLogRepository.save(new HydrationLog(today, 500, LocalTime.of(7, 30)));
            hydrationLogRepository.save(new HydrationLog(today, 500, LocalTime.of(10, 0)));
            hydrationLogRepository.save(new HydrationLog(today, 350, LocalTime.of(12, 30)));
            hydrationLogRepository.save(new HydrationLog(today, 500, LocalTime.of(15, 15)));
            hydrationLogRepository.save(new HydrationLog(today, 250, LocalTime.of(17, 45)));
        }

        if (sleepLogRepository.count() == 0) {
            sleepLogRepository.save(new SleepLog(today, LocalTime.of(23, 15), LocalTime.of(7, 0), 465, 115, SleepQuality.EXCELLENT, 89));
        }

        if (dailyMetricRepository.count() == 0) {
            dailyMetricRepository.save(new DailyMetric(today, 8640, 10000, 550, 2200, 2500, 8.0));

            for (int i = 1; i <= 6; i++) {
                LocalDate past = today.minusDays(i);
                int steps = 7500 + (i * 380) % 3200;
                dailyMetricRepository.save(new DailyMetric(past, steps, 10000, 500, 2200, 2500, 8.0));
                hydrationLogRepository.save(new HydrationLog(past, 2100 + (i * 90) % 600, LocalTime.of(12, 0)));
                activityRepository.save(new Activity(past, "Daily Workout", ActivityType.GYM, 40, 320 + (i * 25), "MODERATE", LocalTime.of(17, 30)));
                sleepLogRepository.save(new SleepLog(past, LocalTime.of(23, 30), LocalTime.of(7, 0), 450 + (i * 10) % 40, 95 + (i * 5), SleepQuality.GOOD, 82 + (i % 8)));
            }
        }
    }
}
