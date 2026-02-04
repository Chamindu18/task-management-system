package org.task_manager.backend.service;

import org.springframework.data.domain.Page;
import org.task_manager.backend.dto.TaskRequest;
import org.task_manager.backend.dto.TaskResponse;

public interface TaskService {
    // core CRUD
    TaskResponse createTask(TaskRequest request);
    TaskResponse getTaskById(Long id);
    TaskResponse updateTask(Long id, TaskRequest request);
    void deleteTask(Long id);

    // Retrieval with pagination, sorting, and filtering
    Page<TaskResponse> getAllTasks(
            Long userId,
            String search,
            String status,
            String priority,
            int page,
            int size,
            String sortBy,
            String sortDir
    );
}