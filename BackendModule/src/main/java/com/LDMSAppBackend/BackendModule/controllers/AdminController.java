package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.*;
import com.LDMSAppBackend.BackendModule.enums.Role;
import com.LDMSAppBackend.BackendModule.services.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final TrainingRequestService trainingRequestService;
    private final CourseService courseService;
    private final CourseProgressService courseProgressService;
    private final PasswordEncoder passwordEncoder;
    private final UserServiceImpl userService;


    @Autowired
    public AdminController(TrainingRequestService trainingRequestService, CourseService courseService, CourseProgressService courseProgressService, PasswordEncoder passwordEncoder, UserServiceImpl userService) {
        this.trainingRequestService = trainingRequestService;
        this.courseService = courseService;
        this.courseProgressService = courseProgressService;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @PostMapping("/addEmployee")
    public ResponseEntity<?> addEmployee(@RequestBody @Valid EmployeeRegistrationDto employeeRegistrationDto,BindingResult bindingResult)
    {
        if(bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Fields: " + bindingResult.getFieldErrors());
        }
        Role role;
        try {
            Role.valueOf(employeeRegistrationDto.getRole().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role provided: " + employeeRegistrationDto.getRole());
        }
        try{
            employeeRegistrationDto.setPassword(passwordEncoder.encode(employeeRegistrationDto.getPassword()));
            userService.addEmployee(employeeRegistrationDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok("Employee created successfully");
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
    public ResponseEntity<?> createCourse(@RequestBody @Valid CourseCreationDto courseCreationDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Fields: " + bindingResult.getFieldErrors());
        }
        try{
            CourseCreationDto course = courseService.create(courseCreationDto);
            CourseCreationResponseDto res = new CourseCreationResponseDto(course, "Course created successfully.");
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while processing: " + e.getMessage());
        }
    }

    @PostMapping("/course/assign")
    public ResponseEntity<?> assignCourse(@RequestBody @Valid CourseAssignmentDto courseAssignmentDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Fields: " + bindingResult.getFieldErrors());
        }
        CourseAssignmentResponseDto courseAssignmentResponseDto;
        try {
            courseAssignmentResponseDto = courseService.assignCourses(courseAssignmentDto);
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.badRequest().body(e);
        }
        return ResponseEntity.ok(courseAssignmentResponseDto);
    }

    @DeleteMapping("/course/{courseId}/delete")
    public ResponseEntity<?> deleteCourse(@PathVariable("courseId") Long courseId)
    {
        try {
            courseService.deleteCourse(courseId);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok("Course with course Id: "+courseId + " is deleted");
    }

    @PutMapping("/course/update/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable("courseId") Long courseId,@RequestBody @Valid CourseCreationDto courseCreationDto, BindingResult bindingResult)
    {
        if(bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Fields: " + bindingResult.getFieldErrors());
        }
        CourseCreationDto course = null;
        try{
          course =  courseService.updateCourse(courseId,courseCreationDto);
        }
        catch (Exception e)
        {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(course);
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<?> getPendingRequests()
    {
        List<TrainingRequestResponse> trainingRequestResponses;
        try{
            trainingRequestResponses = trainingRequestService.getAllPendingRequests();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(trainingRequestResponses);
    }

    @GetMapping("/getAllCoursers")
    public ResponseEntity<?> getAllCourses()
    {
        List<CourseCreationDto> courses;
        try{
            courses = courseService.getAllCourses();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/getProgresses")
    public ResponseEntity<?> getProgress()
    {
        List<CourseProgressDisplayDto> courseProgressDisplayDtos =null;
          try{
             courseProgressDisplayDtos= courseProgressService.getAllProgress();
          }
          catch (Exception e)
          {
              return ResponseEntity.internalServerError().body(e.getMessage());
          }
          return ResponseEntity.ok(courseProgressDisplayDtos);
    }

    @GetMapping("/getAllEmployeesByPosition/{position}")
    public ResponseEntity<?> getEmployeeByPosition(@PathVariable("position") String position)
    {
        return ResponseEntity.ok(trainingRequestService.getEmployeesByPosition(position));
    }
}


