package com.LDMSAppBackend.BackendModule.controllers;



import com.LDMSAppBackend.BackendModule.Dtos.UserLoginRequestDto;
import com.LDMSAppBackend.BackendModule.entites.Employee;
import com.LDMSAppBackend.BackendModule.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
