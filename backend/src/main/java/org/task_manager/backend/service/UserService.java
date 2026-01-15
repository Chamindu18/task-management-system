package org.task_manager.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.task_manager.backend.dto.UserResponseDto;
import org.task_manager.backend.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /**
     * Get all users for admin dashboard
     * Maps User entities to UserResponseDto with username as name
     */
    public List<UserResponseDto> getAllUsersForAdmin() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getUsername(),  // Maps to name in frontend
                        user.getEmail(),
                        user.getRole().getName().toString(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
