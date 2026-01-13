package org.task_manager.backend.schedular;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.task_manager.backend.model.TaskStatus;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.service.EmailService;

@Component
@RequiredArgsConstructor
public class TaskReminderSchedular {
    private final TaskRepository taskRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 8 * * *") // සෑම දිනකම උදෑසන 8 ට වැඩ කරයි
    public void sendDailyReminders() {
        taskRepository.findAll().stream()
                .filter(task -> task.getStatus() == TaskStatus.TODO)
                .filter(task -> task.getAssignedTo() != null)
                .forEach(task -> {
                    String message = "Hi " + task.getAssignedTo().getUsername() +
                            ", you have a pending task: " + task.getTitle();
                    emailService.sendEmail(task.getAssignedTo().getEmail(), "Daily Task Reminder", message);
                });
    }
}



