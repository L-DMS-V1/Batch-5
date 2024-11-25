package com.LDMSAppBackend.BackendModule.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resources {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resourceId;

    @Column
    private String resourceName;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "course_id", referencedColumnName = "courseId",nullable = false)
    private Course course;

    @Column(name = "link")
    private String resourceLink;
}
