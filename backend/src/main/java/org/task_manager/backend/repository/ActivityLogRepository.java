package org.task_manager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.task_manager.backend.model.ActivityLog;
import org.task_manager.backend.model.User;

import java.time.LocalDateTime;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    /**
     * Find all activity logs for a specific user
     */
    List<ActivityLog> findByUser(User user);
    
    /**
     * Find activity logs for a user between two dates
     */
    List<ActivityLog> findByUserAndTimestampBetween(User user, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find activity logs by action type
     */
    List<ActivityLog> findByAction(String action);
    
    /**
     * Find activity logs by entity type
     */
    List<ActivityLog> findByEntityType(String entityType);
    
    /**
     * Find activity logs by action and user
     */
    List<ActivityLog> findByActionAndUser(String action, User user);
    
    /**
     * Find activity logs by action and entity type
     */
    List<ActivityLog> findByActionAndEntityType(String action, String entityType);
    
    /**
     * Find all activity logs between two dates (system-wide)
     */
    List<ActivityLog> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find all activity logs ordered by timestamp (newest first)
     */
    @Query("SELECT a FROM ActivityLog a ORDER BY a.timestamp DESC")
    List<ActivityLog> findAllOrderByTimestampDesc();
    
    /**
     * Find recent activity logs (last N records)
     */
    @Query(value = "SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT :limit", nativeQuery = true)
    List<ActivityLog> findRecentActivityLogs(@Param("limit") int limit);
    
    /**
     * Find activity logs for a specific user ordered by timestamp
     */
    @Query("SELECT a FROM ActivityLog a WHERE a.user.id = :userId ORDER BY a.timestamp DESC")
    List<ActivityLog> findByUserIdOrderByTimestampDesc(@Param("userId") Long userId);
    
    /**
     * Find failed activity logs (for error tracking)
     */
    @Query("SELECT a FROM ActivityLog a WHERE a.status = 'FAILURE'")
    List<ActivityLog> findFailedActivities();
    
    /**
     * Count activities by action
     */
    long countByAction(String action);
    
    /**
     * Count activities by entity type
     */
    long countByEntityType(String entityType);
    
    /**
     * Count activities by user
     */
    long countByUser(User user);
    
    /**
     * Find activities with errors
     */
    @Query("SELECT a FROM ActivityLog a WHERE a.status = 'FAILURE' AND a.errorMessage IS NOT NULL")
    List<ActivityLog> findActivitiesWithErrors();
    
    /**
     * Get user login history
     */
    @Query("SELECT a FROM ActivityLog a WHERE a.user.id = :userId AND a.action = 'LOGIN' ORDER BY a.timestamp DESC")
    List<ActivityLog> findLoginHistoryByUserId(@Param("userId") Long userId);
    
    /**
     * Delete activity logs older than a specific date (for cleanup)
     */
    long deleteByTimestampBefore(LocalDateTime date);
}
