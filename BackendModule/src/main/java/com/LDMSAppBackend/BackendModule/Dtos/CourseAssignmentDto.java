package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.Data;

import java.util.List;

@Data
public class CourseAssignmentDto {
    private Long courseId;
    private String deadline;
    private List<Integer> employeeIds;
}
