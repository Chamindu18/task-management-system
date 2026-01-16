package org.task_manager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.task_manager.backend.model.Role;
import org.task_manager.backend.model.RoleName;
import org.task_manager.backend.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<org.task_manager.backend.model.User, Long> {
    
    // Existing methods
    Optional<org.task_manager.backend.model.User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    
    // New search methods
    /**
     * Find users by username containing (case-insensitive)
     */
    List<User> findByUsernameContainingIgnoreCase(String username);
    
    /**
     * Find users by email containing (case-insensitive)
     */
    List<User> findByEmailContainingIgnoreCase(String email);
    
    /**
     * Find users by role
     */
    List<User> findByRole(Role role);
    
    /**
     * Find users by role name
     */
    List<User> findByRoleName(RoleName roleName);
    
    /**
     * Search users by username or email (case-insensitive)
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);
    
    /**
     * Find users created between two dates
     */
    List<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find users created after a specific date
     */
    List<User> findByCreatedAtAfter(LocalDateTime date);
    
    /**
     * Find users created before a specific date
     */
    List<User> findByCreatedAtBefore(LocalDateTime date);
    
    /**
     * Count users by role
     */
    long countByRole(Role role);
    
    /**
     * Count users by role name
     */
    long countByRoleName(RoleName roleName);
    
    /**
     * Get all users sorted by creation date (newest first)
     */
    @Query("SELECT u FROM User u ORDER BY u.createdAt DESC")
    List<User> findAllOrderByCreatedAtDesc();
    
    /**
     * Get all users sorted by username (alphabetically)
     */
    @Query("SELECT u FROM User u ORDER BY u.username ASC")
    List<User> findAllOrderByUsernameAsc();
}