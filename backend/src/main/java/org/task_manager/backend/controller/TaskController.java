package org.task_manager.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.task_manager.backend.dto.TaskRequest;
import org.task_manager.backend.dto.TaskResponse;
import org.task_manager.backend.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;
//GET :Retrive All tasks
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getAllTasks(
            @RequestParam(defaultValue = "0")int page,
            @RequestParam(defaultValue = "10")int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search


            ){
        Page <TaskResponse> tasks = taskService.getAllTasks(search, status, priority, page, size, sortBy, sortDir);
        return ResponseEntity.ok(tasks);

    }
    //POST creat new task
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest taskRequest){
        TaskResponse createdTask = taskService.createTask(taskRequest);
        return new  ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }
    //PUT :Update task

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest taskRequest){
        TaskResponse updatedTask = taskService.updateTask(id, taskRequest);
        return ResponseEntity.ok(updatedTask);

    }
    //Delete Task

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();

    }
    @GetMapping("/{id}")
        public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id){
        TaskResponse taskResponse = taskService.getTaskById(id);
        return ResponseEntity.ok(taskResponse);

    }



}
