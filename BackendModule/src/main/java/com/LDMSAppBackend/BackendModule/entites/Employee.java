package com.LDMSAppBackend.BackendModule.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="employee")
public @Data class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer employeeId;

    @JsonBackReference
    @OneToOne
    @JoinColumn(name="user_account_Id",referencedColumnName = "accountId")
    private User user;

    @Column(name="position")
    private String position;

    @Column(name="contact",length=10)
    private String contact;

}
