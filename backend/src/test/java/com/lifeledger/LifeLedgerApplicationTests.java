package com.lifeledger;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class LifeLedgerApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @Test
    void testDashboardTodayEndpoint() throws Exception {
        mockMvc.perform(get("/api/dashboard/today"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wellnessScore").isNumber())
                .andExpect(jsonPath("$.steps").isNumber())
                .andExpect(jsonPath("$.waterConsumedMl").isNumber())
                .andExpect(jsonPath("$.habits").isArray())
                .andExpect(jsonPath("$.weeklyTrends").isArray());
    }

    @Test
    void testHydrationQuickAdd() throws Exception {
        mockMvc.perform(post("/api/hydration/quick-add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amountMl\": 250}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.amountMl").value(250));
    }

    @Test
    void testHabitsListAndToggle() throws Exception {
        mockMvc.perform(get("/api/habits"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists());

        mockMvc.perform(post("/api/habits/1/toggle"))
                .andExpect(status().isOk());
    }
}
