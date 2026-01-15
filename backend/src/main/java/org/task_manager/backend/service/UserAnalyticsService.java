package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.task_manager.backend.dto.*;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAnalyticsService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public UserAnalyticsDto getUserAnalytics(Long userId, String timeRange) {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Calculate date range
        LocalDateTime[] dateRange = getDateRange(timeRange);
        LocalDateTime fromDate = dateRange[0];
        LocalDateTime toDate = dateRange[1];

        // Get all tasks for the user
        List<Task> userTasks = taskRepository.findByAssignedToId(userId);
        List<Task> tasksInRange = userTasks.stream()
                .filter(task -> isInDateRange(task, fromDate, toDate))
                .collect(Collectors.toList());

        // Build analytics object
        UserAnalyticsDto analytics = new UserAnalyticsDto();
        analytics.setStats(getUserTaskStats(userTasks, tasksInRange, fromDate, toDate));
        analytics.setDailyActivity(getDailyActivityData(tasksInRange, fromDate, toDate));
        analytics.setPriorityDistribution(getPriorityDistribution(tasksInRange));
        analytics.setPerformanceTrends(getPerformanceTrends(userTasks));
        analytics.setRecentActivities(getRecentActivities(userTasks, 5));

        return analytics;
    }

    private LocalDateTime[] getDateRange(String timeRange) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fromDate;

        switch (timeRange.toLowerCase()) {
            case "7days":
                fromDate = now.minusDays(7);
                break;
            case "30days":
                fromDate = now.minusDays(30);
                break;
            case "90days":
                fromDate = now.minusDays(90);
                break;
            case "year":
                fromDate = now.minusYears(1);
                break;
            default:
                fromDate = now.minusDays(7);
        }

        return new LocalDateTime[]{fromDate, now};
    }

    private boolean isInDateRange(Task task, LocalDateTime fromDate, LocalDateTime toDate) {
        if (task.getCreationDate() == null) {
            return false;
        }
        return !task.getCreationDate().isBefore(fromDate) && !task.getCreationDate().isAfter(toDate);
    }

    private StatsDto getUserTaskStats(List<Task> allTasks, List<Task> tasksInRange, LocalDateTime fromDate, LocalDateTime toDate) {
        long completedInRange = tasksInRange.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .count();
        long inProgressInRange = tasksInRange.stream()
                .filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS)
                .count();
        long pendingInRange = tasksInRange.stream()
                .filter(t -> t.getStatus() == TaskStatus.TODO)
                .count();

        long totalCompleted = allTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .count();
        long totalTasks = allTasks.size();

        Double completionRate = totalTasks > 0 ? (double) totalCompleted / totalTasks * 100 : 0.0;
        Double onTimeRate = calculateOnTimeRate(tasksInRange);
        Integer productivityScore = calculateProductivityScore(completionRate, onTimeRate);
        Double avgTaskTime = calculateAvgTaskCompletionTime(allTasks);

        return new StatsDto(
                completedInRange,
                inProgressInRange,
                pendingInRange,
                completionRate,
                onTimeRate,
                productivityScore,
                avgTaskTime
        );
    }

    private List<DailyActivityDto> getDailyActivityData(List<Task> tasksInRange, LocalDateTime fromDate, LocalDateTime toDate) {
        Map<String, DailyActivityDto> dailyMap = new HashMap<>();

        // Initialize last 7 days
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            String dayName = getDayName(date);
            dailyMap.put(dayName, new DailyActivityDto(dayName, 0, 0));
        }

        // Count tasks by day
        for (Task task : tasksInRange) {
            if (task.getCreationDate() != null) {
                String dayName = getDayName(task.getCreationDate());
                DailyActivityDto daily = dailyMap.getOrDefault(dayName, new DailyActivityDto(dayName, 0, 0));

                if (task.getStatus() == TaskStatus.COMPLETED) {
                    daily.setCompleted(daily.getCompleted() + 1);
                } else {
                    daily.setStarted(daily.getStarted() + 1);
                }

                dailyMap.put(dayName, daily);
            }
        }

        return new ArrayList<>(dailyMap.values());
    }

    private String getDayName(LocalDateTime dateTime) {
        return dateTime.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
    }

    private List<PriorityDistributionDto> getPriorityDistribution(List<Task> tasksInRange) {
        Map<String, Integer> priorityCount = new HashMap<>();
        priorityCount.put("High", 0);
        priorityCount.put("Medium", 0);
        priorityCount.put("Low", 0);

        for (Task task : tasksInRange) {
            if (task.getPriority() != null) {
                String priorityName = task.getPriority().toString();
                priorityCount.put(priorityName, priorityCount.getOrDefault(priorityName, 0) + 1);
            }
        }

        List<PriorityDistributionDto> distribution = new ArrayList<>();
        distribution.add(new PriorityDistributionDto("High", priorityCount.get("High"), "#ef4444"));
        distribution.add(new PriorityDistributionDto("Medium", priorityCount.get("Medium"), "#f59e0b"));
        distribution.add(new PriorityDistributionDto("Low", priorityCount.get("Low"), "#10b981"));

        return distribution;
    }

    private List<PerformanceTrendDto> getPerformanceTrends(List<Task> allTasks) {
        Map<YearMonth, Integer> completedByMonth = new HashMap<>();
        Map<YearMonth, Integer> totalByMonth = new HashMap<>();

        LocalDateTime now = LocalDateTime.now();

        // Initialize last 6 months
        for (int i = 5; i >= 0; i--) {
            YearMonth yearMonth = YearMonth.now().minusMonths(i);
            completedByMonth.put(yearMonth, 0);
            totalByMonth.put(yearMonth, 0);
        }

        // Count tasks by month
        for (Task task : allTasks) {
            if (task.getCreationDate() != null) {
                YearMonth yearMonth = YearMonth.from(task.getCreationDate());
                if (completedByMonth.containsKey(yearMonth)) {
                    totalByMonth.put(yearMonth, totalByMonth.get(yearMonth) + 1);
                    if (task.getStatus() == TaskStatus.COMPLETED) {
                        completedByMonth.put(yearMonth, completedByMonth.get(yearMonth) + 1);
                    }
                }
            }
        }

        List<PerformanceTrendDto> trends = new ArrayList<>();
        for (YearMonth yearMonth : completedByMonth.keySet()) {
            int completed = completedByMonth.get(yearMonth);
            int total = totalByMonth.get(yearMonth);
            Double quality = total > 0 ? (double) completed / total * 100 : 0.0;

            trends.add(new PerformanceTrendDto(
                    yearMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    completed,
                    quality
            ));
        }

        return trends;
    }

    private List<RecentActivityDto> getRecentActivities(List<Task> allTasks, int limit) {
        return allTasks.stream()
                .sorted((t1, t2) -> {
                    LocalDateTime date1 = t1.getUpdatedAt() != null ? t1.getUpdatedAt() : t1.getCreationDate();
                    LocalDateTime date2 = t2.getUpdatedAt() != null ? t2.getUpdatedAt() : t2.getCreationDate();
                    return date2.compareTo(date1);
                })
                .limit(limit)
                .map(task -> new RecentActivityDto(
                        task.getId(),
                        task.getTitle(),
                        task.getStatus().toString().toLowerCase(),
                        task.getUpdatedAt() != null ? task.getUpdatedAt() : task.getCreationDate()
                ))
                .collect(Collectors.toList());
    }

    private Double calculateOnTimeRate(List<Task> tasksInRange) {
        long completedOnTime = tasksInRange.stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED &&
                        task.getUpdatedAt() != null &&
                        task.getDueDate() != null &&
                        !task.getUpdatedAt().isAfter(task.getDueDate()))
                .count();

        long completedTasks = tasksInRange.stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                .count();

        return completedTasks > 0 ? (double) completedOnTime / completedTasks * 100 : 0.0;
    }

    private Integer calculateProductivityScore(Double completionRate, Double onTimeRate) {
        // Score based on 60% completion rate + 40% on-time rate
        return (int) ((completionRate * 0.6) + (onTimeRate * 0.4));
    }

    private Double calculateAvgTaskCompletionTime(List<Task> allTasks) {
        List<Task> completedTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED &&
                        task.getCreationDate() != null &&
                        task.getUpdatedAt() != null)
                .collect(Collectors.toList());

        if (completedTasks.isEmpty()) {
            return 0.0;
        }

        double totalDays = completedTasks.stream()
                .mapToDouble(task -> {
                    long hours = java.time.temporal.ChronoUnit.HOURS.between(task.getCreationDate(), task.getUpdatedAt());
                    return hours / 24.0;
                })
                .sum();

        return totalDays / completedTasks.size();
    }
}
