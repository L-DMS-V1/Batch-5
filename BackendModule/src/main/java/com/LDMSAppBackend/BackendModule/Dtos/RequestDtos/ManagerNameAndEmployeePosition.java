package com.LDMSAppBackend.BackendModule.Dtos.RequestDtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManagerNameAndEmployeePosition {
    @NotEmpty(message = "manager name is required")
    private String managerName;
    @NotEmpty(message = "position is required")
    private String position;
}
