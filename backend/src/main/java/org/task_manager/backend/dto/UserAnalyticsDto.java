package org.task_manager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAnalyticsDto {
    private StatsDto stats;
    private List<DailyActivityDto> dailyActivity;
    private List<PriorityDistributionDto> priorityDistribution;
    private List<PerformanceTrendDto> performanceTrends;
    private List<RecentActivityDto> recentActivities;
}
