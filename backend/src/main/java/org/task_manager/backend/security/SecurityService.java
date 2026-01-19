package org.task_manager.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.UserRepository;

/**
 * Security utility service for authorization checks
 */
@Component("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;

    /**
     * Check if the current user is the owner of the requested resource
     * @param userId The user ID to check
     * @return true if current user is the owner or an admin, false otherwise
     */
    public boolean isCurrentUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        if (authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Long currentUserId = userDetails.getId();

            // Check if user is admin or the resource owner
            return userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))
                    || currentUserId.equals(userId);
        }

        return false;
    }

    /**
     * Get the current authenticated user
     * @return The current User object, or null if not authenticated
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        if (authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userRepository.findById(userDetails.getId()).orElse(null);
        }

        return null;
    }

    /**
     * Check if the current user is an admin
     * @return true if admin, false otherwise
     */
    public boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }
}
