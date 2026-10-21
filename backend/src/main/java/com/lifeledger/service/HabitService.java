package com.lifeledger.service;

import com.lifeledger.dto.HabitRequest;
import com.lifeledger.model.Habit;
import com.lifeledger.repository.HabitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class HabitService {

    private final HabitRepository habitRepository;

    public HabitService(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }

    public List<Habit> getAllHabits() {
        LocalDate today = LocalDate.now();
        List<Habit> habits = habitRepository.findAllByOrderByCategoryAscNameAsc();
        for (Habit habit : habits) {
            if (habit.getLastCompletedDate() == null || !habit.getLastCompletedDate().equals(today)) {
                if (Boolean.TRUE.equals(habit.getCompletedToday())) {
                    habit.setCompletedToday(false);
                    habitRepository.save(habit);
                }
            }
        }
        return habits;
    }

    @Transactional
    public Habit createHabit(HabitRequest request) {
        Habit habit = new Habit(
                request.getName(),
                request.getCategory() != null ? request.getCategory() : "GENERAL",
                request.getTargetDaysPerWeek() != null ? request.getTargetDaysPerWeek() : 7,
                0,
                false,
                null,
                request.getIcon() != null ? request.getIcon() : "star"
        );
        return habitRepository.save(habit);
    }

    @Transactional
    public Habit toggleHabit(Long id) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found with id: " + id));

        LocalDate today = LocalDate.now();
        boolean currentlyCompleted = Boolean.TRUE.equals(habit.getCompletedToday()) && today.equals(habit.getLastCompletedDate());

        if (currentlyCompleted) {
            habit.setCompletedToday(false);
            habit.setCurrentStreak(Math.max(0, habit.getCurrentStreak() - 1));
            habit.setLastCompletedDate(today.minusDays(1));
        } else {
            habit.setCompletedToday(true);
            int newStreak = (habit.getLastCompletedDate() != null && habit.getLastCompletedDate().equals(today.minusDays(1)))
                    ? habit.getCurrentStreak() + 1
                    : 1;
            habit.setCurrentStreak(newStreak);
            habit.setLastCompletedDate(today);
        }

        return habitRepository.save(habit);
    }

    @Transactional
    public void deleteHabit(Long id) {
        habitRepository.deleteById(id);
    }
}
