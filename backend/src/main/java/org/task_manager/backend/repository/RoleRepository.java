package org.task_manager.backend.repository;

import org.task_manager.backend.model.Role;
import org.task_manager.backend.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
