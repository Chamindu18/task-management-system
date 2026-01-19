package org.task_manager.backend.exception;

/**
 * Exception thrown when a user is not found in the database
 */
public class UserNotFoundException extends RuntimeException {
    
    private Long userId;
    private String username;
    
    public UserNotFoundException(Long userId) {
        super("User with id " + userId + " not found");
        this.userId = userId;
    }
    
    public UserNotFoundException(String message) {
        super(message);
    }
    
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public UserNotFoundException(Long userId, String message) {
        super(message);
        this.userId = userId;
    }
    
    public static UserNotFoundException forId(Long userId) {
        return new UserNotFoundException(userId);
    }
    
    public static UserNotFoundException forUsername(String username) {
        return new UserNotFoundException("User with username '" + username + "' not found");
    }
    
    public static UserNotFoundException forEmail(String email) {
        return new UserNotFoundException("User with email '" + email + "' not found");
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public String getUsername() {
        return username;
    }
}
