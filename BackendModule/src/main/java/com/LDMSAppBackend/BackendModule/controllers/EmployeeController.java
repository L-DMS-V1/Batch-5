package com.LDMSAppBackend.BackendModule.controllers;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @GetMapping("/info")
    public ResponseEntity<?> getEmployeeTest()
    {
        return ResponseEntity.ok("in employee");
    }
}
