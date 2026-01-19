package org.task_manager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDto {
    private Long tasksCompleted;
    private Long tasksInProgress;
    private Long tasksPending;
    private Double completionRate;
    private Double onTimeRate;
    private Integer productivityScore;
    private Double avgTaskTime;
}
