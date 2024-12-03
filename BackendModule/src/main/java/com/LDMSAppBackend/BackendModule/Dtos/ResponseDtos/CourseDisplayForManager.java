package com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDisplayForManager {
    private Long courseId;

    private String courseName;

    private String keyConcepts;

    private String duration;

    private long totalAssignedEmployees;

    private long numberOfEmployeesCompleted;
}
