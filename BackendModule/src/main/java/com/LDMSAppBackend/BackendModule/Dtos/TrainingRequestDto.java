package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingRequestDto {
    private String courseName;

    private String description;

    private String concepts;

    private String duration;

    private String employeePosition;

    private int requiredEmployees;
}
