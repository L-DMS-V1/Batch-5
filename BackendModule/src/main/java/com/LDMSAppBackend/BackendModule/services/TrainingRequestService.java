package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestDto;
import com.LDMSAppBackend.BackendModule.Dtos.TrainingRequestResponse;
import com.LDMSAppBackend.BackendModule.entites.Manager;
import com.LDMSAppBackend.BackendModule.entites.TrainingRequest;
import com.LDMSAppBackend.BackendModule.enums.Status;
import com.LDMSAppBackend.BackendModule.repositories.ManagerRepository;
import com.LDMSAppBackend.BackendModule.repositories.TrainingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TrainingRequestService {
    private TrainingRepository trainingRepository;

    private ManagerRepository managerRepository;

    @Autowired
    public TrainingRequestService(TrainingRepository trainingRepository, ManagerRepository managerRepository) {
        this.trainingRepository = trainingRepository;
        this.managerRepository = managerRepository;
    }

    public void acceptRequest(Long requestId) {
        TrainingRequest trainingRequest = trainingRepository.findByRequestId(requestId);
        if (trainingRequest != null) {
            trainingRequest.setStatus(Status.APPROVED);
            trainingRepository.save(trainingRequest);
        }
        else {
            throw new EntityNotFoundException("No such record is found");
        }
    }

    public void rejectRequest(Long requestId) {
        TrainingRequest trainingRequest = trainingRepository.findByRequestId(requestId);
        if (trainingRequest != null) {
            trainingRequest.setStatus(Status.REJECTED);
            trainingRepository.save(trainingRequest);
        }
        else {
            throw new EntityNotFoundException("No such record is found");
        }
    }
    public List<TrainingRequestResponse> getAllRequests() {
        List<TrainingRequest> trainingRequests = trainingRepository.findAll();
        List<TrainingRequestResponse> trainingRequestResponseList = new ArrayList<>();
        for(TrainingRequest trainingRequest:trainingRequests)
        {
            TrainingRequestResponse trainingRequestDto = new TrainingRequestResponse(trainingRequest.getRequestId(),
                    trainingRequest.getCourseName(),trainingRequest.getDescription(),trainingRequest.getConcepts(),
                    trainingRequest.getDuration(),trainingRequest.getEmployeePosition(),trainingRequest.getRequiredEmployees(),trainingRequest.getManager().getManagerId());
            trainingRequestResponseList.add(trainingRequestDto);
        }
        return trainingRequestResponseList;
    }

    public TrainingRequestResponse requestForm(TrainingRequestDto trainingRequestDTO) throws RuntimeException{
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Manager manager = managerRepository.getByUser_UserName(username);

        TrainingRequest trainingRequest = new TrainingRequest();
        trainingRequest.setCourseName(trainingRequestDTO.getCourseName());
        trainingRequest.setDescription(trainingRequestDTO.getDescription());
        trainingRequest.setConcepts(trainingRequestDTO.getConcepts());
        trainingRequest.setDuration(trainingRequestDTO.getDuration());
        trainingRequest.setEmployeePosition(trainingRequestDTO.getEmployeePosition());
        trainingRequest.setRequiredEmployees(trainingRequestDTO.getRequiredEmployees());
        trainingRequest.setStatus(Status.PENDING);
        trainingRequest.setManager(manager);
        trainingRequest = trainingRepository.save(trainingRequest);
        TrainingRequestResponse trainingRequestResponse = new TrainingRequestResponse(trainingRequest.getRequestId(),trainingRequest.getCourseName(),trainingRequest.getDescription(),trainingRequest.getConcepts(),trainingRequest.getDuration(),trainingRequest.getEmployeePosition(),trainingRequest.getRequiredEmployees(),trainingRequest.getManager().getManagerId());

        return trainingRequestResponse;
    }

    public List<TrainingRequestResponse> getRequestsByManagerName(String requesterName) throws RuntimeException{
        List<TrainingRequest> trainingRequests = trainingRepository.findByManager_User_UserName(requesterName);
        List<TrainingRequestResponse> trainingRequestResponseList = new ArrayList<>();
        for(TrainingRequest trainingRequest:trainingRequests)
        {
            TrainingRequestResponse trainingRequestResponse = new TrainingRequestResponse(trainingRequest.getRequestId(),trainingRequest.getCourseName(),trainingRequest.getDescription(),trainingRequest.getConcepts(),trainingRequest.getDuration(),trainingRequest.getEmployeePosition(),trainingRequest.getRequiredEmployees(),trainingRequest.getManager().getManagerId());
            trainingRequestResponseList.add(trainingRequestResponse);
        }
        return trainingRequestResponseList;
    }

    public TrainingRequestResponse getRequestByRequestId(Long requestId) throws IllegalArgumentException{
        TrainingRequest trainingRequest = trainingRepository.findByRequestId(requestId);
        if(trainingRequest==null)
        {
            throw new IllegalArgumentException();
        }
        TrainingRequestResponse trainingRequestResponse = new TrainingRequestResponse(trainingRequest.getRequestId(),trainingRequest.getCourseName(),trainingRequest.getDescription(),trainingRequest.getConcepts(),trainingRequest.getDuration(),trainingRequest.getEmployeePosition(),trainingRequest.getRequiredEmployees(),trainingRequest.getManager().getManagerId());
        return trainingRequestResponse;
    }
}
