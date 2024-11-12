package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails userdetails=userRepository.findByUserName(username);
        if(userdetails == null)
        {
            throw new UsernameNotFoundException("No user found");
        }
        return userdetails;
    }
}
