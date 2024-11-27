package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerRepository extends JpaRepository<Manager,Integer> {
    Manager getByUser_UserName(String username);

    Manager findByUser_AccountId(Integer user);

    Manager findByUser_UserName(String username);
}
