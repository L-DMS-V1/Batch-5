package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="employee")
public @Data class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employeeId;

    @Column(name="user_name",nullable = false, unique = true,length = 50)
    private String userName;

    @Column(name="password",nullable = false)
    private String password;

    @Column(name="email_id",nullable = false,unique = true)
    private String email;

    @Column(name = "role")
    private String role;

    @Column(name="position")
    private String position;

    @Column(name="contact",length=10)
    private String contact;
}
