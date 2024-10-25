package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.entites.User;
import com.LDMSAppBackend.BackendModule.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public User validateUser(String username) {
        return userRepository.findByUserName(username);
    }

    @Override
    public User addUser(User user) throws Exception {
        if(userRepository.existsByUserName(user.getUsername()))
        {
            throw new Exception("User already exists");
        }
        return userRepository.save(user);
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
