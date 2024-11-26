package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "course feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedBackId;

    @Column
    private Integer rating;

    @Column
    private String comment;

    @Column(name = "employee name")
    private String employeeName;

    @ManyToOne
    @JoinColumn(referencedColumnName = "courseId",name = "courseId")
    private Course course;
}
