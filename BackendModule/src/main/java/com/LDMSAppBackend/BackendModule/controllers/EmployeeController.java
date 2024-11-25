package com.LDMSAppBackend.BackendModule.controllers;



import com.LDMSAppBackend.BackendModule.Dtos.*;
import com.LDMSAppBackend.BackendModule.services.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final CourseService courseService;

    private final CourseServiceForEmployee courseServiceForEmployee;

    private final ResourceLinkCompletionService resourceLinkCompletionService;

    private final FeedBackService feedBackService;

    @Autowired
    public EmployeeController(CourseService courseService, CourseServiceForEmployee courseServiceForEmployee, ResourceLinkCompletionService resourceLinkCompletionService, FeedBackService feedBackService) {
        this.courseService = courseService;
        this.courseServiceForEmployee = courseServiceForEmployee;
        this.resourceLinkCompletionService = resourceLinkCompletionService;
        this.feedBackService = feedBackService;
    }

    @GetMapping("/{employeeId}/getCourses")
    public ResponseEntity<?> getCourses(@PathVariable Integer employeeId)
    {
        List<CoursesDisplayForEmployee> courses = null;
        try{
            courses = courseService.getCoursesByEmployee(employeeId);
        }
        catch (Exception e)
        {
            ResponseEntity.internalServerError().body(e);
        }
        return ResponseEntity.ok(courses);
    }
    @GetMapping("/{employeeId}/getCourse/{courseId}")
    public ResponseEntity<?> getCourse( @PathVariable("courseId") @Valid Long courseId, @PathVariable("employeeId") @Valid Integer employeeId)
    {
        CourseAssignedToEmployee course;
        try{
            course= courseServiceForEmployee.getCourseForEmployee(employeeId,courseId);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(course);
    }

    @PutMapping("/{employeeId}/{resourceId}/completed")
    public ResponseEntity<?> markCompleted( @PathVariable("employeeId") Integer employeeId, @PathVariable("resourceId")  Long resourceId)
    {
        String message = "";
        try{
           message= resourceLinkCompletionService.markResourceAsCompleted(employeeId,resourceId);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(message);
    }

    @PutMapping("/{employeeId}/{resourceId}/notCompleted")
    public ResponseEntity<?> markNotCompleted(@PathVariable("employeeId")  Integer employeeId,@PathVariable("resourceId") Long resourceId)
    {
        try{
            resourceLinkCompletionService.markResourceAsNotCompleted(employeeId,resourceId);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage()+"\n Cause: "+e.getCause());
        }
        return ResponseEntity.ok("marked as not completed");
    }

    @PostMapping("/feedback/{courseId}")
    public ResponseEntity<?> feedBack(@RequestBody @Valid FeedBackDto feedBackDto,@PathVariable("courseId") Long courseId, BindingResult bindingResult)
    {
        if(bindingResult.hasErrors())
        {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }
        try {
            feedBackService.addFeedback(feedBackDto,courseId);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("error:"+e.getMessage());
        }
        return ResponseEntity.ok("feed back saved successfully");
    }
}
