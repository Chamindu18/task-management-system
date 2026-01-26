package org.task_manager.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.model.UserSettings;
import org.task_manager.backend.security.CustomUserDetails;
import org.task_manager.backend.service.UserSettingsService;

@RestController
@RequestMapping("/api/user/settings")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    @GetMapping
    public ResponseEntity<UserSettings> getSettings(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userSettingsService.getSettings(userDetails.getUser()));
    }

    @PatchMapping("/email-notifications")
    public ResponseEntity<UserSettings> updateEmailNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam boolean enabled) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserSettings updated = userSettingsService.updateEmailNotifications(userDetails.getUser(), enabled);
        return ResponseEntity.ok(updated);
    }
}