package com.lifeledger.service;

import com.lifeledger.dto.ActivityRequest;
import com.lifeledger.model.Activity;
import com.lifeledger.repository.ActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> getActivitiesForDate(LocalDate date) {
        return activityRepository.findByDateOrderByTimeOfDayDesc(date);
    }

    @Transactional
    public Activity createActivity(ActivityRequest request) {
        int calories = request.getCaloriesBurned() != null ? request.getCaloriesBurned() : calculateEstimatedCalories(request.getType(), request.getDurationMinutes(), request.getIntensity());
        Activity activity = new Activity(
                LocalDate.now(),
                request.getTitle(),
                request.getType(),
                request.getDurationMinutes(),
                calories,
                request.getIntensity() != null ? request.getIntensity() : "MODERATE",
                LocalTime.now()
        );
        return activityRepository.save(activity);
    }

    @Transactional
    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }

    private int calculateEstimatedCalories(com.lifeledger.model.ActivityType type, int duration, String intensity) {
        double multiplier = switch (intensity != null ? intensity.toUpperCase() : "MODERATE") {
            case "HIGH" -> 1.3;
            case "LOW" -> 0.7;
            default -> 1.0;
        };
        int burnRatePerMin = switch (type) {
            case RUNNING -> 11;
            case SWIMMING -> 10;
            case CYCLING -> 8;
            case GYM -> 7;
            case WALKING -> 4;
            case YOGA -> 3;
            case MEDITATION -> 1;
            case OTHER -> 6;
        };
        return (int) Math.round(burnRatePerMin * duration * multiplier);
    }
}
