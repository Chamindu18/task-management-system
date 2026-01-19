package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.task_manager.backend.dto.UserAnalyticsDetailDto;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.repository.UserRepository;
import org.task_manager.backend.exception.UserNotFoundException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAnalyticsService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    /**
     * Get comprehensive analytics for a user
     */
    public Map<String, Object> getUserAnalytics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("userId", userId);
        analytics.put("username", user.getUsername());
        analytics.put("email", user.getEmail());
        analytics.put("joinDate", user.getCreatedAt());

        // Task statistics
        List<Task> allTasks = taskRepository.findByAssignedToId(userId);
        analytics.put("stats", getTaskStats(userId, allTasks));
        analytics.put("completionRate", getCompletionRate(allTasks));
        analytics.put("totalTasks", allTasks.size());
        analytics.put("completedTasks", (int) allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count());
        analytics.put("pendingTasks", (int) allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.TODO || t.getStatus() == TaskStatus.IN_PROGRESS)
                .count());
        analytics.put("overdueTasks", (int) getOverdueTasks(allTasks).size());
        analytics.put("productivityScore", getProductivityScore(userId));
        analytics.put("comparisonMetrics", getComparisonMetrics(userId));

        return analytics;
    }

    /**
     * Get task statistics for a user
     */
    public Map<String, Object> getTaskStats(Long userId, List<Task> userTasks) {
        Map<String, Object> stats = new HashMap<>();

        long totalTasks = userTasks.size();
        long completedTasks = userTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count();
        long inProgressTasks = userTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                .count();
        long todoTasks = userTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.TODO)
                .count();

        stats.put("totalTasks", totalTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("inProgressTasks", inProgressTasks);
        stats.put("todoTasks", todoTasks);
        stats.put("completionPercentage", totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0.0);

        return stats;
    }

    /**
     * Get activity data organized by date
     */
    public List<Map<String, Object>> getActivityData(Long userId, List<Task> userTasks) {
        Map<LocalDateTime, Long> dateMap = new HashMap<>();

        userTasks.forEach(task -> {
            LocalDateTime date = task.getCreationDate().withHour(0).withMinute(0).withSecond(0).withNano(0);
            dateMap.put(date, dateMap.getOrDefault(date, 0L) + 1);
        });

        return dateMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> dataPoint = new HashMap<>();
                    dataPoint.put("date", entry.getKey().toLocalDate());
                    dataPoint.put("taskCount", entry.getValue());
                    return dataPoint;
                })
                .sorted((a, b) -> ((java.time.LocalDate) a.get("date"))
                        .compareTo((java.time.LocalDate) b.get("date")))
                .collect(Collectors.toList());
    }

    /**
     * Get completion rate percentage
     */
    public double getCompletionRate(List<Task> userTasks) {
        if (userTasks.isEmpty()) {
            return 0.0;
        }

        long completed = userTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count();

        return (completed * 100.0) / userTasks.size();
    }

    /**
     * Get overdue tasks
     */
    public List<Task> getOverdueTasks(List<Task> userTasks) {
        LocalDateTime now = LocalDateTime.now();

        return userTasks.stream()
                .filter(t -> t.getDueDate() != null &&
                        t.getDueDate().isBefore(now) &&
                        t.getStatus() != TaskStatus.DONE)
                .collect(Collectors.toList());
    }

    /**
     * Get user productivity score (0-100)
     */
    public int getProductivityScore(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        List<Task> tasks = taskRepository.findByAssignedToId(userId);

        if (tasks.isEmpty()) {
            return 50; // Default score
        }

        double completionRate = getCompletionRate(tasks);
        int overdueTasks = getOverdueTasks(tasks).size();
        int inProgressTasks = (int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                .count();

        // Formula: 60% completion rate + 20% in-progress + 20% no overdue
        double score = (completionRate * 0.6) +
                (inProgressTasks > 0 ? 20 : 0) +
                (overdueTasks == 0 ? 20 : Math.max(0, 20 - (overdueTasks * 5)));

        return Math.min(100, (int) score);
    }

    /**
     * Get comparison metrics vs average
     */
    public Map<String, Object> getComparisonMetrics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        List<User> allUsers = userRepository.findAll();
        List<Task> userTasks = taskRepository.findByAssignedToId(userId);

        // Calculate averages
        double avgTasksPerUser = allUsers.stream()
                .mapToLong(u -> taskRepository.findByAssignedToId(u.getId()).size())
                .average()
                .orElse(0.0);

        double userCompletionRate = getCompletionRate(userTasks);
        double avgCompletionRate = allUsers.stream()
                .mapToDouble(u -> {
                    List<Task> tasks = taskRepository.findByAssignedToId(u.getId());
                    return getCompletionRate(tasks);
                })
                .average()
                .orElse(0.0);

        Map<String, Object> comparison = new HashMap<>();
        comparison.put("userTaskCount", userTasks.size());
        comparison.put("averageTaskCount", avgTasksPerUser);
        comparison.put("userCompletionRate", userCompletionRate);
        comparison.put("averageCompletionRate", avgCompletionRate);
        comparison.put("userRank", calculateRank(userId, allUsers));

        return comparison;
    }

    /**
     * Calculate user rank based on completion rate
     */
    private int calculateRank(Long userId, List<User> allUsers) {
        List<Task> userTasks = taskRepository.findByAssignedToId(userId);
        double userRate = getCompletionRate(userTasks);

        long betterRank = allUsers.stream()
                .filter(u -> !u.getId().equals(userId))
                .mapToDouble(u -> getCompletionRate(taskRepository.findByAssignedToId(u.getId())))
                .filter(rate -> rate > userRate)
                .count();

        return (int) (betterRank + 1);
    }
}
