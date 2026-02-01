package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        log.info("[EMAIL-DEBUG] Attempting to send email to: {}", to);
        log.info("[EMAIL-DEBUG] Subject: {}", subject);
        log.info("[EMAIL-DEBUG] Body preview: {}", body.substring(0, Math.min(50, body.length())));
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            log.info("[EMAIL-DEBUG] Sending email via JavaMailSender...");
            mailSender.send(message);
            log.info("[EMAIL-DEBUG] ✓ Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("[EMAIL-DEBUG] ✗ Failed to send email to: {}", to, e);
            log.error("[EMAIL-DEBUG] Error message: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Sends a welcome email to newly registered users.
     * This method is called after successful user registration.
     * 
     * @param username The username of the new user
     * @param email The email address of the new user
     */
    public void sendWelcomeEmail(String username, String email) {
        String subject = "Welcome to DreamDoo! 🎉";
        
        String body = String.format("""
                Hello %s,
                
                Welcome to DreamDoo Task Management System!
                
                Your account has been successfully created. You can now start organizing your tasks 
                and boosting your productivity.
                
                Here's what you can do with DreamDoo:
                ✓ Create and manage tasks efficiently
                ✓ Set priorities and due dates
                ✓ Receive email reminders for pending tasks
                ✓ Track your progress and productivity
                
                We're excited to have you on board!
                
                Best regards,
                DreamDoo Team
                """, username);
        
        log.info("[WELCOME-EMAIL] Sending welcome email to new user: {}", email);
        
        try {
            sendEmail(email, subject, body);
            log.info("[WELCOME-EMAIL] ✓ Welcome email sent successfully to: {}", email);
        } catch (Exception e) {
            // Log error but don't throw - registration should succeed even if email fails
            log.error("[WELCOME-EMAIL] ✗ Failed to send welcome email to: {}", email);
            log.error("[WELCOME-EMAIL] Error: {}", e.getMessage());
        }
    }}