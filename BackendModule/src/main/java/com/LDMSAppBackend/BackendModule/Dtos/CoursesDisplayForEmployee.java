package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoursesDisplayForEmployee {
    private Long courseId;

    private String courseName;

    private String duration;

    private String deadLine;
}
