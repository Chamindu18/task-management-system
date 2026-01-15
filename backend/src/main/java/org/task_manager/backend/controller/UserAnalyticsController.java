package org.task_manager.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.service.UserAnalyticsService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserAnalyticsController {

    private final UserAnalyticsService userAnalyticsService;

    @GetMapping("/{userId}/analytics")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#userId)")
    public ResponseEntity<?> getUserAnalytics(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7days") String range) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("data", userAnalyticsService.getUserAnalytics(userId, range));
            response.put("message", "User analytics retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid request parameters");
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch user analytics");
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
