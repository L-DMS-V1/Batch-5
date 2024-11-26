package com.LDMSAppBackend.BackendModule.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.text.SimpleDateFormat;
import java.util.Date;

@Data
@NoArgsConstructor
@Entity
@Table(name = "course_progress") // Changed to use underscore
public class CourseProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int progressId;

    @JsonBackReference
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(referencedColumnName = "assignmentId")
    private CourseAssignment courseAssignment;

    @Column(name = "percentage")
    private Integer percentage = 0;

    @Column(name = "last_updated_date")
    private String lastUpdatedDate;

    @PrePersist
    protected void onCreate() {
        lastUpdatedDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
    }
}