package org.task_manager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDto {
    
    private Long id;
    private Long userId;
    private String username;
    
    private String action; // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
    private String entityType; // TASK, USER, REPORT
    private Long entityId;
    private String entityName;
    
    private String description;
    private String details; // JSON details of the action
    
    private String ipAddress;
    private String userAgent;
    
    private LocalDateTime timestamp;
    private String status; // SUCCESS, FAILURE
    private String errorMessage;
}
