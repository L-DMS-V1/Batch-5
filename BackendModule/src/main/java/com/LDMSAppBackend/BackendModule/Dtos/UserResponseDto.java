package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserResponseDto {
    private Integer accountId;
    private String accountName;
    private String userName;
    private String email;
    private String role;
}
