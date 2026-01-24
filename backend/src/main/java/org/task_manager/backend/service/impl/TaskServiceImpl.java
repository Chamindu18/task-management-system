package org.task_manager.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import org_task_manager.backend.service.TaskService;
import org_task_manager.backend.model.Task;
import org_task_manager.backend.dto.TaskResponse;
import org_task_manager.backend.repository.TaskRepository;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    private Specification<Task> buildFilterSpec(String search, String status, String priority) {
        Specification<Task> spec = Specification.where(null);

        if (search != null && !search.trim().isEmpty()) {
            String keyword = search.trim().toLowerCase();
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), "%" + keyword + "%"),
                cb.like(cb.lower(root.get("description")), "%" + keyword + "%")
            ));
        }

        if (status != null && !status.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (priority != null && !priority.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("priority"), priority));
        }

        return spec;
    }

    @Override
    public Page<TaskResponse> getAllTasks(String search,
                                          String status,
                                          String priority,
                                          int page,
                                          int size,
                                          String sortBy,
                                          String sortDir) {
        Sort sort = Sort.by("desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Task> spec = buildFilterSpec(search, status, priority);
        Page<Task> tasks = taskRepository.findAll(spec, pageable);

        return tasks.map(this::toTaskResponse);
    }

    private TaskResponse toTaskResponse(Task task) {
        TaskResponse dto = new TaskResponse();
        // dto.setId(task.getId());
        // dto.setTitle(task.getTitle());
        // dto.setDescription(task.getDescription());
        // dto.setStatus(task.getStatus());
        // dto.setPriority(task.getPriority());
        // dto.setDueDate(task.getDueDate());
        return dto;
    }
}