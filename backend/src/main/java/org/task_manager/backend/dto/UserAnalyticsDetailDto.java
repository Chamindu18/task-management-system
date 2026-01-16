package org.task_manager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAnalyticsDetailDto {
    
    private Long userId;
    private String username;
    private String email;
    
    // Task Statistics
    private StatsDto stats;
    
    // Daily Activity Data for charts
    private List<DailyActivityDto> dailyActivity;
    
    // Priority Distribution
    private List<PriorityDistributionDto> priorityDistribution;
    
    // Performance Trends
    private List<PerformanceTrendDto> performanceTrends;
    
    // Recent Activities
    private List<RecentActivityDto> recentActivities;
    
    // Summary metrics
    private Double completionRate;
    private Integer totalTasksAssigned;
    private Integer completedTasks;
    private Integer inProgressTasks;
    private Integer pendingTasks;
    private Integer overdueTasks;
    
    private LocalDateTime generatedAt;
    
    // Time range info
    private String timeRange;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
