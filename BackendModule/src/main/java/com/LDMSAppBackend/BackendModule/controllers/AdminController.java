package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.CourseAssignmentDto;
import com.LDMSAppBackend.BackendModule.Dtos.CourseCreationResponseDto;
import com.LDMSAppBackend.BackendModule.Dtos.CourseDto;
import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestResponse;
import com.LDMSAppBackend.BackendModule.entites.Course;
import com.LDMSAppBackend.BackendModule.entites.CourseAssignment;
import com.LDMSAppBackend.BackendModule.services.CourseService;
import com.LDMSAppBackend.BackendModule.services.TrainingRequestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private TrainingRequestService trainingRequestService;
    private CourseService courseService;

    @Autowired
    public AdminController(TrainingRequestService trainingRequestService,CourseService courseService) {
        this.trainingRequestService = trainingRequestService;
        this.courseService = courseService;
    }

    @PutMapping("/acceptRequest/{id}")
    public ResponseEntity<?> acceptRequest(@PathVariable("id") Long requestId) {
        try{
        trainingRequestService.acceptRequest(requestId);
        }
        catch (EntityNotFoundException e)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        return ResponseEntity.ok("Request accepted");
    }

    @PutMapping("/rejectRequest/{id}")
    public ResponseEntity<String> rejectRequest(@PathVariable("id") Long requestId) {
        try{
        trainingRequestService.rejectRequest(requestId);
        }
        catch (EntityNotFoundException e)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        return ResponseEntity.ok("Request rejected");
    }

    @GetMapping("/getAllRequests")
    public ResponseEntity<List<TrainingRequestResponse>> getAllRequests() {
        List<TrainingRequestResponse> requests = trainingRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
    @PostMapping("/course/create")
    public ResponseEntity<?> createCourse(@RequestBody CourseDto courseDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Fields: " + bindingResult.getFieldErrors());
        }
        try{
            Course course = courseService.createCourse(courseDto);
            CourseCreationResponseDto res = new CourseCreationResponseDto(course, "Course created successfully.");
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while processing: " + e.getMessage());
        }
    }
    @PostMapping("/course/assign")

    public ResponseEntity<?> assignCourse(@RequestBody CourseAssignmentDto courseAssignmentDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Fields: " + bindingResult.getFieldErrors());
        }

        try{
            List<CourseAssignment> successfulAssignments = new ArrayList<>();
            List<String> failedAssignments = new ArrayList<>();

            for (Integer employeeId : courseAssignmentDto.getEmployeeIds()) {
                try {
                    CourseAssignment courseAssignment = courseService.assignCourseToEmployee(courseAssignmentDto.getCourseId(), employeeId, courseAssignmentDto.getDeadline(), courseAssignmentDto.getStatus());
                    successfulAssignments.add(courseAssignment);
                } catch (Exception e) {
                    failedAssignments.add("Failed to assign course to employee ID " + employeeId + ": " + e.getMessage());
                }
            }
            Map<String, Object> response = new HashMap<>();
            response.put("successfulAssignments", successfulAssignments);
            response.put("failedAssignments", failedAssignments);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while processing: "+ e.getMessage());
        }
    }
}


