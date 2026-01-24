package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.task_manager.backend.dto.AdminUserDto;
import org.task_manager.backend.dto.CreateUserDto;
import org.task_manager.backend.dto.UpdateUserDto;
import org.task_manager.backend.dto.UserResponseDto;
import org.task_manager.backend.exception.InvalidOperationException;
import org.task_manager.backend.model.*;
import org.task_manager.backend.repository.RoleRepository;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.repository.UserRepository;
import org.task_manager.backend.repository.UserSettingsRepository;
import org.task_manager.backend.security.SecurityService;

import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final RoleRepository roleRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityService securityService;

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
            statusCounts.put("PENDING", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count());
            statusCounts.put("IN_PROGRESS", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count());
            statusCounts.put("COMPLETED", allTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count());
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

    public List<AdminUserDto> getAllUsers() {
        List<Task> allTasks = taskRepository.findAll();
        
        return userRepository.findAll().stream()
                .map(user -> {
                    long completedTasks = allTasks.stream()
                            .filter(task -> task.getAssignedTo() != null && 
                                       task.getAssignedTo().getId().equals(user.getId()) &&
                                       task.getStatus() == TaskStatus.DONE)
                            .count();
                    
                    return new AdminUserDto(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole().getName().toString(),
                            completedTasks,
                            user.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Map<String, Object> getDashboardStats() {
        List<Task> allTasks = taskRepository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", getTotalUsers());
        stats.put("totalTasks", getTotalTasks());
        stats.put("taskStatusCounts", getTaskStatusCounts());
        stats.put("taskPriorityCounts", getTaskPriorityCounts());
        
        // Calculate completion rate
        stats.put("completionRate", calculateCompletionRate(allTasks));
        
        // Count active users (users with activity in last 7 days)
        stats.put("activeUsers", countActiveUsers(allTasks));
        
        // Count tasks created this week
        stats.put("tasksThisWeek", countTasksThisWeek(allTasks));
        
        // Count overdue tasks
        stats.put("overdueTasks", countOverdueTasks(allTasks));
        
        // User activity data for the last 7 days
        stats.put("activityData", getUserActivityData());
        
        return stats;
    }

    /**
     * Calculate overall task completion rate as percentage
     */
    private double calculateCompletionRate(List<Task> allTasks) {
        if (allTasks.isEmpty()) {
            return 0.0;
        }
        
        long completedTasks = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count();
        
        return Math.round((completedTasks * 100.0 / allTasks.size()) * 10.0) / 10.0;
    }

    /**
     * Count users who have created or been assigned tasks in the last 7 days
     */
    private int countActiveUsers(List<Task> allTasks) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        Set<Long> activeUserIds = new HashSet<>();
        
        for (Task task : allTasks) {
            // Check if task was created in last 7 days
            if (task.getCreationDate() != null && task.getCreationDate().isAfter(sevenDaysAgo)) {
                if (task.getAssignedTo() != null) {
                    activeUserIds.add(task.getAssignedTo().getId());
                }
            }
            
            // Check if task was updated in last 7 days
            if (task.getUpdatedAt() != null && task.getUpdatedAt().isAfter(sevenDaysAgo)) {
                if (task.getAssignedTo() != null) {
                    activeUserIds.add(task.getAssignedTo().getId());
                }
            }
        }
        
        return activeUserIds.size();
    }

    /**
     * Count tasks created this week (Monday to Sunday)
     */
    private long countTasksThisWeek(List<Task> allTasks) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(DayOfWeek.MONDAY).withHour(0).withMinute(0).withSecond(0).withNano(0);
        
        return allTasks.stream()
                .filter(t -> t.getCreationDate() != null)
                .filter(t -> t.getCreationDate().isAfter(startOfWeek) || t.getCreationDate().isEqual(startOfWeek))
                .count();
    }

    /**
     * Count tasks that are overdue (past due date and not completed)
     */
    private long countOverdueTasks(List<Task> allTasks) {
        LocalDateTime now = LocalDateTime.now();
        
        return allTasks.stream()
                .filter(t -> t.getDueDate() != null)
                .filter(t -> t.getDueDate().isBefore(now))
                .filter(t -> t.getStatus() != TaskStatus.DONE)
                .count();
    }

    /**
     * Get user activity data for the last 7 days
     * Returns array of daily active/inactive user counts
     */
    private List<Map<String, Object>> getUserActivityData() {
        List<Map<String, Object>> activityData = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        List<User> allUsers = userRepository.findAll();
        List<Task> allTasks = taskRepository.findAll();
        
        // Last 7 days
        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = now.minusDays(i).toLocalDate().atStartOfDay();
            LocalDateTime dayEnd = dayStart.plusDays(1);
            
            // Get day name (Mon, Tue, etc)
            String dayName = dayStart.getDayOfWeek().toString().substring(0, 3);
            dayName = dayName.charAt(0) + dayName.substring(1).toLowerCase();
            
            // Count users who had task activity on this day
            Set<Long> activeUserIds = new HashSet<>();
            for (Task task : allTasks) {
                // Check if task was created, updated, started, or completed on this day
                if (task.getCreationDate() != null && 
                    task.getCreationDate().isAfter(dayStart) && 
                    task.getCreationDate().isBefore(dayEnd) &&
                    task.getAssignedTo() != null) {
                    activeUserIds.add(task.getAssignedTo().getId());
                }
                if (task.getUpdatedAt() != null && 
                    task.getUpdatedAt().isAfter(dayStart) && 
                    task.getUpdatedAt().isBefore(dayEnd) &&
                    task.getAssignedTo() != null) {
                    activeUserIds.add(task.getAssignedTo().getId());
                }
                if (task.getStartedAt() != null && 
                    task.getStartedAt().isAfter(dayStart) && 
                    task.getStartedAt().isBefore(dayEnd) &&
                    task.getAssignedTo() != null) {
                    activeUserIds.add(task.getAssignedTo().getId());
                }
                if (task.getCompletedAt() != null && 
                    task.getCompletedAt().isAfter(dayStart) && 
                    task.getCompletedAt().isBefore(dayEnd) &&
                    task.getAssignedTo() != null) {
                    activeUserIds.add(task.getAssignedTo().getId());
                }
            }
            
            int activeCount = activeUserIds.size();
            int inactiveCount = allUsers.size() - activeCount;
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("name", dayName);
            dayData.put("active", activeCount);
            dayData.put("inactive", inactiveCount);
            
            activityData.add(dayData);
        }
        
        return activityData;
    }

    public String generateCsvReport() {
        List<Task> tasks = getAllTasks();
        StringBuilder csv = new StringBuilder("ID,Title,Status,Priority,AssignedTo\n");
        for (Task task : tasks) {
            String assignedUsername = task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : "Unassigned";
            csv.append(task.getId()).append(",")
                    .append(task.getTitle()).append(",")
                    .append(task.getStatus()).append(",")
                    .append(task.getPriority()).append(",")
                    .append(assignedUsername)
                    .append("\n");
        }
        return csv.toString();
    }

    /**
     * Create a new user (Admin functionality)
     */
    @Transactional
    public AdminUserDto createUser(CreateUserDto createUserDto) {
        // Validate email doesn't exist
        if (userRepository.existsByEmail(createUserDto.getEmail())) {
            throw InvalidOperationException.cannotCreate("user", "Email already exists");
        }
        
        // Validate username doesn't exist (use name as username)
        if (userRepository.existsByUsername(createUserDto.getName())) {
            throw InvalidOperationException.cannotCreate("user", "Username already exists");
        }
        
        // Determine role
        RoleName roleName = "admin".equalsIgnoreCase(createUserDto.getRole()) 
                ? RoleName.ADMIN 
                : RoleName.USER;
        
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        
        // Create user
        User user = new User();
        user.setUsername(createUserDto.getName());
        user.setEmail(createUserDto.getEmail());
        user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        // Save user
        User savedUser = userRepository.save(user);
        
        // Create default user settings
        UserSettings userSettings = new UserSettings(savedUser);
        userSettingsRepository.save(userSettings);
        
        // Return DTO
        return new AdminUserDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().getName().toString(),
                0L, // No tasks completed yet
                savedUser.getCreatedAt()
        );
    }

    /**
     * Update an existing user (Admin functionality)
     */
    @Transactional
    public AdminUserDto updateUser(Long userId, UpdateUserDto updateUserDto) {
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Check if email is being changed and validate uniqueness
        if (!user.getEmail().equals(updateUserDto.getEmail())) {
            if (userRepository.existsByEmail(updateUserDto.getEmail())) {
                throw InvalidOperationException.cannotUpdate("user", "Email already exists");
            }
        }
        
        // Check if username is being changed and validate uniqueness
        if (!user.getUsername().equals(updateUserDto.getName())) {
            if (userRepository.existsByUsername(updateUserDto.getName())) {
                throw InvalidOperationException.cannotUpdate("user", "Username already exists");
            }
        }
        
        // Determine role
        RoleName roleName = "admin".equalsIgnoreCase(updateUserDto.getRole()) 
                ? RoleName.ADMIN 
                : RoleName.USER;
        
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        
        // Update user fields
        user.setUsername(updateUserDto.getName());
        user.setEmail(updateUserDto.getEmail());
        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());
        
        // Save user
        User updatedUser = userRepository.save(user);
        
        // Count completed tasks for this user
        long completedTasks = taskRepository.findAll().stream()
                .filter(t -> t.getAssignedTo() != null && 
                            t.getAssignedTo().getId().equals(updatedUser.getId()) &&
                            t.getStatus() == TaskStatus.DONE)
                .count();
        
        // Return DTO
        return new AdminUserDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getRole().getName().toString(),
                completedTasks,
                updatedUser.getCreatedAt()
        );
    }

    /**
     * Delete a user (Admin functionality)
     */
    @Transactional
    public void deleteUser(Long userId) {
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Prevent admin from deleting themselves
        User currentUser = securityService.getCurrentUser();
        if (currentUser != null && currentUser.getId().equals(userId)) {
            throw InvalidOperationException.cannotDelete("user", "You cannot delete your own account");
        }
        
        // Delete user settings first
        userSettingsRepository.findByUser(user).ifPresent(userSettingsRepository::delete);
        
        // Unassign all tasks from this user (set assignedTo to null)
        List<Task> userTasks = taskRepository.findAll().stream()
                .filter(t -> t.getAssignedTo() != null && t.getAssignedTo().getId().equals(userId))
                .toList();
        
        for (Task task : userTasks) {
            task.setAssignedTo(null);
            taskRepository.save(task);
        }
        
        // Delete user
        userRepository.delete(user);
    }

    /**
     * Get current admin user's settings
     */
    public UserSettings getAdminSettings() {
        User currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        return userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default settings if not exists
                    UserSettings settings = new UserSettings(currentUser);
                    return userSettingsRepository.save(settings);
                });
    }

    /**
     * Update current admin user's settings
     */
    @Transactional
    public UserSettings updateAdminSettings(Map<String, Object> updates) {
        User currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        UserSettings settings = userSettingsRepository.findByUser(currentUser)
                .orElseGet(() -> new UserSettings(currentUser));
        
        // Update profile fields
        if (updates.containsKey("name")) {
            currentUser.setUsername((String) updates.get("name"));
            userRepository.save(currentUser);
        }
        if (updates.containsKey("email")) {
            currentUser.setEmail((String) updates.get("email"));
            userRepository.save(currentUser);
        }
        if (updates.containsKey("phone")) {
            settings.setPhoneNumber((String) updates.get("phone"));
        }
        
        // Update notification settings
        if (updates.containsKey("emailNotifications")) {
            settings.setEmailNotifications((Boolean) updates.get("emailNotifications"));
        }
        if (updates.containsKey("taskReminders")) {
            settings.setTaskReminders((Boolean) updates.get("taskReminders"));
        }
        if (updates.containsKey("weeklyReports")) {
            settings.setWeeklyReports((Boolean) updates.get("weeklyReports"));
        }
        if (updates.containsKey("systemAlerts")) {
            settings.setSystemAlerts((Boolean) updates.get("systemAlerts"));
        }
        
        return userSettingsRepository.save(settings);
    }

}