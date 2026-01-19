package org.task_manager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchResultDto {
    
    private Long id;
    private String username;
    private String email;
    private String role;
    private Long tasksCompleted;
    private Long totalTasks;
    private LocalDateTime createdAt;
    private String status; // ACTIVE, INACTIVE
    
    // Relevance score for search ranking
    private Double relevanceScore;
    
    public UserSearchResultDto(Long id, String username, String email, String role, 
                              Long tasksCompleted, Long totalTasks, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.tasksCompleted = tasksCompleted;
        this.totalTasks = totalTasks;
        this.createdAt = createdAt;
        this.status = "ACTIVE";
        this.relevanceScore = 1.0;
    }
}
