package org.task_manager.backend.repository;

import org.task_manager.backend.model.Priority;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    
    // Existing methods
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
    
    // New query methods for enhanced filtering
    /**
     * Find tasks by status
     */
    List<Task> findByStatus(TaskStatus status);
    
    /**
     * Find tasks by priority
     */
    List<Task> findByPriority(Priority priority);
    
    /**
     * Find overdue tasks (due date passed and not completed)
     */
    @Query("SELECT t FROM Task t WHERE t.dueDate < CURRENT_TIMESTAMP AND t.status != 'DONE'")
    List<Task> findOverdueTasks();
    
    /**
     * Find overdue tasks for a specific user
     */
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId AND t.dueDate < CURRENT_TIMESTAMP AND t.status != 'DONE'")
    List<Task> findOverdueTasksByUserId(@Param("userId") Long userId);
    
    /**
     * Find tasks due between two dates
     */
    List<Task> findByDueDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find tasks due between two dates for a specific user
     */
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId AND t.dueDate BETWEEN :startDate AND :endDate")
    List<Task> findByAssignedToIdAndDueDateBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    /**
     * Count tasks by status
     */
    long countByStatus(TaskStatus status);
    
    /**
     * Count tasks by priority
     */
    long countByPriority(Priority priority);
    
    /**
     * Find tasks by title containing (case-insensitive)
     */
    List<Task> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Find tasks by title or description containing (case-insensitive)
     */
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Task> searchTasks(@Param("searchTerm") String searchTerm);
    
    /**
     * Get completion statistics for a user
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status = 'DONE'")
    long countCompletedTasksByUserId(@Param("userId") Long userId);
    
    /**
     * Get in-progress task count for a user
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status = 'IN_PROGRESS'")
    long countInProgressTasksByUserId(@Param("userId") Long userId);
    
    /**
     * Get pending task count for a user
     */
    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status = 'TODO'")
    long countPendingTasksByUserId(@Param("userId") Long userId);
}