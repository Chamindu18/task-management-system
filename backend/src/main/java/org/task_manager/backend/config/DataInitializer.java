package org.task_manager.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.task_manager.backend.model.Role;
import org.task_manager.backend.model.RoleName;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.RoleRepository;
import org.task_manager.backend.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create roles if they don't exist
        for (RoleName roleName : RoleName.values()) {
            if (!roleRepository.findByName(roleName).isPresent()) {
                Role role = new Role(roleName);
                roleRepository.save(role);
                System.out.println("Created role: " + roleName);
            }
        }

        // Create default admin user
        createAdminUserIfNotExists();
    }

    private void createAdminUserIfNotExists() {
        String adminUsername = "admin";
        String adminEmail = "admin@taskmanager.com";
        String adminPassword = "admin123";

        if (!userRepository.existsByUsername(adminUsername)) {
            Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            User adminUser = new User();
            adminUser.setUsername(adminUsername);
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRole(adminRole);

            userRepository.save(adminUser);
            System.out.println("✅ Created default admin user: " + adminUsername);
            System.out.println("📧 Admin email: " + adminEmail);
            System.out.println("🔑 Admin password: " + adminPassword);
        } else {
            System.out.println("ℹ️ Admin user already exists");
        }
    }
}