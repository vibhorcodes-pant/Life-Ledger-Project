package com.lifeledger.controller;

import com.lifeledger.dto.DashboardDTO;
import com.lifeledger.dto.StepsUpdateRequest;
import com.lifeledger.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/today")
    public ResponseEntity<DashboardDTO> getTodayDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardForDate(LocalDate.now()));
    }

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboardForDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(dashboardService.getDashboardForDate(date));
    }

    @PostMapping("/steps")
    public ResponseEntity<Void> updateSteps(@Valid @RequestBody StepsUpdateRequest request) {
        dashboardService.updateSteps(LocalDate.now(), request.getSteps());
        return ResponseEntity.ok().build();
    }
}
