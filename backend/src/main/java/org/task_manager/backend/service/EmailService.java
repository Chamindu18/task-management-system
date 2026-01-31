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
}

