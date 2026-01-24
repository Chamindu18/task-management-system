package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.task_manager.backend.dto.*;
import org.task_manager.backend.model.Priority;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.repository.UserRepository;
import org.task_manager.backend.exception.UserNotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    public UserAnalyticsDetailDto getUserAnalytics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> UserNotFoundException.forId(userId));

        List<Task> allTasks = taskRepository.findByAssignedToId(userId);
        
        UserAnalyticsDetailDto analytics = new UserAnalyticsDetailDto();
        analytics.setUserId(userId);
        analytics.setUsername(user.getUsername());
        analytics.setEmail(user.getEmail());
        
        // Stats
        analytics.setStats(buildStatsDto(allTasks));
        
        // Daily Activity (last 7 days)
        analytics.setDailyActivity(buildDailyActivity(allTasks));
        
        // Priority Distribution
        analytics.setPriorityDistribution(buildPriorityDistribution(allTasks));
        
        // Performance Trends (last 6 months)
        analytics.setPerformanceTrends(buildPerformanceTrends(allTasks));
        
        // Recent Activities
        analytics.setRecentActivities(buildRecentActivities(allTasks));
        
        // Summary metrics
        analytics.setCompletionRate(getCompletionRate(allTasks));
        analytics.setTotalTasksAssigned(allTasks.size());
        analytics.setCompletedTasks((int) allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count());
        analytics.setInProgressTasks((int) allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                .count());
        analytics.setPendingTasks((int) allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.TODO)
                .count());
        analytics.setOverdueTasks(getOverdueTasks(allTasks).size());
        
        analytics.setGeneratedAt(LocalDateTime.now());
        analytics.setTimeRange("7days");
        analytics.setStartDate(LocalDateTime.now().minusDays(7));
        analytics.setEndDate(LocalDateTime.now());
        
        return analytics;
    }

    /**
     * Build StatsDto from task data
     */
    private StatsDto buildStatsDto(List<Task> tasks) {
        long completed = tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long inProgress = tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        long pending = tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        
        double completionRate = tasks.isEmpty() ? 0.0 : (completed * 100.0 / tasks.size());
        
        // Calculate on-time rate (tasks completed before due date)
        long completedOnTime = tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE && t.getDueDate() != null)
                .filter(t -> t.getUpdatedAt() != null && t.getUpdatedAt().isBefore(t.getDueDate()))
                .count();
        long completedWithDueDate = tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE && t.getDueDate() != null)
                .count();
        double onTimeRate = completedWithDueDate > 0 ? (completedOnTime * 100.0 / completedWithDueDate) : 100.0;
        
        StatsDto stats = new StatsDto();
        stats.setTasksCompleted(completed);
        stats.setTasksInProgress(inProgress);
        stats.setTasksPending(pending);
        stats.setCompletionRate(completionRate);
        stats.setOnTimeRate(onTimeRate);
        stats.setProductivityScore(calculateProductivityScore(tasks));
        stats.setAvgTaskTime(0.0); // Placeholder
        
        return stats;
    }

    /**
     * Build daily activity data for last 7 days
     */
    private List<DailyActivityDto> buildDailyActivity(List<Task> tasks) {
        List<DailyActivityDto> dailyActivity = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dayLabel = date.format(DateTimeFormatter.ofPattern("EEE"));
            
            int completed = (int) tasks.stream()
                    .filter(t -> t.getStatus() == TaskStatus.DONE)
                    .filter(t -> t.getUpdatedAt() != null && t.getUpdatedAt().toLocalDate().equals(date))
                    .count();
            
            int started = (int) tasks.stream()
                    .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                    .filter(t -> t.getCreationDate() != null && t.getCreationDate().toLocalDate().equals(date))
                    .count();
            
            dailyActivity.add(new DailyActivityDto(dayLabel, completed, started));
        }
        
        return dailyActivity;
    }

    /**
     * Build priority distribution data
     */
    private List<PriorityDistributionDto> buildPriorityDistribution(List<Task> tasks) {
        Map<Priority, Long> priorityCounts = tasks.stream()
                .collect(Collectors.groupingBy(
                        task -> task.getPriority() != null ? task.getPriority() : Priority.MEDIUM,
                        Collectors.counting()
                ));
        
        List<PriorityDistributionDto> distribution = new ArrayList<>();
        distribution.add(new PriorityDistributionDto("High", 
                priorityCounts.getOrDefault(Priority.HIGH, 0L).intValue(), "#ef4444"));
        distribution.add(new PriorityDistributionDto("Medium", 
                priorityCounts.getOrDefault(Priority.MEDIUM, 0L).intValue(), "#f59e0b"));
        distribution.add(new PriorityDistributionDto("Low", 
                priorityCounts.getOrDefault(Priority.LOW, 0L).intValue(), "#10b981"));
        
        return distribution;
    }

    /**
     * Build performance trends for last 6 months
     */
    private List<PerformanceTrendDto> buildPerformanceTrends(List<Task> tasks) {
        List<PerformanceTrendDto> trends = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = today.minusMonths(i);
            String monthLabel = monthDate.format(DateTimeFormatter.ofPattern("MMM"));
            
            int completedInMonth = (int) tasks.stream()
                    .filter(t -> t.getStatus() == TaskStatus.DONE)
                    .filter(t -> t.getUpdatedAt() != null && 
                            t.getUpdatedAt().getYear() == monthDate.getYear() &&
                            t.getUpdatedAt().getMonthValue() == monthDate.getMonthValue())
                    .count();
            
            // Quality score: percentage of on-time completion
            long completedOnTimeInMonth = tasks.stream()
                    .filter(t -> t.getStatus() == TaskStatus.DONE && t.getDueDate() != null)
                    .filter(t -> t.getUpdatedAt() != null && 
                            t.getUpdatedAt().getYear() == monthDate.getYear() &&
                            t.getUpdatedAt().getMonthValue() == monthDate.getMonthValue())
                    .filter(t -> t.getUpdatedAt().isBefore(t.getDueDate()))
                    .count();
            
            double quality = completedInMonth > 0 ? 
                    (completedOnTimeInMonth * 100.0 / completedInMonth) : 0.0;
            
            trends.add(new PerformanceTrendDto(monthLabel, completedInMonth, quality));
        }
        
        return trends;
    }

    /**
     * Build recent activities list
     */
    private List<RecentActivityDto> buildRecentActivities(List<Task> tasks) {
        return tasks.stream()
                .sorted(Comparator.comparing(Task::getUpdatedAt, 
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .map(task -> new RecentActivityDto(
                        task.getId(),
                        task.getTitle(),
                        task.getStatus().toString(),
                        task.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Calculate productivity score
     */
    private Integer calculateProductivityScore(List<Task> tasks) {
        if (tasks.isEmpty()) {
            return 50;
        }
        
        double completionRate = getCompletionRate(tasks);
        int overdueTasks = getOverdueTasks(tasks).size();
        int inProgressTasks = (int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                .count();
        
        double score = (completionRate * 0.6) +
                (inProgressTasks > 0 ? 20 : 0) +
                (overdueTasks == 0 ? 20 : Math.max(0, 20 - (overdueTasks * 5)));
        
        return Math.min(100, (int) score);
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
}
