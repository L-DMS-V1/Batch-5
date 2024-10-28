package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.UserLoginRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminTest()
    {
        return ResponseEntity.ok("in admin");
    }
}


