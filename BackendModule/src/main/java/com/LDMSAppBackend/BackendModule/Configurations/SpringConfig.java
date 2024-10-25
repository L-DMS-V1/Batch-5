package com.LDMSAppBackend.BackendModule.Configurations;

import com.LDMSAppBackend.BackendModule.services.CustomUserDetailsService;
import com.LDMSAppBackend.BackendModule.services.UserService;
import com.LDMSAppBackend.BackendModule.services.UserServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
public class SpringConfig {

    @Bean(name="user-details-service")
    public UserDetailsService userDetailsService()
    {
        return new CustomUserDetailsService();
    }

    @Bean(name = "user-service-normal")
    public UserService userService()
    {
        return new UserServiceImpl();
    }
}
