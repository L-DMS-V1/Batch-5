package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedBackViewDto {
    private Long feedBackId;
    private Integer rating;
    private String comments;
    private String employeeName;
}
