package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.TrainingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingRepository extends JpaRepository<TrainingRequest, Long>{
    List<TrainingRequest> findByManager_User_UserName(String username);
    TrainingRequest findByRequestId(Long requestId);
}
