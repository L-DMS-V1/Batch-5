package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.FeedBackDto;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.CourseAssignedToEmployee;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.CoursesDisplayForEmployee;
import com.LDMSAppBackend.BackendModule.services.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final CourseService courseService;

    private final ResourceLinkCompletionService resourceLinkCompletionService;

    private final FeedBackService feedBackService;

    @Autowired
    public EmployeeController(CourseService courseService, ResourceLinkCompletionService resourceLinkCompletionService, FeedBackService feedBackService) {
        this.courseService = courseService;
        this.resourceLinkCompletionService = resourceLinkCompletionService;
        this.feedBackService = feedBackService;
    }

    @GetMapping("/getCourses")
    public ResponseEntity<?> getCourses()
    {
        List<CoursesDisplayForEmployee> courses = null;
        try{
            courses = courseService.getCoursesByEmployee();
        }
        catch (Exception e)
        {
            ResponseEntity.internalServerError().body(e);
        }
        return ResponseEntity.ok(courses);
    }
    @GetMapping("/getCourse/{courseId}")
    public ResponseEntity<?> getCourse(@PathVariable("courseId") Long courseId)
    {
        CourseAssignedToEmployee course;
        try{
            course= courseService.getCourseForEmployee(courseId);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(course);
    }

    @PutMapping("/{resourceId}/completed")
    public ResponseEntity<?> markCompleted( @PathVariable("resourceId")  Long resourceId)
    {
        String message = "";
        try{
           message= resourceLinkCompletionService.markResourceAsCompleted(resourceId);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{resourceId}/notCompleted")
    public ResponseEntity<?> markNotCompleted(@PathVariable("resourceId") Long resourceId)
    {
        try{
            resourceLinkCompletionService.markResourceAsNotCompleted(resourceId);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage()+"\n Cause: "+e.getCause());
        }
        return ResponseEntity.ok("marked as not completed");
    }

    @PostMapping("/feedback/{courseId}/{assignmentId}")
    public ResponseEntity<?> feedBack(@RequestBody @Valid FeedBackDto feedBackDto,
    		@PathVariable("courseId") Long courseId,
    		@PathVariable("assignmentId") Long assignmentId,
    		BindingResult bindingResult)
    {
        // Handle validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }
        try {
            feedBackService.addFeedback(feedBackDto,courseId,assignmentId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("error:"+e.getMessage());
        }
        return ResponseEntity.ok("feed back saved successfully");
    }
}
