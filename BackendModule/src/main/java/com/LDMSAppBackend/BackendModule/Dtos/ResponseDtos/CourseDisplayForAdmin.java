package com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDisplayForAdmin {
    private Long courseId;

    private String courseName;

    private String keyConcepts;

    private String duration;
}
