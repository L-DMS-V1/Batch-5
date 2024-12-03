package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.EmployeeRegistrationDto;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.ManagerNames;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.PositionsDto;
import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.UserRegistrationDto;
import com.LDMSAppBackend.BackendModule.entites.Admin;
import com.LDMSAppBackend.BackendModule.entites.Employee;
import com.LDMSAppBackend.BackendModule.entites.Manager;
import com.LDMSAppBackend.BackendModule.entites.User;
import com.LDMSAppBackend.BackendModule.exceptions.DuplicateUserException;
import com.LDMSAppBackend.BackendModule.repositories.AdminRepository;
import com.LDMSAppBackend.BackendModule.repositories.EmployeeRepository;
import com.LDMSAppBackend.BackendModule.repositories.ManagerRepository;
import com.LDMSAppBackend.BackendModule.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
    public void addUser(UserRegistrationDto userRegistrationDto) throws DuplicateUserException, DataIntegrityViolationException {
        if(userRepository.existsByUserName(userRegistrationDto.getUserName()))
        {
            if(userRegistrationDto.getRole().equalsIgnoreCase("manager"))
            {
                throw new DuplicateUserException("User already exists");
            }
            else
            {
                throw new DuplicateUserException("Manager with same credentials already exists");
            }
        }

        User user = new User();
        user.setUserName(userRegistrationDto.getUserName());
        user.setRole(userRegistrationDto.getRole().toUpperCase());
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setAccountName(userRegistrationDto.getAccountName());
        user.setEmail(userRegistrationDto.getEmail());
        try{
            user = userRepository.save(user);
        }
        catch (DataIntegrityViolationException e)
        {
            throw new DataIntegrityViolationException("user with same email already exists");
        }
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
    }

    @Override
    public void removeUser(User user) {
        userRepository.delete(user);
    }

    @Transactional
    public void addEmployee(EmployeeRegistrationDto employeeRegistrationDto) throws DuplicateUserException
    {
        User user = new User();

        // Set user properties based on the employee registration data
        user.setAccountName(employeeRegistrationDto.getAccountName());
        user.setUserName(employeeRegistrationDto.getUserName());
        user.setPassword(employeeRegistrationDto.getPassword());
        user.setEmail(employeeRegistrationDto.getEmail());
        user.setRole(employeeRegistrationDto.getRole());
        try{
        userRepository.save(user);
        } catch (Exception e) {
            throw new DuplicateUserException("Employee with same user details already exists");
        }
        //creating employee
        Employee employee = new Employee();
        employee.setPosition(employeeRegistrationDto.getPosition());
        employee.setContact(employeeRegistrationDto.getContact());
        employee.setManager(managerRepository.getByUser_UserName(employeeRegistrationDto.getManagerName()));
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
    public PositionsDto getAllPositionsOfEmployeesUnderManager() {
        String managerName = SecurityContextHolder.getContext().getAuthentication().getName();
        return new PositionsDto(employeeRepository.findDistinctPositionsByManagerUsername(managerName));
    }

    @Override
    public ManagerNames getManagerNames() {
        return new ManagerNames(managerRepository.findUserNames());
    }
}
