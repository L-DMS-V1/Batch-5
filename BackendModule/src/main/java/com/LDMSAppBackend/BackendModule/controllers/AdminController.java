package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.*;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.*;
import com.LDMSAppBackend.BackendModule.enums.Role;
import com.LDMSAppBackend.BackendModule.exceptions.DuplicateUserException;
import com.LDMSAppBackend.BackendModule.services.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final TrainingRequestService trainingRequestService;
    private final CourseService courseService;
    private final CourseProgressService courseProgressService;
    private final PasswordEncoder passwordEncoder;
    private final UserServiceImpl userService;
    private final FeedBackService feedBackService;


    @Autowired
    public AdminController(TrainingRequestService trainingRequestService, CourseService courseService, CourseProgressService courseProgressService, PasswordEncoder passwordEncoder, UserServiceImpl userService, FeedBackService feedBackService) {
        this.trainingRequestService = trainingRequestService;
        this.courseService = courseService;
        this.courseProgressService = courseProgressService;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.feedBackService = feedBackService;
    }

    @PostMapping("/addEmployee")
    public ResponseEntity<?> addEmployee(@RequestBody @Valid EmployeeRegistrationDto employeeRegistrationDto, BindingResult bindingResult)
    {
        // Handle validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
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

    @PostMapping("/addManager")
    public  ResponseEntity<?> addManager(@RequestBody @Valid UserRegistrationDto userRegistrationDto, BindingResult bindingResult)
    {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }
        try{
            userService.addUser(userRegistrationDto);
        }
        catch (DataIntegrityViolationException | DuplicateUserException e)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Manager has been added successfully");
    }

    @PutMapping("/acceptRequest/{requestId}")
    public ResponseEntity<?> acceptRequest(@PathVariable("requestId") Long requestId) {
        try{
        trainingRequestService.acceptRequest(requestId);
        }
        catch (EntityNotFoundException e)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        return ResponseEntity.ok("Request accepted");
    }

    @PutMapping("/rejectRequest/{requestId}")
    public ResponseEntity<String> rejectRequest(@PathVariable("requestId") Long requestId) {
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
        // Handle validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }
        CourseAssignmentResponseDto courseAssignmentResponseDto;
        try {
            courseAssignmentResponseDto = courseService.assignCourses(courseAssignmentDto);
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.badRequest().body(e.getMessage());
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

    @GetMapping("/getAllCourses")
    public ResponseEntity<?> getAllCourses()
    {
        List<CourseDisplayForAdmin> courses;
        try{
            courses = courseService.getAllCourses();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/getCourse/{courseId}")
    public ResponseEntity<?> getCourse(@PathVariable("courseId") Long courseId)
    {
        CourseCreationDto course;
        try {
            course = courseService.getCourseByCourseId(courseId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok(course);
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

    @PostMapping("/getAllEmployeesByPosition")
    public ResponseEntity<?> getEmployeeByPosition(@RequestBody @Valid ManagerNameAndEmployeePosition managerNameAndEmployeePosition)
    {
        return ResponseEntity.ok(trainingRequestService.getEmployeesByPositionAndManagerName(managerNameAndEmployeePosition));
    }

    @GetMapping("/getAllManagers")
    public ResponseEntity<?> getAllManagerNames()
    {
        ManagerNames managerNames = null;
        try{
            managerNames = userService.getManagerNames();
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(managerNames);
    }

    @GetMapping("/getFeedbacks/{courseId}")
    public ResponseEntity<?> getFeedbacks(@PathVariable("courseId") Long courseId)
    {
        return ResponseEntity.ok(feedBackService.getFeedBacks(courseId));
    }

    @GetMapping("/getFeedbackFrequencies/{courseId}")
    public ResponseEntity<?> getFeedbackFrequencies(@PathVariable("courseId") Long courseId)
    {
        return ResponseEntity.ok(feedBackService.getRatingFrequency(courseId));
    }
}


