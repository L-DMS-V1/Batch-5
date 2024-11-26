package com.LDMSAppBackend.BackendModule.controllers;

import com.LDMSAppBackend.BackendModule.Dtos.*;
import com.LDMSAppBackend.BackendModule.enums.Role;
import com.LDMSAppBackend.BackendModule.entites.User;
import com.LDMSAppBackend.BackendModule.repositories.AdminRepository;
import com.LDMSAppBackend.BackendModule.repositories.EmployeeRepository;
import com.LDMSAppBackend.BackendModule.repositories.ManagerRepository;
import com.LDMSAppBackend.BackendModule.security.JwtHelper;
import com.LDMSAppBackend.BackendModule.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")
public class UserController {

    private UserService userService;

    private PasswordEncoder passwordEncoder;

    private JwtHelper jwtHelper;

    private final ManagerRepository managerRepository;

    private final AdminRepository adminRepository;

    private final EmployeeRepository employeeRepository;

    @Autowired
    public UserController(@Qualifier("user-service-normal") UserService userService, PasswordEncoder passwordEncoder, JwtHelper jwtHelper, ManagerRepository managerRepository, AdminRepository adminRepository, EmployeeRepository employeeRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtHelper = jwtHelper;
        this.managerRepository = managerRepository;
        this.adminRepository = adminRepository;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser (@RequestBody @Valid UserRegistrationDto userDto, BindingResult bindingResult) {
        if(bindingResult.hasErrors())
        {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }
        Role role;
        try {
            role = Role.valueOf(userDto.getRole().toUpperCase().trim());
            if(role.equals(Role.EMPLOYEE))
            {
                return ResponseEntity.badRequest().body("employees cannot register directly");
            }
            userService.addUser(userDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role provided: " + userDto.getRole());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginRequestDto loginRequest,BindingResult bindingResult) {
        if(bindingResult.hasErrors())
        {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }
        User user = userService.validateUser(loginRequest.getUserName());
        if(user==null)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
        {
            String token = jwtHelper.generateToken(user);
            Integer id =null;
            if(user.getRole().equalsIgnoreCase("MANAGER"))
            {
                id = managerRepository.findByUser_AccountId(user.getAccountId()).getManagerId();
            } else if (user.getRole().equalsIgnoreCase("ADMIN")) {
                id = adminRepository.findByUser_AccountId(user.getAccountId()).getAdminId();
            } else if (user.getRole().equalsIgnoreCase("EMPLOYEE")) {
                id = employeeRepository.findByUser_AccountId(user.getAccountId()).getEmployeeId();
            }
            else {
                return ResponseEntity.internalServerError().body("please re-login we cannot identify your role");
            }
            UserResponseDto userDto = new UserResponseDto(id, user.getAccountName(),user.getUsername(),user.getEmail(),user.getRole());
            return ResponseEntity.status(HttpStatus.OK).body(new LoginResponse(token,userDto));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Wrong password");
    }

    @PutMapping("/setPassword")
    public ResponseEntity<?> setPassword(@RequestBody @Valid SetPasswordDto passwordDto,BindingResult bindingResult)
    {
        if(bindingResult.hasErrors())
        {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }
        try{
            userService.setPassword(passwordDto.getPassword());
        }
        catch (Exception e)
        {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok("Password reset was successful");
    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<?> deleteAccount()
    {
        try{
            User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            userService.removeUser(user);
        }
        catch (Exception e)
        {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        return ResponseEntity.ok("account deleted successfully");
    }
}
