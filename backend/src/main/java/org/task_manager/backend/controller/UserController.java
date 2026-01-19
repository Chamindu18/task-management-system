package org.task_manager.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("data", userService.getAllUsersForAdmin());
            response.put("message", "All users retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch users");
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
