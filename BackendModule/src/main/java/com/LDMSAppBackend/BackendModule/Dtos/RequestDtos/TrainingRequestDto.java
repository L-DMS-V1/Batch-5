package com.LDMSAppBackend.BackendModule.Dtos.RequestDtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "required employees cannot be empty")
    @Min(1)
    private int requiredEmployees;
}
