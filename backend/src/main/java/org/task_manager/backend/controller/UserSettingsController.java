package org.task_manager.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.model.User;
import org.task_manager.backend.model.UserSettings;
import org.task_manager.backend.service.UserSettingsService;

@RestController
@RequestMapping("/api/user/settings")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    @GetMapping
    public ResponseEntity<UserSettings> getSettings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userSettingsService.getSettings(user));
    }

    @PatchMapping("/email-notifications")
    public ResponseEntity<UserSettings> updateEmailNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam boolean enabled) {
        UserSettings updated = userSettingsService.updateEmailNotifications(user, enabled);
        return ResponseEntity.ok(updated);
    }
}