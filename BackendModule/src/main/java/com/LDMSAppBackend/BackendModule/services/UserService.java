package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.UserRegistrationDto;
import com.LDMSAppBackend.BackendModule.entites.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {

    User validateUser(String username);
    User addUser(UserRegistrationDto user) throws Exception;
    User removeUser(User user);
    User updateUser(User user);
}
