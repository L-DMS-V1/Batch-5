package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.LoginResponse;
import com.LDMSAppBackend.BackendModule.Dtos.UserLoginRequestDto;
import com.LDMSAppBackend.BackendModule.Dtos.UserRegistrationDto;
import com.LDMSAppBackend.BackendModule.Dtos.UserResponseDto;
import com.LDMSAppBackend.BackendModule.enums.Role;
import com.LDMSAppBackend.BackendModule.entites.User;
import com.LDMSAppBackend.BackendModule.security.JwtHelper;
import com.LDMSAppBackend.BackendModule.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")
public class UserController {

    private UserService userService;

    private PasswordEncoder passwordEncoder;

    private JwtHelper jwtHelper;

    @Autowired
    public UserController(@Qualifier("user-service-normal") UserService userService, PasswordEncoder passwordEncoder, JwtHelper jwtHelper) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtHelper = jwtHelper;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser (@RequestBody UserRegistrationDto userDto) {
        Role role;
        try {
            Role.valueOf(userDto.getRole().toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role provided: " + userDto.getRole());
        }

        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        try {
            userService.addUser(userDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDto loginRequest) {
        User user = userService.validateUser(loginRequest.getUserName());
        if(user==null)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
        {
            String token = jwtHelper.generateToken(user);
            UserResponseDto userDto = new UserResponseDto(user.getAccountId(), user.getAccountName(),user.getUsername(),user.getEmail(),user.getRole());
            return ResponseEntity.status(HttpStatus.OK).body(new LoginResponse(token,userDto));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Wrong password");
    }
}
