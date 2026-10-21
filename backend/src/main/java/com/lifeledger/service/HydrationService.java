package com.lifeledger.service;

import com.lifeledger.model.HydrationLog;
import com.lifeledger.repository.HydrationLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class HydrationService {

    private final HydrationLogRepository hydrationLogRepository;

    public HydrationService(HydrationLogRepository hydrationLogRepository) {
        this.hydrationLogRepository = hydrationLogRepository;
    }

    public List<HydrationLog> getLogsForDate(LocalDate date) {
        return hydrationLogRepository.findByDateOrderByLoggedAtAsc(date);
    }

    public int getTotalIntakeForDate(LocalDate date) {
        return hydrationLogRepository.findByDateOrderByLoggedAtAsc(date)
                .stream()
                .mapToInt(HydrationLog::getAmountMl)
                .sum();
    }

    @Transactional
    public HydrationLog addLog(int amountMl) {
        HydrationLog log = new HydrationLog(LocalDate.now(), amountMl, LocalTime.now());
        return hydrationLogRepository.save(log);
    }
}
