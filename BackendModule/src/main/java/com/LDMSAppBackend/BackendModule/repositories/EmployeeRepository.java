package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {
    Employee findByUser_UserName(String username);

    Employee findByUser_AccountId(Integer accountId);

    @Query("SELECT DISTINCT e.position FROM Employee e JOIN e.manager m JOIN m.user u WHERE u.userName = :username")
    List<String> findDistinctPositionsByManagerUsername(String username);

    @Query("SELECT e FROM Employee e JOIN e.manager m JOIN m.user u WHERE u.userName = :username AND e.position = :position")
    List<Employee> findByManagerNameAndEmployeePosition(String username, String position);
}
