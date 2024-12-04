package com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeInfoForAdmin {
    Integer employeeId;
    String userName;
    String position;
}
