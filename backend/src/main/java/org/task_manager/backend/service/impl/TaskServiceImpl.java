package org.task_manager.backend.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.task_manager.backend.dto.TaskRequest;
import org.task_manager.backend.dto.TaskResponse;
import org.task_manager.backend.model.Priority;
import org.task_manager.backend.model.Task;
import org.task_manager.backend.model.TaskStatus;
import org.task_manager.backend.model.User;
import org.task_manager.backend.repository.TaskRepository;
import org.task_manager.backend.repository.UserRepository;
import org.task_manager.backend.service.TaskService;
import org.task_manager.backend.exception.ResourceNotFoundException;

import java.time.LocalDateTime;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private TaskResponse mapToTaskResponse(Task task){
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDueDate(task.getDueDate());
        response.setStatus(task.getStatus().name());
        response.setPriority(task.getPriority().name());
        response.setCreationDate(task.getCreationDate());

        if(task.getAssignedTo() !=null){
            response.setAssignedToId(task.getAssignedTo().getId());
            response.setAssignedToUsername(task.getAssignedTo().getUsername());

        }
        return response;

        //core crud implementation








    }
    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request){
        Task task =new Task();
        //Map fields from dto to entities
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.valueOf(request.getStatus()));
        task.setPriority(Priority.valueOf(request.getPriority()));
        task.setCreationDate(LocalDateTime.now());
        //Find assign the user

        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User","id",request.getAssignedToId()));
        task.setAssignedTo(assignedTo);

        Task savedTask = taskRepository.save(task);
        return mapToTaskResponse(savedTask);





    }
    @Override
    @Transactional


    public TaskResponse updateTask(Long id,TaskRequest request){
        Task task =taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task","id",id));

        //update field
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.valueOf(request.getStatus()));
        task.setPriority(Priority.valueOf(request.getPriority()));
        //update assigned use if necessary
        User assignedTo =userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User","id",request.getAssignedToId()));
        task.setAssignedTo(assignedTo);
        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponse(updatedTask);


    }
    @Override
    public void deleteTask(Long id){
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task","id",id));
        taskRepository.delete(task);
    }
    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id){
        Task task =taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task","id",id));
        return mapToTaskResponse(task);
    }
    @Override
    @Transactional
    public Page<TaskResponse> getAllTasks(
            String search,
            String status,
            String priority,
            int page,
            int size,
            String sortBy,
            String sortDir

    ){
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())?
                Sort.by(sortBy).ascending():
                Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);


        Page<Task> tasksPage = taskRepository.findAll(pageable);
        return tasksPage.map(this::mapToTaskResponse);
    }



}
