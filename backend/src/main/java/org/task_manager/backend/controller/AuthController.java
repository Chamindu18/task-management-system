package org.task_manager.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

            // Create a consistent success response
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("success", true);
            successResponse.put("message", response.getMessage());
            successResponse.put("data", response);

            return ResponseEntity.ok(successResponse);
        } catch (RuntimeException e) {
            // Create consistent error response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            errorResponse.put("error", e.getMessage()); // Keep both for compatibility

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponseDto response = authService.login(request);

            // Create a consistent success response
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("success", true);
            successResponse.put("message", response.getMessage());
            successResponse.put("data", response);

            return ResponseEntity.ok(successResponse);
        } catch (RuntimeException e) {
            // Create consistent error response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            errorResponse.put("error", e.getMessage()); // Keep both for compatibility

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            AuthResponseDto response = authService.getCurrentUserInfo();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsernameAvailability(@PathVariable String username) {
        boolean isAvailable = authService.isUsernameAvailable(username);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("available", isAvailable);
        response.put("message", isAvailable ? "Username available" : "Username already taken");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailAvailability(@PathVariable String email) {
        boolean isAvailable = authService.isEmailAvailable(email);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("available", isAvailable);
        response.put("message", isAvailable ? "Email available" : "Email already registered");
        return ResponseEntity.ok().body(response);
    }
}