package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Table(name="manager")
@Data
public class Manager{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int managerId;

    @OneToOne
    @JoinColumn(name="userName")
    private User user;

    @OneToMany(mappedBy = "manager",fetch = FetchType.LAZY)
    private Set<CourseRequestForm> courseRequestFormSet;
}
