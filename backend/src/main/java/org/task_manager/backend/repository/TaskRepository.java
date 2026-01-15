package org.task_manager.backend.repository;

import org.task_manager.backend.model.Priority;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Custom query methods
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByAssignedToIdAndStatus(Long userId, TaskStatus status);
    List<Task> findByAssignedToIdOrderByDueDateAsc(Long userId);
    List<Task> findByPriorityOrderByDueDateAsc(Priority priority);
    long countByAssignedToIdAndStatus(Long userId, TaskStatus status);
    
    // Analytics query methods
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId AND t.creationDate BETWEEN :fromDate AND :toDate")
    List<Task> findByAssignedToIdAndCreationDateBetween(
            @Param("userId") Long userId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId AND t.status = :status AND t.creationDate BETWEEN :fromDate AND :toDate")
    List<Task> findByAssignedToIdAndStatusAndCreationDateBetween(
            @Param("userId") Long userId,
            @Param("status") TaskStatus status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId AND t.priority = :priority AND t.creationDate BETWEEN :fromDate AND :toDate")
    List<Task> findByAssignedToIdAndPriorityAndCreationDateBetween(
            @Param("userId") Long userId,
            @Param("priority") Priority priority,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status = :status AND t.updatedAt <= t.dueDate")
    long countCompletedOnTimeByAssignedToId(
            @Param("userId") Long userId,
            @Param("status") TaskStatus status);
}