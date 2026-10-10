package com.lifledger.exception;

/**
 * Thrown when low-level JDBC or JPA database operations encounter an error.
 * Encapsulates SQLExceptions to protect service boundaries.
 */
public class DatabaseOperationException extends RuntimeException {

    public DatabaseOperationException(String message, Throwable cause) {
        super(message, cause);
    }

    public DatabaseOperationException(String message) {
        super(message);
    }
}
