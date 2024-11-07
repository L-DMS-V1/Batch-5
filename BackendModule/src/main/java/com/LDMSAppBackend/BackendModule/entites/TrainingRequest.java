package com.LDMSAppBackend.BackendModule.entites;

import com.LDMSAppBackend.BackendModule.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "training_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @Column(name = "course_Name")
    private String courseName;

    @Column(name = "description")
    private String description;

    @Column(name = "concepts")
    private String concepts;

    @Column(name = "duration")
    private String duration;

    @Column(name = "employee_Position")
    private String employeePosition;

    @Column(name = "required_Employees")
    private Integer requiredEmployees;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="manager_id",referencedColumnName = "managerId")
    private Manager manager;
}
