package org.task_manager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyActivityDto {
    private String day;
    private Integer completed;
    private Integer started;
}
