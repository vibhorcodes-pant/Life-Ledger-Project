package com.lifeledger.controller;

import com.lifeledger.dto.QuickHydrationRequest;
import com.lifeledger.model.HydrationLog;
import com.lifeledger.service.HydrationService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hydration")
public class HydrationController {

    private final HydrationService hydrationService;

    public HydrationController(HydrationService hydrationService) {
        this.hydrationService = hydrationService;
    }

    @GetMapping
    public ResponseEntity<List<HydrationLog>> getHydrationLogs(
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(hydrationService.getLogsForDate(queryDate));
    }

    @PostMapping("/quick-add")
    public ResponseEntity<HydrationLog> quickAdd(@Valid @RequestBody QuickHydrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hydrationService.addLog(request.getAmountMl()));
    }
}
