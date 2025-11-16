package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.task_manager.backend.dto.UserResponseDto;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.Priority;
import org.task_manager.backend.model.TaskStatus;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalTasks() {
        return taskRepository.count();
    }

    public Map<String, Long> getTaskStatusCounts() {
        Map<String, Long> statusCounts = new HashMap<>();

        try {
            List<Task> allTasks = taskRepository.findAll();
            statusCounts.put("PENDING", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.PENDING).count());
            statusCounts.put("IN_PROGRESS", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count());
            statusCounts.put("COMPLETED", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.COMPLETED).count());
        } catch (Exception e) {
            statusCounts.put("PENDING", 0L);
            statusCounts.put("IN_PROGRESS", 0L);
            statusCounts.put("COMPLETED", 0L);
        }

        return statusCounts;
    }

    public Map<String, Long> getTaskPriorityCounts() {
        Map<String, Long> priorityCounts = new HashMap<>();

        try {
            List<Task> allTasks = taskRepository.findAll();
            priorityCounts.put("HIGH", allTasks.stream().filter(t -> t.getPriority() == Priority.HIGH).count());
            priorityCounts.put("MEDIUM", allTasks.stream().filter(t -> t.getPriority() == Priority.MEDIUM).count());
            priorityCounts.put("LOW", allTasks.stream().filter(t -> t.getPriority() == Priority.LOW).count());
        } catch (Exception e) {
            priorityCounts.put("HIGH", 0L);
            priorityCounts.put("MEDIUM", 0L);
            priorityCounts.put("LOW", 0L);
        }

        return priorityCounts;
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().getName(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", getTotalUsers());
        stats.put("totalTasks", getTotalTasks());
        stats.put("taskStatusCounts", getTaskStatusCounts());
        stats.put("taskPriorityCounts", getTaskPriorityCounts());
        return stats;
    }
}