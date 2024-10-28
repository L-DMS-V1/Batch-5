package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "request_form")
public class CourseRequestForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;

    @Column(name="course_name",nullable = false)
    private String courseName;


    private String description;

    private Integer duration;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mangerId")
    private Manager manager;

}