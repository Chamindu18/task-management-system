package org.task_manager.backend.exception;

/**
 * Exception thrown when attempting to create a user with duplicate username or email
 */
public class UserAlreadyExistsException extends RuntimeException {
    
    private String username;
    private String email;
    private String field;
    
    public UserAlreadyExistsException(String message) {
        super(message);
    }
    
    public UserAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public UserAlreadyExistsException(String field, String value) {
        super("User with " + field + " '" + value + "' already exists");
        this.field = field;
        if (field.equalsIgnoreCase("username")) {
            this.username = value;
        } else if (field.equalsIgnoreCase("email")) {
            this.email = value;
        }
    }
    
    public static UserAlreadyExistsException usernameExists(String username) {
        return new UserAlreadyExistsException("username", username);
    }
    
    public static UserAlreadyExistsException emailExists(String email) {
        return new UserAlreadyExistsException("email", email);
    }
    
    public static UserAlreadyExistsException forField(String field, String value) {
        return new UserAlreadyExistsException(field, value);
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getField() {
        return field;
    }
}
