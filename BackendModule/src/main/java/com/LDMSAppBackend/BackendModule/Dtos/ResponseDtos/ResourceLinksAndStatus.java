package com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceLinksAndStatus {
    private Long resourceId;
    private String resourceName;
    private String resourceLink;
    private boolean completed;
}
