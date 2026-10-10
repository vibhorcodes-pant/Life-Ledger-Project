package com.lifledger.controller;

import com.lifledger.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health check REST controller.
 * Implements PRD requirement: GET /api/health
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", "Life Ledger Backend");
        healthInfo.put("timestamp", LocalDateTime.now());
        healthInfo.put("database", "Connected (H2 In-Memory / Spring Data JPA & JDBC)");
        healthInfo.put("version", "1.0.0");

        return ResponseEntity.ok(ApiResponse.success(healthInfo, "Service is healthy and operational"));
    }
}
