package com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseAssignedToEmployee {
    private Long courseId;

    private String courseName;

    private String keyConcepts;

    private String duration;

    private String outcomes;

    private String deadLine;

    private List<ResourceLinksAndStatus> resourceLinksAndStatuses;

    private Long assignmentId;
}
