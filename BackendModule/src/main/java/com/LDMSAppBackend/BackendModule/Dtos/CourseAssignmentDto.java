package com.LDMSAppBackend.BackendModule.Dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CourseAssignmentDto {
    @NotNull(message = "course Id cannot be empty")
    private Long courseId;

    @NotEmpty(message = "deadline cannot be empty")
    private String deadline;
    @NotEmpty(message = "at least one employee is required")
    private List<Integer> employeeIds;
}
