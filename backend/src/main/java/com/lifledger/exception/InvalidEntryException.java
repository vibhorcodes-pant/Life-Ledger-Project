package com.lifledger.exception;

/**
 * Thrown when user inputs fail business validation logic.
 * Demonstrates Java Exception Handling.
 */
public class InvalidEntryException extends RuntimeException {

    public InvalidEntryException(String message) {
        super(message);
    }
}
