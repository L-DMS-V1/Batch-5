package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.Manager;
import com.LDMSAppBackend.BackendModule.entites.TrainingRequest;
import com.LDMSAppBackend.BackendModule.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingRepository extends JpaRepository<TrainingRequest, Long>{
    List<TrainingRequest> findByManager_User_UserName(String username);
    TrainingRequest findByRequestId(Long requestId);
    List<TrainingRequest> findByStatus(Status status);

    List<TrainingRequest> findByManagerAndStatus(Manager manager, Status status);
}