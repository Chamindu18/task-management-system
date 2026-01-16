package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.task_manager.backend.dto.ReportDto;
import org.task_manager.backend.exception.ResourceNotFoundException;
import org.task_manager.backend.model.Report;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.ReportRepository;
import org.task_manager.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    /**
     * Create a new report
     */
    public ReportDto createReport(Long userId, ReportDto reportDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Report report = new Report();
        report.setReportName(reportDto.getReportName());
        report.setReportType(reportDto.getReportType());
        report.setFormat(reportDto.getFormat());
        report.setGeneratedBy(user);
        report.setGeneratedAt(LocalDateTime.now());
        report.setStatus("PENDING");
        report.setTotalRecords(0);
        report.setFileSize(0L);

        if (reportDto.getFromDate() != null) {
            report.setFromDate(reportDto.getFromDate());
        }
        if (reportDto.getToDate() != null) {
            report.setToDate(reportDto.getToDate());
        }

        // Set expiry to 30 days from now
        report.setExpiresAt(LocalDateTime.now().plusDays(30));

        Report savedReport = reportRepository.save(report);
        return convertToDto(savedReport);
    }

    /**
     * Get report by ID
     */
    public ReportDto getReportById(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));
        return convertToDto(report);
    }

    /**
     * Get all reports for a user
     */
    public List<ReportDto> getUserReports(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return reportRepository.findByGeneratedBy(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get completed reports
     */
    public List<ReportDto> getCompletedReports() {
        return reportRepository.findCompletedReportsOrderByGeneratedAtDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Update report status
     */
    public ReportDto updateReportStatus(Long reportId, String status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));

        report.setStatus(status);
        Report updated = reportRepository.save(report);
        return convertToDto(updated);
    }

    /**
     * Delete report
     */
    public void deleteReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));
        reportRepository.delete(report);
    }

    /**
     * Convert Report entity to DTO
     */
    private ReportDto convertToDto(Report report) {
        ReportDto dto = new ReportDto();
        dto.setId(report.getId());
        dto.setReportName(report.getReportName());
        dto.setReportType(report.getReportType());
        dto.setDescription(report.getDescription());
        dto.setGeneratedById(report.getGeneratedBy() != null ? report.getGeneratedBy().getId() : null);
        dto.setGeneratedByUsername(report.getGeneratedBy() != null ? report.getGeneratedBy().getUsername() : null);
        dto.setFormat(report.getFormat());
        dto.setFilePath(report.getFilePath());
        dto.setFileSize(report.getFileSize());
        dto.setGeneratedAt(report.getGeneratedAt());
        dto.setFromDate(report.getFromDate());
        dto.setToDate(report.getToDate());
        dto.setStatus(report.getStatus());
        dto.setFilters(report.getFilters());
        dto.setTotalRecords(report.getTotalRecords());
        dto.setIncludeCharts(report.getIncludeCharts());
        return dto;
    }
}
