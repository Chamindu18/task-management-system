package org.task_manager.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.dto.ReportDto;
import org.task_manager.backend.service.ReportService;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /**
     * Create a new report
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ReportDto> createReport(
            @RequestHeader("User-ID") Long userId,
            @RequestBody ReportDto reportDto) {
        ReportDto created = reportService.createReport(userId, reportDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Get report by ID
     */
    @GetMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ReportDto> getReport(@PathVariable Long reportId) {
        ReportDto report = reportService.getReportById(reportId);
        return ResponseEntity.ok(report);
    }

    /**
     * Get all reports for current user
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ReportDto>> getUserReports(
            @RequestHeader("User-ID") Long userId) {
        List<ReportDto> reports = reportService.getUserReports(userId);
        return ResponseEntity.ok(reports);
    }

    /**
     * Get all completed reports (Admin only)
     */
    @GetMapping("/completed/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportDto>> getCompletedReports() {
        List<ReportDto> reports = reportService.getCompletedReports();
        return ResponseEntity.ok(reports);
    }

    /**
     * Update report status
     */
    @PutMapping("/{reportId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportDto> updateReportStatus(
            @PathVariable Long reportId,
            @RequestParam String status) {
        ReportDto updated = reportService.updateReportStatus(reportId, status);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete report
     */
    @DeleteMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteReport(@PathVariable Long reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.noContent().build();
    }
}
