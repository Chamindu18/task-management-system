package org.task_manager.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.task_manager.backend.model.RoleName;
import java.time.LocalDateTime;

@Data
public class UserResponseDto {
    private Long id;
    private String username;
    
    @JsonProperty("name")
    public String getName() {
        return username;
    }
    
    private String email;
    private RoleName role;
    private LocalDateTime createdAt;

    public UserResponseDto(Long id, String username, String email, RoleName role, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    public UserResponseDto(Long id, String username, String email, String role, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = RoleName.valueOf(role);
        this.createdAt = createdAt;
    }
}