package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {
    Employee findByUser_UserName(String username);

    Employee findByUser_AccountId(Integer accountId);

    List<Employee> findByPosition(String position);

    @Query("SELECT DISTINCT e.position FROM Employee e")
    List<String> findDistinctPosition();
}
