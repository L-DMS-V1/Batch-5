package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TrainingRequestResponse {
    private Long id;

    private String courseName;

    private String description;

    private String concepts;

    private String duration;

    private String employeePosition;

    private Integer requiredEmployees;

    private Integer managerId;
}
