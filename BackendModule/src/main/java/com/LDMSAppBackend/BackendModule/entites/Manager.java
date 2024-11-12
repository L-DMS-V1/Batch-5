package com.LDMSAppBackend.BackendModule.entites;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="manager")
@Data
public class Manager{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer managerId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="user_account_Id",referencedColumnName = "accountId")
    private User user;
}
