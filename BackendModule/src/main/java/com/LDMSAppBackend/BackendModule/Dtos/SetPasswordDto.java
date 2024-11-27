package com.LDMSAppBackend.BackendModule.Dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SetPasswordDto {
    @NotEmpty(message = "please provide password")
    private String password;
}
