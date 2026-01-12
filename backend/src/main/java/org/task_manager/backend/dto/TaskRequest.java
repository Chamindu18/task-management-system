package org.task_manager.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class TaskRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 5, max =100,message ="Title must be between 5 and 100 characters")
    private String title;

    @Size(max =500,message="Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date must be in the present or future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;

    @NotBlank(message ="priority is required")
    @Pattern(regexp = "HIGH|MEDIUM|LOW",message ="priority must be HIGH,MEDIUM, or LOW")
    private String priority;

    @NotBlank(message ="Status is required")
    @Pattern(regexp ="TODO|IN_PROGRESS|DONE",message = "Status must be TODO, IN_PROGRESS, or DONE")
    private String status;

    @NotNull(message = "Assigned user ID is required")
    private Long assignedToId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }
}
