package com.LDMSAppBackend.BackendModule.Dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedBackDto {
    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank(message = "Comment cannot be empty")
    private String comment;
}
