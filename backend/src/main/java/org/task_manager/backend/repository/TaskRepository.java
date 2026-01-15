package org.task_manager.backend.repository;

import org.task_manager.backend.model.Priority;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Custom query methods
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByAssignedToIdAndStatus(Long userId, TaskStatus status);
    List<Task> findByAssignedToIdOrderByDueDateAsc(Long userId);
    List<Task> findByPriorityOrderByDueDateAsc(Priority priority);
    long countByAssignedToIdAndStatus(Long userId, TaskStatus status);
}