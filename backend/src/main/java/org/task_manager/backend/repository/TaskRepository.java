package org.task_manager.backend.repository;

import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Custom query methods
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);
    List<Task> findByUserIdOrderByDueDateAsc(Long userId);
    List<Task> findByPriorityOrderByDueDateAsc(String priority);
    long countByUserIdAndStatus(Long userId, TaskStatus status);
}