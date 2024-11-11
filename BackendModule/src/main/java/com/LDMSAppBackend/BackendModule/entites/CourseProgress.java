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
public class CourseProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int progressId;

    @Column(nullable = false)
    private String lastAccessedDate = new Date().toString();

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "assignmentId", referencedColumnName = "assignmentId", nullable = false)
    @JsonBackReference
    private CourseAssignment courseAssignment;

    private int percentage;
    public void setLastAccessedDate() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        this.lastAccessedDate = formatter.format(new Date());
    }
}