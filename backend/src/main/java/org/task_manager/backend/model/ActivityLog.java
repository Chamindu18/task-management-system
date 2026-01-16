package org.task_manager.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false)
    private String action; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW, DOWNLOAD
    
    @Column(nullable = false)
    private String entityType; // TASK, USER, REPORT, SETTINGS, ADMIN
    
    private Long entityId;
    
    @Column(length = 500)
    private String entityName;
    
    @Column(length = 1000)
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String details; // JSON string of additional details
    
    @Column(length = 50)
    private String ipAddress;
    
    @Column(length = 500)
    private String userAgent;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private String status; // SUCCESS, FAILURE
    
    @Column(length = 500)
    private String errorMessage;
    
    // Constructors
    public ActivityLog(User user, String action, String entityType) {
        this.user = user;
        this.action = action;
        this.entityType = entityType;
        this.timestamp = LocalDateTime.now();
        this.status = "SUCCESS";
    }
    
    public ActivityLog(User user, String action, String entityType, String description) {
        this(user, action, entityType);
        this.description = description;
    }
    
    public ActivityLog(User user, String action, String entityType, Long entityId, String entityName) {
        this(user, action, entityType);
        this.entityId = entityId;
        this.entityName = entityName;
    }
    
    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (status == null) {
            status = "SUCCESS";
        }
    }
}
