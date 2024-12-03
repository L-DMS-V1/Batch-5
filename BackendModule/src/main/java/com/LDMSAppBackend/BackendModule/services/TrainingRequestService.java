package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.ManagerNameAndEmployeePosition;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.EmployeeInfoForAdmin;
import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.TrainingRequestDto;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.TrainingRequestResponse;
import com.LDMSAppBackend.BackendModule.entites.Employee;
import com.LDMSAppBackend.BackendModule.entites.Manager;
import com.LDMSAppBackend.BackendModule.entites.TrainingRequest;
import com.LDMSAppBackend.BackendModule.enums.Status;
import com.LDMSAppBackend.BackendModule.repositories.EmployeeRepository;
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
    private final TrainingRepository trainingRepository;

    private final ManagerRepository managerRepository;

    private final EmployeeRepository employeeRepository;

    @Autowired
    public TrainingRequestService(TrainingRepository trainingRepository, ManagerRepository managerRepository, EmployeeRepository employeeRepository) {
        this.trainingRepository = trainingRepository;
        this.managerRepository = managerRepository;
        this.employeeRepository = employeeRepository;
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
            trainingRequestResponseList.add(mapTrainingToResponse(trainingRequest));
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

        return mapTrainingToResponse(trainingRequest);
    }

    public List<TrainingRequestResponse> getRequestsByManagerName(String requesterName) throws RuntimeException{
        List<TrainingRequest> trainingRequests = trainingRepository.findByManager_User_UserName(requesterName);
        List<TrainingRequestResponse> trainingRequestResponseList = new ArrayList<>();
        for(TrainingRequest trainingRequest:trainingRequests)
        {
            trainingRequestResponseList.add(mapTrainingToResponse(trainingRequest));
        }
        return trainingRequestResponseList;
    }

    public TrainingRequestResponse getRequestByRequestId(Long requestId) throws IllegalArgumentException{
        TrainingRequest trainingRequest = trainingRepository.findByRequestId(requestId);
        if(trainingRequest==null)
        {
            throw new IllegalArgumentException();
        }
        return mapTrainingToResponse(trainingRequest);
    }

    public List<TrainingRequestResponse> getAllPendingRequests()
    {
        List<TrainingRequest> trainingRequests = trainingRepository.findByStatus(Status.PENDING);
        List<TrainingRequestResponse> trainingRequestResponses = new ArrayList<>();
        for(TrainingRequest trainingRequest : trainingRequests)
        {
            trainingRequestResponses.add(
                    mapTrainingToResponse(trainingRequest)
            );
        }
        return trainingRequestResponses;
    }

    public List<EmployeeInfoForAdmin> getEmployeesByPositionAndManagerName(ManagerNameAndEmployeePosition managerNameAndEmployeePosition)
    {
        List<Employee> employees = employeeRepository.findByManagerNameAndEmployeePosition(managerNameAndEmployeePosition.getManagerName(),managerNameAndEmployeePosition.getPosition());
        List<EmployeeInfoForAdmin> employeeInfoForAdminList = new ArrayList<>();
        for(Employee employee:employees)
        {
            employeeInfoForAdminList.add(new EmployeeInfoForAdmin(employee.getEmployeeId(),employee.getUser().getUsername(),employee.getPosition()));
        }
        return employeeInfoForAdminList;
    }

    public List<TrainingRequestResponse> getRequestsByManagerAndStatus(Status status)
    {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Manager manager = managerRepository.findByUser_UserName(username);
        if(manager == null)
        {
            throw new RuntimeException("we cannot retrieve your information please re login and be sure that you are a manager");
        }
        List<TrainingRequest> trainingRequests = trainingRepository.findByManagerAndStatus(manager,status);
        List<TrainingRequestResponse> trainingRequestResponses = new ArrayList<>();
        for(TrainingRequest trainingRequest:trainingRequests)
        {
            trainingRequestResponses.add(mapTrainingToResponse(trainingRequest));
        }
        return trainingRequestResponses;
    }

    private TrainingRequestResponse mapTrainingToResponse(TrainingRequest trainingRequest)
    {

        return new TrainingRequestResponse(trainingRequest.getRequestId(),trainingRequest.getCourseName(),trainingRequest.getDescription(),trainingRequest.getConcepts(),trainingRequest.getDuration(),trainingRequest.getEmployeePosition(),trainingRequest.getRequiredEmployees(),trainingRequest.getManager().getUser().getUsername(),trainingRequest.getStatus());
    }
}
