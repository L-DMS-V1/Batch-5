package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="employee")
public @Data class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employeeId;

    @OneToOne
    @JoinColumn(name="userName")
    private User user;

    @Column(name="position")
    private String position;

    @Column(name="contact",length=10)
    private String contact;
}
