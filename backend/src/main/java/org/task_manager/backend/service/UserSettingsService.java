package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.task_manager.backend.model.User;
import org.task_manager.backend.model.UserSettings;
import org.task_manager.backend.repository.UserSettingsRepository;

@Service
@RequiredArgsConstructor
public class UserSettingsService {
    
    private final UserSettingsRepository userSettingsRepository;

    @Transactional
    public UserSettings updateEmailNotifications(User user, boolean enabled) {
        UserSettings settings = userSettingsRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                UserSettings newSettings = new UserSettings();
                newSettings.setUser(user);
                newSettings.setEmailNotifications(true);
                return newSettings;
            });
        
        settings.setEmailNotifications(enabled);
        return userSettingsRepository.save(settings);
    }

    public UserSettings getSettings(User user) {
        return userSettingsRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                UserSettings newSettings = new UserSettings();
                newSettings.setUser(user);
                newSettings.setEmailNotifications(true);
                return userSettingsRepository.save(newSettings);
            });
    }
}