package com.LDMSAppBackend.BackendModule.Dtos.RequestDtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRegistrationDto {
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

    @NotEmpty(message = "position cannot be empty")
    private String position;

    @NotEmpty(message = "contact cannot be empty")
    private String contact;

    @NotEmpty(message = "manager must be specified")
    private String managerName;
}
