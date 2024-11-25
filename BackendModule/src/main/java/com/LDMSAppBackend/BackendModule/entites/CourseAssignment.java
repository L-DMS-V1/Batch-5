package com.LDMSAppBackend.BackendModule.entites;

import com.LDMSAppBackend.BackendModule.enums.CourseStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@Entity
public class CourseAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @Column(nullable = false)
    private CourseStatus courseStatus;

    @Column(nullable = false)
    private String deadline;

    @ManyToOne
    @JoinColumn(name = "employeeId", nullable = false)
    @JsonBackReference
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    @JsonBackReference
    private Course course;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "courseAssignment")
    private CourseProgress courseProgress;
}