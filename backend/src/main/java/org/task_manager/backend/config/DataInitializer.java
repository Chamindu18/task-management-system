package org.task_manager.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.task_manager.backend.model.Role;
import org.task_manager.backend.model.RoleName;
import org.task_manager.backend.repository.RoleRepository;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

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
    }
}