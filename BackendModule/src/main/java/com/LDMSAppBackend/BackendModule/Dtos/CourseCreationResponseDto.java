package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseCreationResponseDto {
    private CourseCreationDto courseCreationDto;
    private String message;
}
