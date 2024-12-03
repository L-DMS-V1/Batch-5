package com.LDMSAppBackend.BackendModule.Dtos.RequestDtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseCreationDto {

    private Long Id;

    @NotEmpty(message = "Course name is required")
    private String courseName;

    @NotEmpty(message = "Key concepts are required")
    private String keyConcepts;

    @NotEmpty(message = "Duration is required")
    private String duration;

    @NotNull(message = "At least one resource is required")
    private List<ResourcesDto> resources;

    @NotEmpty(message = "Outcomes are required")
    private String outcomes;

    @NotEmpty(message = "manager user name cannot be empty")
    private String managerName;
}

