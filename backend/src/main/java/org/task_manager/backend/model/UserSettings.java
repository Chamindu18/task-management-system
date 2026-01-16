package org.task_manager.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;
    
    // Notification Settings
    @Column(nullable = false)
    private Boolean emailNotifications = true;
    
    @Column(nullable = false)
    private Boolean taskReminders = true;
    
    @Column(nullable = false)
    private Boolean weeklyReports = false;
    
    @Column(nullable = false)
    private Boolean systemAlerts = true;
    
    @Column(nullable = false)
    private Boolean taskComments = true;
    
    // Display Settings
    @Column(length = 50)
    private String theme = "light"; // light, dark
    
    @Column(length = 10)
    private String language = "en"; // en, es, fr, de, etc.
    
    @Column(length = 50)
    private String timeZone = "UTC";
    
    @Column(nullable = false)
    private Boolean showCompletedTasks = true;
    
    @Column(nullable = false)
    private Integer itemsPerPage = 10;
    
    // Profile Settings
    @Column(length = 500)
    private String bio;
    
    @Column(length = 500)
    private String profilePictureUrl;
    
    @Column(length = 100)
    private String phoneNumber;
    
    // Privacy Settings
    @Column(nullable = false)
    private Boolean profilePublic = false;
    
    @Column(nullable = false)
    private Boolean showActivityStatus = true;
    
    // Two Factor Authentication
    @Column(nullable = false)
    private Boolean twoFactorEnabled = false;
    
    @Column(length = 100)
    private String twoFactorMethod; // SMS, EMAIL, AUTHENTICATOR_APP
    
    // Timestamps
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Constructor
    public UserSettings(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
