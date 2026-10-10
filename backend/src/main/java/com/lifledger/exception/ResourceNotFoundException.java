package com.lifledger.exception;

/**
 * Custom runtime exception thrown when an entry or resource cannot be found.
 * Demonstrates Java Exception Handling & Custom Exceptions.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(String.format("%s not found with identifier: %s", resourceName, identifier));
    }
}
