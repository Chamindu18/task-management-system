package org.task_manager.backend.exception;

/**
 * Exception thrown when authentication credentials are invalid
 */
public class InvalidCredentialsException extends RuntimeException {
    
    private String username;
    private String reason;
    
    public InvalidCredentialsException(String message) {
        super(message);
    }
    
    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public InvalidCredentialsException(String username, String reason) {
        super("Invalid credentials for user '" + username + "': " + reason);
        this.username = username;
        this.reason = reason;
    }
    
    public static InvalidCredentialsException invalidUsername() {
        return new InvalidCredentialsException("Invalid username or password");
    }
    
    public static InvalidCredentialsException invalidPassword() {
        return new InvalidCredentialsException("Invalid password");
    }
    
    public static InvalidCredentialsException passwordMismatch() {
        return new InvalidCredentialsException("Passwords do not match");
    }
    
    public static InvalidCredentialsException ofUsernameAndReason(String username, String reason) {
        return new InvalidCredentialsException(username, reason);
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getReason() {
        return reason;
    }
}
