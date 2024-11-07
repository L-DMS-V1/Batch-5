package com.LDMSAppBackend.BackendModule.Dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginRequestDto {
    @NotEmpty(message = "username cannot be empty")
    private String userName;

    @NotEmpty(message = "username cannot be empty")
    private String password;
}
