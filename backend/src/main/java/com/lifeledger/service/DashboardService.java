package com.lifeledger.service;

import com.lifeledger.dto.DashboardDTO;
import com.lifeledger.dto.DayTrendDTO;
import com.lifeledger.dto.MacroBreakdownDTO;
import com.lifeledger.model.*;
import com.lifeledger.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;

@Service
public class DashboardService {

    private final ActivityRepository activityRepository;
    private final MealRepository mealRepository;
    private final HydrationLogRepository hydrationLogRepository;
    private final HabitRepository habitRepository;
    private final SleepLogRepository sleepLogRepository;
    private final DailyMetricRepository dailyMetricRepository;

    public DashboardService(
            ActivityRepository activityRepository,
            MealRepository mealRepository,
            HydrationLogRepository hydrationLogRepository,
            HabitRepository habitRepository,
            SleepLogRepository sleepLogRepository,
            DailyMetricRepository dailyMetricRepository) {
        this.activityRepository = activityRepository;
        this.mealRepository = mealRepository;
        this.hydrationLogRepository = hydrationLogRepository;
        this.habitRepository = habitRepository;
        this.sleepLogRepository = sleepLogRepository;
        this.dailyMetricRepository = dailyMetricRepository;
    }

    public DashboardDTO getDashboardForDate(LocalDate date) {
        DailyMetric metric = dailyMetricRepository.findByDate(date)
                .orElseGet(() -> new DailyMetric(date, 7420, 10000, 500, 2200, 2500, 8.0));

        List<Activity> activities = activityRepository.findByDateOrderByTimeOfDayDesc(date);
        int caloriesBurned = activities.stream().mapToInt(Activity::getCaloriesBurned).sum();
        int activeMinutes = activities.stream().mapToInt(Activity::getDurationMinutes).sum();

        List<Meal> meals = mealRepository.findByDateOrderByRecordedAtAsc(date);
        int caloriesConsumed = meals.stream().mapToInt(Meal::getCalories).sum();
        double protein = meals.stream().mapToDouble(m -> m.getProteinGrams() != null ? m.getProteinGrams() : 0.0).sum();
        double carbs = meals.stream().mapToDouble(m -> m.getCarbsGrams() != null ? m.getCarbsGrams() : 0.0).sum();
        double fat = meals.stream().mapToDouble(m -> m.getFatGrams() != null ? m.getFatGrams() : 0.0).sum();

        List<HydrationLog> waterLogs = hydrationLogRepository.findByDateOrderByLoggedAtAsc(date);
        int waterConsumed = waterLogs.stream().mapToInt(HydrationLog::getAmountMl).sum();

        Optional<SleepLog> sleepOpt = sleepLogRepository.findByDate(date);
        double sleepHours = sleepOpt.map(s -> Math.round((s.getDurationMinutes() / 60.0) * 10.0) / 10.0).orElse(7.5);
        String sleepQuality = sleepOpt.map(s -> s.getQuality().name()).orElse("GOOD");
        int sleepScore = sleepOpt.map(SleepLog::getScore).orElse(82);

        List<Habit> habits = habitRepository.findAllByOrderByCategoryAscNameAsc();
        long completedHabitsCount = habits.stream().filter(h -> Boolean.TRUE.equals(h.getCompletedToday())).count();
        double habitRate = habits.isEmpty() ? 1.0 : (double) completedHabitsCount / habits.size();

        double stepProgress = Math.min(1.0, (double) metric.getSteps() / metric.getStepsTarget());
        double waterProgress = Math.min(1.0, (double) waterConsumed / metric.getWaterTargetMl());
        double activityProgress = Math.min(1.0, (double) caloriesBurned / metric.getCaloriesBurnedTarget());
        double sleepProgress = Math.min(1.0, sleepScore / 100.0);

        int compositeScore = (int) Math.round(
                (stepProgress * 25.0) +
                (waterProgress * 20.0) +
                (activityProgress * 20.0) +
                (sleepProgress * 20.0) +
                (habitRate * 15.0)
        );

        DashboardDTO dto = new DashboardDTO();
        dto.setDate(date);
        dto.setWellnessScore(Math.min(100, Math.max(10, compositeScore)));
        dto.setSteps(metric.getSteps());
        dto.setStepsTarget(metric.getStepsTarget());
        dto.setCaloriesBurned(caloriesBurned);
        dto.setCaloriesBurnedTarget(metric.getCaloriesBurnedTarget());
        dto.setCaloriesConsumed(caloriesConsumed);
        dto.setCaloriesConsumedTarget(metric.getCaloriesIntakeTarget());
        dto.setWaterConsumedMl(waterConsumed);
        dto.setWaterTargetMl(metric.getWaterTargetMl());
        dto.setSleepHours(sleepHours);
        dto.setSleepQuality(sleepQuality);
        dto.setSleepScore(sleepScore);
        dto.setActiveMinutes(activeMinutes);
        dto.setMacros(new MacroBreakdownDTO(
                Math.round(protein * 10.0) / 10.0,
                Math.round(carbs * 10.0) / 10.0,
                Math.round(fat * 10.0) / 10.0
        ));
        dto.setRecentActivities(activities);
        dto.setMeals(meals);
        dto.setHabits(habits);
        dto.setSleepLog(sleepOpt.orElse(null));
        dto.setWeeklyTrends(calculateWeeklyTrends(date));

        return dto;
    }

    @Transactional
    public void updateSteps(LocalDate date, int steps) {
        DailyMetric metric = dailyMetricRepository.findByDate(date)
                .orElseGet(() -> new DailyMetric(date, 0, 10000, 500, 2200, 2500, 8.0));
        metric.setSteps(steps);
        dailyMetricRepository.save(metric);
    }

    private List<DayTrendDTO> calculateWeeklyTrends(LocalDate targetDate) {
        List<DayTrendDTO> list = new ArrayList<>();
        LocalDate start = targetDate.minusDays(6);

        for (int i = 0; i < 7; i++) {
            LocalDate d = start.plusDays(i);
            String dayName = d.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            DailyMetric m = dailyMetricRepository.findByDate(d).orElse(null);
            int steps = m != null ? m.getSteps() : 6000 + (i * 450);

            List<HydrationLog> hl = hydrationLogRepository.findByDateOrderByLoggedAtAsc(d);
            int water = hl.stream().mapToInt(HydrationLog::getAmountMl).sum();
            if (water == 0 && !d.equals(targetDate)) {
                water = 2000 + ((i % 3) * 300);
            }

            List<Activity> acts = activityRepository.findByDateOrderByTimeOfDayDesc(d);
            int calBurn = acts.stream().mapToInt(Activity::getCaloriesBurned).sum();
            if (calBurn == 0 && !d.equals(targetDate)) {
                calBurn = 380 + (i * 30);
            }

            List<Meal> mls = mealRepository.findByDateOrderByRecordedAtAsc(d);
            int calConsumed = mls.stream().mapToInt(Meal::getCalories).sum();
            if (calConsumed == 0 && !d.equals(targetDate)) {
                calConsumed = 1950 + ((i % 4) * 80);
            }

            Optional<SleepLog> sl = sleepLogRepository.findByDate(d);
            double sleep = sl.map(s -> s.getDurationMinutes() / 60.0).orElse(7.0 + (i % 3) * 0.4);
            int score = (int) Math.min(100, 65 + (steps / 300) + (water / 150));

            list.add(new DayTrendDTO(d, dayName, steps, water, calBurn, calConsumed, Math.round(sleep * 10.0) / 10.0, score));
        }
        return list;
    }
}
