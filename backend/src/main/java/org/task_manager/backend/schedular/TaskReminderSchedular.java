package org.task_manager.backend.schedular;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.service.EmailService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class TaskReminderSchedular {
    private final TaskRepository taskRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 8 * * *") // සෑම දිනකම උදෑසන 8 ට වැඩ කරයි
    public void sendDailyReminders() {
        log.info("[SCHEDULER-DEBUG] ========================================");
        log.info("[SCHEDULER-DEBUG] Daily reminder job started at: {}", LocalDateTime.now());
        
        List<Task> allTasks = taskRepository.findAll();
        log.info("[SCHEDULER-DEBUG] Total tasks in database: {}", allTasks.size());
        
        List<Task> todoTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.TODO)
                .collect(Collectors.toList());
        log.info("[SCHEDULER-DEBUG] Tasks with TODO status: {}", todoTasks.size());
        
        List<Task> tasksWithAssignee = todoTasks.stream()
                .filter(task -> task.getAssignedTo() != null)
                .collect(Collectors.toList());
        log.info("[SCHEDULER-DEBUG] TODO tasks with assignee: {}", tasksWithAssignee.size());
        
        tasksWithAssignee.forEach(task -> {
            log.info("[SCHEDULER-DEBUG] Processing task '{}' for user: {}", 
                    task.getTitle(), task.getAssignedTo().getUsername());
            
            // Check if user has email notifications enabled
            boolean emailNotificationsEnabled = task.getAssignedTo().getUserSettings() != null 
                    && task.getAssignedTo().getUserSettings().getEmailNotifications() != null
                    && task.getAssignedTo().getUserSettings().getEmailNotifications();
            
            log.info("[SCHEDULER-DEBUG] User '{}' emailNotifications setting: {}", 
                    task.getAssignedTo().getUsername(), emailNotificationsEnabled);
            
            if (emailNotificationsEnabled) {
                String message = "Hi " + task.getAssignedTo().getUsername() +
                        ", you have a pending task: " + task.getTitle();
                try {
                    emailService.sendEmail(task.getAssignedTo().getEmail(), "Daily Task Reminder", message);
                    log.info("[SCHEDULER-DEBUG] ✓ Reminder sent to: {}", task.getAssignedTo().getEmail());
                } catch (Exception e) {
                    log.error("[SCHEDULER-DEBUG] ✗ Failed to send reminder to: {}", 
                            task.getAssignedTo().getEmail(), e);
                }
            } else {
                log.info("[SCHEDULER-DEBUG] ✗ Skipping email for user '{}' (notifications disabled)", 
                        task.getAssignedTo().getUsername());
            }
        });
        
        log.info("[SCHEDULER-DEBUG] Daily reminder job completed at: {}", LocalDateTime.now());
        log.info("[SCHEDULER-DEBUG] ========================================");
    }
}



