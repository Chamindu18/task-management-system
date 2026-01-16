package org.task_manager.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String reportName;
    
    @Column(nullable = false)
    private String reportType; // USER_REPORT, TASK_REPORT, ACTIVITY_REPORT, DASHBOARD_REPORT
    
    @Column(length = 500)
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by_user_id")
    private User generatedBy;
    
    @Column(nullable = false)
    private String format; // CSV, PDF, EXCEL
    
    @Column(length = 1000)
    private String filePath;
    
    private Long fileSize;
    
    @Column(nullable = false)
    private LocalDateTime generatedAt;
    
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    
    @Column(nullable = false)
    private String status; // PENDING, COMPLETED, FAILED, EXPIRED
    
    @Column(columnDefinition = "TEXT")
    private String filters; // JSON string of filters applied
    
    private Integer totalRecords;
    
    private Boolean includeCharts;
    
    @Column(length = 500)
    private String errorMessage;
    
    private LocalDateTime expiresAt;
    
    @Column(columnDefinition = "LONGTEXT")
    private String content; // For small reports, can store content directly
    
    // Constructors
    public Report(String reportName, String reportType, String format) {
        this.reportName = reportName;
        this.reportType = reportType;
        this.format = format;
        this.generatedAt = LocalDateTime.now();
        this.status = "PENDING";
        this.includeCharts = false;
    }
    
    public Report(String reportName, String reportType, String format, User generatedBy) {
        this(reportName, reportType, format);
        this.generatedBy = generatedBy;
    }
    
    @PrePersist
    protected void onCreate() {
        if (generatedAt == null) {
            generatedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "PENDING";
        }
        if (includeCharts == null) {
            includeCharts = false;
        }
    }
    
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }
}
