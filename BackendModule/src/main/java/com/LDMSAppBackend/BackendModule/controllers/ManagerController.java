package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestDto;
import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestResponse;
import com.LDMSAppBackend.BackendModule.entites.TrainingRequest;
import com.LDMSAppBackend.BackendModule.services.TrainingRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    TrainingRequestService trainingRequestService;

    @Autowired
    public ManagerController(TrainingRequestService trainingRequestService) {
        this.trainingRequestService = trainingRequestService;
    }

    @PostMapping("/createCourseRequest")
    public ResponseEntity<?> createRequest(@RequestBody TrainingRequestDto trainingRequestDTO) {
        TrainingRequest trainingRequest;
        try{
            trainingRequest = trainingRequestService.requestForm(trainingRequestDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return new ResponseEntity<>(trainingRequestDTO,HttpStatus.OK);
    }

    @GetMapping("/getCourseRequests")
    public ResponseEntity<?> getRequests()
    {
        List<TrainingRequestDto> trainingRequestDtos;
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
                trainingRequestDtos = trainingRequestService.getRequestsByManagerName(username);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.ok(trainingRequestDtos);
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
}
