package com.LDMSAppBackend.BackendModule.services;

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
        user.setPassword(userRegistrationDto.getPassword());
        user.setAccountName(userRegistrationDto.getAccountName());
        user.setEmail(userRegistrationDto.getEmail());

        if(userRegistrationDto.getRole().equalsIgnoreCase("admin"))
        {
            Admin admin = new Admin();
            admin.setUser (user);
            adminRepository.save(admin);
        }
        else if(user.getRole().equalsIgnoreCase("manager"))
        {
            Manager manager = new Manager();
            manager.setUser (user);
            managerRepository.save(manager);
        }
        else if(user.getRole().equalsIgnoreCase("employee"))
        {
            Employee employee = new Employee();
            employee.setUser (user);
            employeeRepository.save(employee);
        }
        return user;
    }

    @Override
    public User removeUser(User user) {
        return null;
    }

    @Override
    public User updateUser(User user) {
        return null;
    }
}
