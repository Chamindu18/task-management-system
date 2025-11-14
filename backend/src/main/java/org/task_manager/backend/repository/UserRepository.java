package org.task_manager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.task_manager.backend.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<org.task_manager.backend.model.User, Long> {
    Optional<org.task_manager.backend.model.User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}