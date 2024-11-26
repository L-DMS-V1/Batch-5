package com.LDMSAppBackend.BackendModule.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceLinksAndStatus {
    private Long resourceId;
    private String resourceLink;
    private boolean completed;
}
