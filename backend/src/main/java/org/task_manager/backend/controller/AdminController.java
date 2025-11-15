package org.task_manager.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.service.impl.AdminService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", adminService.getDashboardStats());
        response.put("message", "Admin dashboard statistics retrieved successfully");
        return response;
    }

    @GetMapping("/users")
    public Map<String, Object> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", adminService.getAllUsers());
        response.put("message", "All users retrieved successfully");
        return response;
    }

    @GetMapping("/tasks")
    public Map<String, Object> getAllTasks() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", adminService.getAllTasks());
        response.put("message", "All tasks retrieved successfully");
        return response;
    }

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Admin access is working correctly");
        response.put("role", "ADMIN");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}