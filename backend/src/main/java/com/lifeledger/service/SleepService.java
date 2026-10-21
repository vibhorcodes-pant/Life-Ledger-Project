package com.lifeledger.service;

import com.lifeledger.dto.SleepRequest;
import com.lifeledger.model.SleepLog;
import com.lifeledger.model.SleepQuality;
import com.lifeledger.repository.SleepLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class SleepService {

    private final SleepLogRepository sleepLogRepository;

    public SleepService(SleepLogRepository sleepLogRepository) {
        this.sleepLogRepository = sleepLogRepository;
    }

    public Optional<SleepLog> getSleepForDate(LocalDate date) {
        return sleepLogRepository.findByDate(date);
    }

    @Transactional
    public SleepLog recordSleep(SleepRequest request) {
        LocalDate today = LocalDate.now();
        SleepLog sleepLog = sleepLogRepository.findByDate(today).orElse(new SleepLog());
        sleepLog.setDate(today);
        if (request.getBedTime() != null) {
            sleepLog.setBedTime(LocalTime.parse(request.getBedTime()));
        }
        if (request.getWakeTime() != null) {
            sleepLog.setWakeTime(LocalTime.parse(request.getWakeTime()));
        }
        sleepLog.setDurationMinutes(request.getDurationMinutes());
        sleepLog.setDeepSleepMinutes(request.getDeepSleepMinutes() != null ? request.getDeepSleepMinutes() : (int)(request.getDurationMinutes() * 0.22));
        sleepLog.setQuality(request.getQuality() != null ? request.getQuality() : calculateQuality(request.getDurationMinutes()));
        sleepLog.setScore(request.getScore() != null ? request.getScore() : calculateSleepScore(request.getDurationMinutes()));

        return sleepLogRepository.save(sleepLog);
    }

    private SleepQuality calculateQuality(int minutes) {
        if (minutes >= 420) return SleepQuality.EXCELLENT;
        if (minutes >= 360) return SleepQuality.GOOD;
        if (minutes >= 300) return SleepQuality.FAIR;
        return SleepQuality.POOR;
    }

    private int calculateSleepScore(int minutes) {
        double ratio = Math.min(1.0, (double) minutes / 480.0);
        return (int) Math.round(ratio * 100);
    }
}
