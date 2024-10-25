package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.Data;

// Entity ->  adminEntity

@Entity
@Table(name="admin")
@Data
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="user_name",nullable = false,unique = true,length = 50)
    private String userName;

    @Column(name = "password",nullable = false)
    private String password;

    @Column(name="email_id",nullable = false,unique = true)
    private String email;

    //need to assign to role using enum
    private String role;
}
