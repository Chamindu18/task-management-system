package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.task_manager.backend.dto.PasswordChangeDto;
import org.task_manager.backend.dto.TaskResponseDto;
import org.task_manager.backend.dto.UserResponseDto;
import org.task_manager.backend.dto.UserSearchResultDto;
import org.task_manager.backend.dto.UserUpdateDto;
import org.task_manager.backend.exception.InvalidCredentialsException;
import org.task_manager.backend.exception.InvalidOperationException;
import org.task_manager.backend.exception.UserNotFoundException;
import org.task_manager.backend.model.RoleName;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get all users for admin dashboard
     * Maps User entities to UserResponseDto with username as name
     */
    public List<UserResponseDto> getAllUsersForAdmin() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getUsername(),  // Maps to name in frontend
                        user.getEmail(),
                        user.getRole().getName().toString(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Get a user by ID
     * @param userId User ID to retrieve
     * @return UserResponseDto containing user details
     * @throws UserNotFoundException if user not found
     */
    public UserResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));
        
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName().toString(),
                user.getCreatedAt()
        );
    }

    /**
     * Update user details (username, email, phone, department)
     * @param userId User ID to update
     * @param updateDto DTO containing new user details
     * @return Updated UserResponseDto
     * @throws UserNotFoundException if user not found
     * @throws InvalidOperationException if update violates business rules
     */
    public UserResponseDto updateUser(Long userId, UserUpdateDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        // Validate new username doesn't already exist (if changing)
        if (updateDto.getUsername() != null && !updateDto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateDto.getUsername())) {
                throw InvalidOperationException.cannotUpdate("username", "Username already exists");
            }
            user.setUsername(updateDto.getUsername());
        }

        // Validate new email doesn't already exist (if changing)
        if (updateDto.getEmail() != null && !updateDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updateDto.getEmail())) {
                throw InvalidOperationException.cannotUpdate("email", "Email already exists");
            }
            user.setEmail(updateDto.getEmail());
        }

        // Update optional fields
        if (updateDto.getPhone() != null) {
            user.setPhone(updateDto.getPhone());
        }

        if (updateDto.getDepartment() != null) {
            user.setDepartment(updateDto.getDepartment());
        }

        User updatedUser = userRepository.save(user);

        return new UserResponseDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getRole().getName().toString(),
                updatedUser.getCreatedAt()
        );
    }

    /**
     * Delete a user by ID
     * @param userId User ID to delete
     * @throws UserNotFoundException if user not found
     * @throws InvalidOperationException if user is the last admin
     */
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        // Prevent deletion of last admin user
        if (user.getRole().getName().toString().equals("ADMIN")) {
            long adminCount = userRepository.countByRoleName(RoleName.ADMIN);
            if (adminCount <= 1) {
                throw InvalidOperationException.cannotDelete("user", "Cannot delete the last admin user");
            }
        }

        userRepository.deleteById(userId);
    }

    /**
     * Change user password with validation
     * @param userId User ID whose password to change
     * @param changePasswordDto DTO containing current and new password
     * @throws UserNotFoundException if user not found
     * @throws InvalidCredentialsException if current password is incorrect or passwords don't match
     */
    public void changePassword(Long userId, PasswordChangeDto changePasswordDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        // Verify current password
        if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            throw InvalidCredentialsException.invalidPassword();
        }

        // Verify passwords match
        if (!changePasswordDto.getNewPassword().equals(changePasswordDto.getConfirmPassword())) {
            throw InvalidCredentialsException.passwordMismatch();
        }

        // Prevent using same password
        if (changePasswordDto.getNewPassword().equals(changePasswordDto.getCurrentPassword())) {
            throw InvalidOperationException.invalidState("password", "New password must be different from current password");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);
    }

    /**
     * Get user by username
     * @param username Username to search for
     * @return UserResponseDto containing user details
     * @throws UserNotFoundException if user not found
     */
    public UserResponseDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> UserNotFoundException.forUsername(username));

        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName().toString(),
                user.getCreatedAt()
        );
    }

    /**
     * Get user by email
     * @param email Email address to search for
     * @return UserResponseDto containing user details
     * @throws UserNotFoundException if user not found
     */
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> UserNotFoundException.forEmail(email));

        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName().toString(),
                user.getCreatedAt()
        );
    }

    /**
     * Search users by username or email (case-insensitive)
     * @param searchTerm Username or email to search for
     * @return List of UserSearchResultDto with relevance scoring
     */
    public List<UserSearchResultDto> searchUsers(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return List.of();
        }

        String searchPattern = "%" + searchTerm.trim() + "%";
        List<User> results = userRepository.searchUsers(searchTerm);

        return results.stream()
                .map(user -> new UserSearchResultDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().getName().toString(),
                        (long) user.getTasks().stream()
                                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                                .count(),
                        (long) user.getTasks().size(),
                        user.getCreatedAt(),
                        "ACTIVE",
                        calculateRelevanceScore(searchTerm, user)
                ))
                .sorted((a, b) -> Double.compare(b.getRelevanceScore(), a.getRelevanceScore()))
                .collect(Collectors.toList());
    }

    /**
     * Get all tasks assigned to a user
     * @param userId User ID to fetch tasks for
     * @return List of TaskResponseDto for user's tasks
     * @throws UserNotFoundException if user not found
     */
    public List<TaskResponseDto> getUserTasks(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        return taskRepository.findByAssignedToId(userId).stream()
                .map(this::convertTaskToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all completed tasks for a user
     * @param userId User ID to fetch completed tasks for
     * @return List of completed TaskResponseDto
     * @throws UserNotFoundException if user not found
     */
    public List<TaskResponseDto> getUserCompletedTasks(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        return taskRepository.findByAssignedToIdAndStatus(userId, TaskStatus.COMPLETED).stream()
                .map(this::convertTaskToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all pending/in-progress tasks for a user
     * @param userId User ID to fetch pending tasks for
     * @return List of pending TaskResponseDto
     * @throws UserNotFoundException if user not found
     */
    public List<TaskResponseDto> getUserPendingTasks(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        List<Task> todoTasks = taskRepository.findByAssignedToIdAndStatus(userId, TaskStatus.TODO);
        List<Task> inProgressTasks = taskRepository.findByAssignedToIdAndStatus(userId, TaskStatus.IN_PROGRESS);
        
        todoTasks.addAll(inProgressTasks);
        
        return todoTasks.stream()
                .map(this::convertTaskToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get count of tasks for a user by status
     * @param userId User ID
     * @param status Task status to count
     * @return Number of tasks with specified status
     * @throws UserNotFoundException if user not found
     */
    public long countUserTasksByStatus(Long userId, TaskStatus status) {
        userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        if (status == null) {
            return taskRepository.findByAssignedToId(userId).size();
        }
        return taskRepository.countByAssignedToIdAndStatus(userId, status);
    }

    /**
     * Get total task count for a user
     * @param userId User ID
     * @return Total number of tasks assigned to user
     * @throws UserNotFoundException if user not found
     */
    public long countUserTasks(Long userId) {
        return countUserTasksByStatus(userId, null);
    }

    /**
     * Helper method to convert Task entity to TaskResponseDto
     */
    private TaskResponseDto convertTaskToDto(Task task) {
        return new TaskResponseDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus() != null ? task.getStatus().toString() : null,
                task.getPriority() != null ? task.getPriority().toString() : null,
                task.getDueDate(),
                task.getCreationDate(),
                task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : null,
                task.getAssignedTo() != null ? task.getAssignedTo().getId() : null
        );
    }

    /**
     * Calculate relevance score for search results
     * Higher score = better match
     */
    private double calculateRelevanceScore(String searchTerm, User user) {
        double score = 0.0;
        String lowerTerm = searchTerm.toLowerCase();
        String lowerUsername = user.getUsername().toLowerCase();
        String lowerEmail = user.getEmail().toLowerCase();

        // Exact match gets highest score
        if (lowerUsername.equals(lowerTerm) || lowerEmail.equals(lowerTerm)) {
            return 2.0;
        }

        // Username starts with search term
        if (lowerUsername.startsWith(lowerTerm)) {
            score += 1.5;
        }

        // Username contains search term
        if (lowerUsername.contains(lowerTerm)) {
            score += 1.0;
        }

        // Email contains search term
        if (lowerEmail.contains(lowerTerm)) {
            score += 0.8;
        }

        return Math.max(score, 0.5); // Minimum score for matches
    }
}
