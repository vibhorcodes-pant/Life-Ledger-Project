package com.lifledger.servlet;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class registering the custom Servlet Filter into the servlet container lifecycle.
 * Demonstrates Servlet Integration with Spring Boot.
 */
@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<CustomLoggingFilter> loggingFilterRegistration() {
        FilterRegistrationBean<CustomLoggingFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new CustomLoggingFilter());
        registration.addUrlPatterns("/api/*");
        registration.setName("CustomLoggingFilter");
        registration.setOrder(1);
        return registration;
    }
}
