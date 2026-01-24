package org.task_manager.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.dto.UserAnalyticsDetailDto;
import org.task_manager.backend.service.UserAnalyticsService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserAnalyticsController {

    private final UserAnalyticsService userAnalyticsService;

    @GetMapping("/{userId}/analytics")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#userId)")
    public ResponseEntity<UserAnalyticsDetailDto> getUserAnalytics(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7days") String range) {
        
        try {
            UserAnalyticsDetailDto analyticsData = userAnalyticsService.getUserAnalytics(userId);
            return ResponseEntity.ok(analyticsData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
