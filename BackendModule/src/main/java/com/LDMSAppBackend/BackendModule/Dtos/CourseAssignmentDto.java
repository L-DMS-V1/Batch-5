package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.Data;

import java.util.List;

@Data
public class CourseAssignmentDto {
    private Integer courseId;
    private String status;
    private String deadline;
    private List<Integer> employeeIds;
}
