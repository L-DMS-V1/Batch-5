package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressDisplayDto {
    private Long assignmentId;

    private String deadline;

    private String employeeName;

    private Long courseId;

    private String courseName;

    private Integer percentage;

    private String lastUpdatedDate;
}
