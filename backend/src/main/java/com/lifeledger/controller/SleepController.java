package com.lifeledger.controller;

import com.lifeledger.dto.SleepRequest;
import com.lifeledger.model.SleepLog;
import com.lifeledger.service.SleepService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/sleep")
public class SleepController {

    private final SleepService sleepService;

    public SleepController(SleepService sleepService) {
        this.sleepService = sleepService;
    }

    @GetMapping
    public ResponseEntity<SleepLog> getSleep(
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        return ResponseEntity.of(sleepService.getSleepForDate(queryDate));
    }

    @PostMapping
    public ResponseEntity<SleepLog> recordSleep(@Valid @RequestBody SleepRequest request) {
        return ResponseEntity.ok(sleepService.recordSleep(request));
    }
}
