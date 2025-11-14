package org.task_manager.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.dto.AuthResponseDto;
import org.task_manager.backend.dto.LoginRequest;
import org.task_manager.backend.dto.RegisterRequest;
import org.task_manager.backend.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponseDto response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new AuthResponseDto(null, null, null, null, e.getMessage(), null)
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        try {
            AuthResponseDto response = authService.login(request, httpRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new AuthResponseDto(null, null, null, null, e.getMessage(), null)
            );
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            AuthResponseDto response = authService.getCurrentUserInfo();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new AuthResponseDto(null, null, null, null, e.getMessage(), null)
            );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            return ResponseEntity.ok().body(
                    Map.of("message", "Logout successful")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Logout failed: " + e.getMessage())
            );
        }
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsernameAvailability(@PathVariable String username) {
        boolean isAvailable = authService.isUsernameAvailable(username);
        return ResponseEntity.ok().body(
                new SimpleResponse(isAvailable ? "Username available" : "Username already taken", isAvailable)
        );
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailAvailability(@PathVariable String email) {
        boolean isAvailable = authService.isEmailAvailable(email);
        return ResponseEntity.ok().body(
                new SimpleResponse(isAvailable ? "Email available" : "Email already registered", isAvailable)
        );
    }

    // Exception handlers
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    // Simple inner class for availability responses
    private static class SimpleResponse {
        private String message;
        private boolean available;

        public SimpleResponse(String message, boolean available) {
            this.message = message;
            this.available = available;
        }

        public String getMessage() { return message; }
        public boolean isAvailable() { return available; }
    }
}