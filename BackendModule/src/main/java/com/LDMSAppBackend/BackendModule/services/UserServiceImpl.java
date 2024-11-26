package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.EmployeeRegistrationDto;
import com.LDMSAppBackend.BackendModule.Dtos.PositionsDto;
import com.LDMSAppBackend.BackendModule.Dtos.UserRegistrationDto;
import com.LDMSAppBackend.BackendModule.entites.Admin;
import com.LDMSAppBackend.BackendModule.entites.Employee;
import com.LDMSAppBackend.BackendModule.entites.Manager;
import com.LDMSAppBackend.BackendModule.entites.User;
import com.LDMSAppBackend.BackendModule.repositories.AdminRepository;
import com.LDMSAppBackend.BackendModule.repositories.EmployeeRepository;
import com.LDMSAppBackend.BackendModule.repositories.ManagerRepository;
import com.LDMSAppBackend.BackendModule.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User validateUser(String username) {
        return userRepository.findByUserName(username);
    }

    @Override
    @Transactional
    public User addUser(UserRegistrationDto userRegistrationDto) throws Exception {
        if(userRepository.existsByUserName(userRegistrationDto.getUserName()))
        {
            throw new Exception("User already exists");
        }

        User user = new User();
        user.setUserName(userRegistrationDto.getUserName());
        user.setRole(userRegistrationDto.getRole().toUpperCase());
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setAccountName(userRegistrationDto.getAccountName());
        user.setEmail(userRegistrationDto.getEmail());
        user = userRepository.save(user);

        if(userRegistrationDto.getRole().equalsIgnoreCase("admin"))
        {
            Admin admin = new Admin();
            admin.setUser(user);
            adminRepository.save(admin);
        }
        else if(user.getRole().equalsIgnoreCase("manager"))
        {
            Manager manager = new Manager();
            manager.setUser(user);
            managerRepository.save(manager);
        }
        return user;
    }

    @Override
    public void removeUser(User user) {
        userRepository.delete(user);
    }

    @Override
    public User updateUser(User user) {
        return null;
    }

    @Transactional
    public void addEmployee(EmployeeRegistrationDto employeeRegistrationDto)
    {
        User user = new User();

        // Set user properties based on the employee registration data
        user.setAccountName(employeeRegistrationDto.getAccountName());
        user.setUserName(employeeRegistrationDto.getUserName());
        user.setPassword(employeeRegistrationDto.getPassword());
        user.setEmail(employeeRegistrationDto.getEmail());
        user.setRole(employeeRegistrationDto.getRole());
        userRepository.save(user);
        //creating employee
        Employee employee = new Employee();
        employee.setPosition(employeeRegistrationDto.getPosition());
        employee.setContact(employeeRegistrationDto.getContact());
        employee.setUser(user);
        employeeRepository.save(employee);
    }

    @Override
    public void setPassword(String password)
    {
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Override
    public PositionsDto getAllPositions() {
        return new PositionsDto(employeeRepository.findDistinctPosition());
    }
}
