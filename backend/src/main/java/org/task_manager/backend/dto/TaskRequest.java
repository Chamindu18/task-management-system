package org.task_manager.backend.dto;

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
    private LocalDateTime dueDate;

    @NotBlank(message ="priority is required")
    @Pattern(regexp = "HIGH|MEDIUM|LOW",message ="priority must be HIGH,MEDIUM, or LOW")
    private String priority;

    @NotBlank(message ="Status is required")
    @Pattern(regexp ="TODO|IN_PROGRESS|DONE",message = "Status must be TODO, IN_PROGRESS, or DONE")
    private String status;

    @NotNull(message = "Assigned user ID is required")
    private Long assignedToId;

}
