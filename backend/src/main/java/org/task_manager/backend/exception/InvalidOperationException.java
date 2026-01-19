package org.task_manager.backend.exception;

/**
 * Exception thrown when an invalid operation is attempted
 */
public class InvalidOperationException extends RuntimeException {
    
    private String operation;
    private String reason;
    
    public InvalidOperationException(String message) {
        super(message);
    }
    
    public InvalidOperationException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public InvalidOperationException(String operation, String reason) {
        super("Invalid operation: " + operation + " - " + reason);
        this.operation = operation;
        this.reason = reason;
    }
    
    public static InvalidOperationException cannotDelete(String entity, String reason) {
        return new InvalidOperationException("Cannot delete " + entity, reason);
    }
    
    public static InvalidOperationException cannotUpdate(String entity, String reason) {
        return new InvalidOperationException("Cannot update " + entity, reason);
    }
    
    public static InvalidOperationException cannotCreate(String entity, String reason) {
        return new InvalidOperationException("Cannot create " + entity, reason);
    }
    
    public static InvalidOperationException invalidState(String entity, String currentState) {
        return new InvalidOperationException("Invalid state for " + entity, "Current state: " + currentState);
    }
    
    public static InvalidOperationException ofOperationAndReason(String operation, String reason) {
        return new InvalidOperationException(operation, reason);
    }
    
    public String getOperation() {
        return operation;
    }
    
    public String getReason() {
        return reason;
    }
}
