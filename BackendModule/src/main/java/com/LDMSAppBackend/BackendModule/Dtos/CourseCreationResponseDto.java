package com.LDMSAppBackend.BackendModule.Dtos;

import com.LDMSAppBackend.BackendModule.entites.Course;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseCreationResponseDto {
    private Course course;
    private String message;
}
