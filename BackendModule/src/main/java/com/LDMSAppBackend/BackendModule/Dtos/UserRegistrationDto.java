package com.LDMSAppBackend.BackendModule.Dtos;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@NoArgsConstructor
@AllArgsConstructor
@Data
public  class UserRegistrationDto {
    @Id
    @NonNull
    private Integer accountId;

    @NonNull
    private String accountName;

    @NonNull
    private String userName;

    @NonNull
    private String password;

    @NonNull
    private String email;

    @NonNull
    private String role;
}
