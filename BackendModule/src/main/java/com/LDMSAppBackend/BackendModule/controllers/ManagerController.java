package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestDto;
import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestResponse;
import com.LDMSAppBackend.BackendModule.enums.Status;
import com.LDMSAppBackend.BackendModule.services.TrainingRequestService;
import com.LDMSAppBackend.BackendModule.services.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final TrainingRequestService trainingRequestService;
    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(ManagerController.class);

    @Autowired
    public ManagerController(TrainingRequestService trainingRequestService,@Qualifier("user-service-normal") UserService userService) {
        this.trainingRequestService = trainingRequestService;
        this.userService = userService;
    }

    @PostMapping("/createCourseRequest")
    public ResponseEntity<?> createRequest(@RequestBody @Valid TrainingRequestDto trainingRequestDTO, BindingResult bindingResult) {
        // Handle validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
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

    @GetMapping("/getCourseRequest/{requestId}")
    public ResponseEntity<?> getRequest(@PathVariable("requestId") Long requestId) {
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
    public ResponseEntity<?> getPositions() {
        try {
            var positions = userService.getAllPositions();
            log.info("Fetched positions: {}", positions);
            return ResponseEntity.ok(positions);
        } catch (Exception e) {
            log.error("Error fetching positions", e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/requests/{status}")
    public ResponseEntity<?> getPendingRequests(@PathVariable("status") String status)
    {
        List<TrainingRequestResponse> trainingRequestResponses;
        Status reqStatus;
        try{
            reqStatus = Status.valueOf(status.toUpperCase().trim());
            trainingRequestResponses = trainingRequestService.getRequestsByManagerAndStatus(reqStatus);
        }
        catch(IllegalArgumentException e)
        {
            return ResponseEntity.badRequest().body("please check the manager Id ");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok(trainingRequestResponses);
    }
}
