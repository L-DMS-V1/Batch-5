package com.LDMSAppBackend.BackendModule.Dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseDto {
    @NotBlank(message = "Course name is required")
    private String courseName;

    @NotBlank(message = "Key concepts are required")
    private String keyConcepts;

    @NotBlank(message = "Duration is required")
    private String duration;

    @NotBlank(message = "Resource links are required")
    private String resourceLinks;

    private String otherLinks;

    @NotBlank(message = "Outcomes are required")
    private String outcomes;
}
