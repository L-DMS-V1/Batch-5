package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserResponseDto {
    private Integer id;
    private String accountName;
    private String userName;
    private String email;
    private String role;
}
