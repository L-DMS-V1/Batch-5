package com.LDMSAppBackend.BackendModule.Dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourcesDto {

    @NotEmpty(message = "Resource links are required")
    private String resourceLinks;

    @NotEmpty(message = "Resource names are required")
    private String resourceNames;
}
