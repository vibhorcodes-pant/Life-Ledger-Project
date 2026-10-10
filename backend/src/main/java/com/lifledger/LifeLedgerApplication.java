package com.lifledger;

import com.lifledger.controller.WellnessEntryController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Entry point for Life Ledger Spring Boot Backend.
 * Enables Asynchronous processing for multithreaded background analytics.
 */
@SpringBootApplication
@EnableAsync
public class LifeLedgerApplication {

    private static final Logger logger = LoggerFactory.getLogger(LifeLedgerApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(LifeLedgerApplication.class, args);
        logger.info("==================================================================");
        logger.info("  🌟 Life Ledger Backend is running at http://localhost:8080    ");
        logger.info("  Swagger / OpenAPI: http://localhost:8080/api/health            ");
        logger.info("  H2 Database Console: http://localhost:8080/h2-console          ");
        logger.info("==================================================================");
    }

    /**
     * Automatically populates initial demo entries on startup.
     */
    @Bean
    public CommandLineRunner initDatabase(WellnessEntryController controller) {
        return args -> {
            logger.info("Auto-initializing demo wellness dataset...");
            controller.seedDemoData();
            logger.info("Demo dataset ready.");
        };
    }
}
