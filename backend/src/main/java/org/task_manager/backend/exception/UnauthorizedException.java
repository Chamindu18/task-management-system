package org.task_manager.backend.exception;

/**
 * Exception thrown when a user attempts an unauthorized operation
 */
public class UnauthorizedException extends RuntimeException {
    
    private Long userId;
    private String action;
    
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public UnauthorizedException(String message, Long userId) {
        super(message);
        this.userId = userId;
    }
    
    public UnauthorizedException(String message, Long userId, String action) {
        super(message);
        this.userId = userId;
        this.action = action;
    }
    
    public static UnauthorizedException forUser(Long userId) {
        return new UnauthorizedException("User " + userId + " is not authorized for this operation", userId);
    }
    
    public static UnauthorizedException forAction(String action) {
        return new UnauthorizedException("You are not authorized to " + action);
    }
    
    public static UnauthorizedException forRole(String role) {
        return new UnauthorizedException("Your role '" + role + "' does not have permission for this operation");
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public String getAction() {
        return action;
    }
}
