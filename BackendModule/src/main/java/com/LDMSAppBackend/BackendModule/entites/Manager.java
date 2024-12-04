package com.LDMSAppBackend.BackendModule.entites;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name="manager")
@Data
public class Manager{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer managerId;

    @JsonBackReference
    @OneToOne
    @JoinColumn(name="user_account_Id",referencedColumnName = "accountId")
    private User user;

    @JsonBackReference
    @OneToMany(mappedBy = "manager")
    private List<Course> courses;
}
