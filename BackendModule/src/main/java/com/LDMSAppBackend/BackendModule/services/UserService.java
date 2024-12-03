package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.ManagerNames;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.PositionsDto;
import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.UserRegistrationDto;
import com.LDMSAppBackend.BackendModule.entites.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    User validateUser(String username);
    void addUser(UserRegistrationDto user) throws Exception;
    void removeUser(User user);
    void setPassword(String password);
    PositionsDto getAllPositionsOfEmployeesUnderManager();
    ManagerNames getManagerNames();
}
