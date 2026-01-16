package org.task_manager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.task_manager.backend.model.User;
import org.task_manager.backend.model.UserSettings;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    
    /**
     * Find user settings by associated user
     */
    Optional<UserSettings> findByUser(User user);
    
    /**
     * Find user settings by user ID
     */
    @Query("SELECT us FROM UserSettings us WHERE us.user.id = :userId")
    Optional<UserSettings> findByUserId(@Param("userId") Long userId);
    
    /**
     * Check if user has settings configured
     */
    boolean existsByUser(User user);
    
    /**
     * Find users with email notifications enabled
     */
    @Query("SELECT us FROM UserSettings us WHERE us.emailNotifications = true")
    java.util.List<UserSettings> findUsersWithEmailNotificationsEnabled();
    
    /**
     * Find users with two-factor authentication enabled
     */
    @Query("SELECT us FROM UserSettings us WHERE us.twoFactorEnabled = true")
    java.util.List<UserSettings> findUsersWithTwoFactorEnabled();
    
    /**
     * Find users with specific theme preference
     */
    @Query("SELECT us FROM UserSettings us WHERE us.theme = :theme")
    java.util.List<UserSettings> findByTheme(@Param("theme") String theme);
    
    /**
     * Find users with specific language preference
     */
    @Query("SELECT us FROM UserSettings us WHERE us.language = :language")
    java.util.List<UserSettings> findByLanguage(@Param("language") String language);
    
    /**
     * Find users with specific timezone
     */
    @Query("SELECT us FROM UserSettings us WHERE us.timeZone = :timeZone")
    java.util.List<UserSettings> findByTimeZone(@Param("timeZone") String timeZone);
    
    /**
     * Find users with dark theme enabled
     */
    @Query("SELECT us FROM UserSettings us WHERE us.theme = 'dark'")
    java.util.List<UserSettings> findUsersWithDarkTheme();
    
    /**
     * Find users with profile visibility set to public
     */
    @Query("SELECT us FROM UserSettings us WHERE us.profilePublic = true")
    java.util.List<UserSettings> findUsersWithPublicProfile();
    
    /**
     * Count users with email notifications enabled
     */
    long countByEmailNotificationsTrue();
    
    /**
     * Count users with two-factor authentication enabled
     */
    long countByTwoFactorEnabledTrue();
}
