package com.LDMSAppBackend.BackendModule.Dtos;


import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public  class UserRegistrationDto {
    @NotEmpty(message = "account name cannot be empty")
    private String accountName;

    @NotEmpty(message = "user name cannot be empty")
    private String userName;

    @NotEmpty(message = "password cannot be empty")
    private String password;

    @NotEmpty(message = "email cannot be empty")
    private String email;

    @NotEmpty(message = "role cannot be empty")
    private String role;
}
