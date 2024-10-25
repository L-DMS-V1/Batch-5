package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Table(name="manager")
@Data
public class Manager{
    @Id
    @SequenceGenerator(name = "manager_seq",sequenceName = "sql_sequence")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "manager_seq")
    private int managerId;

    @Column(name="user_name",nullable = false, unique = true,length = 50)
    private String userName;

    @Column(name="password",nullable = false)
    private String password;

    @Column(name="email_id",nullable = false,unique = true)
    private String email;

    //need to clarify these both fields
    private String accountId;

    private String accountName;

//    1manager -> multiple requests , so oneToMany courseReqelkmdlkenf
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "manager")
    private Set<CourseRequestForm> courseRequestFormSet;


}
