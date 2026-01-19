package org.task_manager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDto {
    
    private Long id;
    private String reportName;
    private String reportType; // USER_REPORT, TASK_REPORT, ACTIVITY_REPORT
    private String description;
    
    private Long generatedById;
    private String generatedByUsername;
    
    private String format; // CSV, PDF, EXCEL
    private String filePath;
    private Long fileSize;
    
    private LocalDateTime generatedAt;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    
    private String status; // PENDING, COMPLETED, FAILED
    private String filters; // JSON string of filters applied
    
    private Integer totalRecords;
    private Boolean includeCharts;
}
