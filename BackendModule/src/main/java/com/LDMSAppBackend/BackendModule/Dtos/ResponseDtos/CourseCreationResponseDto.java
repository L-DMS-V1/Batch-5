package com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos;

import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.CourseCreationDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseCreationResponseDto {
    private CourseCreationDto courseCreationDto;
    private String message;
}
