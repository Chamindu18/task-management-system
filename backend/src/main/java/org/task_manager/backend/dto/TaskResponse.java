package org.task_manager.backend.dto;

import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private String status;
    private String priority;
    private LocalDateTime creationDate;

    private Long assignedToId;
    private String assignedToUsername;
}
