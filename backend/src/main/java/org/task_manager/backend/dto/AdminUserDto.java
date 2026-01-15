package org.task_manager.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminUserDto {
    private Long id;
    private String username;
    
    @JsonProperty("name")
    public String getName() {
        return username;
    }
    
    private String email;
    private String role;
    private Long tasksCompleted;
    private LocalDateTime createdAt;

    public AdminUserDto(Long id, String username, String email, String role, Long tasksCompleted, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.tasksCompleted = tasksCompleted;
        this.createdAt = createdAt;
    }
}
