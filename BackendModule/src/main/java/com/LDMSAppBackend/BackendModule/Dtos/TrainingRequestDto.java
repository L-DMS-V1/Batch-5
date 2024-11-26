package com.LDMSAppBackend.BackendModule.Dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingRequestDto {
    @NotEmpty(message = "course name cannot be empty")
    private String courseName;

    @NotEmpty(message = "description cannot be empty")
    private String description;

    @NotEmpty(message = "concepts cannot be empty")
    private String concepts;

    @NotEmpty(message = "duration cannot be empty")
    private String duration;

    @NotEmpty(message = "employeePosition cannot be empty")
    private String employeePosition;

    @NotEmpty(message = "requiredEmployees cannot be empty")
    private int requiredEmployees;
}
