package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "request_form")
public class CourseRequestForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="course_name",nullable = false)
    private String courseName;

    @Column(name="description")
    private String description;
    private Integer duration;

    @JoinColumn(name = "manager_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Manager manager;

}