package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.Manager;
import com.LDMSAppBackend.BackendModule.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ManagerRepository extends JpaRepository<Manager,Integer> {
    Manager getByUser_UserName(String username);

    Manager findByUser_AccountId(Integer user);

    Manager findByUser_UserName(String username);

    Manager findByUser(User user);

    @Query("SELECT u.userName FROM Manager m JOIN m.user u")
    List<String> findUserNames();
}
