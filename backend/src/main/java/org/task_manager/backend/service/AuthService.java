package org.task_manager.backend.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.task_manager.backend.dto.AuthResponseDto;
import org.task_manager.backend.dto.LoginRequest;
import org.task_manager.backend.dto.RegisterRequest;
import org.task_manager.backend.model.Role;
import org.task_manager.backend.model.RoleName;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.RoleRepository;
import org.task_manager.backend.repository.UserRepository;
import org.task_manager.backend.security.CustomUserDetails;
import org.task_manager.backend.security.JwtUtil;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponseDto register(RegisterRequest request) {
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Get or create USER role
        Role userRole = roleRepository.findByName(RoleName.USER)
                .orElseGet(() -> {
                    Role newRole = new Role(RoleName.USER);
                    return roleRepository.save(newRole);
                });

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);

        User savedUser = userRepository.save(user);

        // Generate JWT token for immediate login after registration
        String token = jwtUtil.generateToken(new CustomUserDetails(savedUser));

        return new AuthResponseDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().getName().name(),
                "Registration successful",
                token
        );
    }

    public AuthResponseDto login(LoginRequest request, HttpServletRequest httpRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            // Get user entity
            User user = userDetails.getUser();

            return new AuthResponseDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().getName().name(),
                    "Login successful",
                    token
            );

        } catch (Exception e) {
            throw new RuntimeException("Invalid username or password");
        }
    }

    // Optional: Method to get current user info
    public AuthResponseDto getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        return new AuthResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName().name(),
                "User information retrieved",
                null // No new token for info requests
        );
    }

    // Optional: Method to check if username is available
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    // Optional: Method to check if email is available
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
}