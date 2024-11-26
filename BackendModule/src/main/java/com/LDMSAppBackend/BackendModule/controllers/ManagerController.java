package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestDto;
import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestResponse;
import com.LDMSAppBackend.BackendModule.services.TrainingRequestService;
import com.LDMSAppBackend.BackendModule.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final TrainingRequestService trainingRequestService;
    private final UserService userService;

    @Autowired
    public ManagerController(TrainingRequestService trainingRequestService,@Qualifier("user-service-normal") UserService userService) {
        this.trainingRequestService = trainingRequestService;
        this.userService = userService;
    }

    @PostMapping("/createCourseRequest")
    public ResponseEntity<?> createRequest(@RequestBody @Valid TrainingRequestDto trainingRequestDTO, BindingResult bindingResult) {
        if(bindingResult.hasErrors())
        {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }
        TrainingRequestResponse trainingRequestResponse;
        try{
            trainingRequestResponse = trainingRequestService.requestForm(trainingRequestDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return new ResponseEntity<>(trainingRequestResponse,HttpStatus.OK);
    }

    @GetMapping("/getCourseRequests")
    public ResponseEntity<?> getRequests()
    {
        List<TrainingRequestResponse> trainingRequestResponseList;
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
                trainingRequestResponseList = trainingRequestService.getRequestsByManagerName(username);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.ok(trainingRequestResponseList);
    }

    @GetMapping("/getCourseRequest/{id}")
    public ResponseEntity<?> getRequest(@PathVariable("id") Long requestId) {
        TrainingRequestResponse trainingRequestResponse;
        try{
        trainingRequestResponse = trainingRequestService.getRequestByRequestId(requestId);
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No request found with id: "+requestId);
        }
        return ResponseEntity.ok(trainingRequestResponse);
    }

    @GetMapping("/getAllPositions")
    public ResponseEntity<?> getPositions()
    {
        return ResponseEntity.ok(userService.getAllPositions());
    }
}
