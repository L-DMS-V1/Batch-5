package com.LDMSAppBackend.BackendModule.services;


import com.LDMSAppBackend.BackendModule.Dtos.ResourceLinksAndStatus;
import com.LDMSAppBackend.BackendModule.entites.Employee;
import com.LDMSAppBackend.BackendModule.entites.ResourceLinkCompletion;
import com.LDMSAppBackend.BackendModule.entites.Resources;
import com.LDMSAppBackend.BackendModule.repositories.ResourceLinkCompletionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceLinkCompletionService {

    private final ResourceLinkCompletionRepository resourceLinkCompletionRepository;
    private final CourseProgressService courseProgressService;

    @Autowired
    public ResourceLinkCompletionService(ResourceLinkCompletionRepository resourceLinkCompletionRepository, CourseProgressService courseProgressService) {
        this.resourceLinkCompletionRepository = resourceLinkCompletionRepository;
        this.courseProgressService = courseProgressService;
    }

    @Transactional
    public String markResourceAsCompleted(Integer employeeId, Long resourceId) {
        ResourceLinkCompletion resourceLinkCompletion = resourceLinkCompletionRepository
                .findByEmployeeAndResource(employeeId, resourceId)
                .orElseThrow(() -> new RuntimeException("ResourceLinkCompletion entry not found."));

        // Update completion status
        resourceLinkCompletion.setCompleted(true);
        resourceLinkCompletionRepository.save(resourceLinkCompletion);

        // Update course progress for the corresponding course
        Long courseId = (Long) resourceLinkCompletion.getResource().getCourse().getCourseId();
        return courseProgressService.updateCourseProgress(employeeId, courseId);
    }

    @Transactional
    public void markResourceAsNotCompleted(Integer employeeId, Long resourceId) {
        ResourceLinkCompletion resourceLinkCompletion = resourceLinkCompletionRepository
                .findByEmployeeAndResource(employeeId, resourceId)
                .orElseThrow(() -> new RuntimeException("ResourceLinkCompletion entry not found."));

        // Update completion status
        resourceLinkCompletion.setCompleted(false);
        resourceLinkCompletionRepository.save(resourceLinkCompletion);

        // Update course progress for the corresponding course
        Long courseId = resourceLinkCompletion.getResource().getCourse().getCourseId();
        courseProgressService.updateCourseProgress(employeeId, courseId);
    }

    @Transactional
    public ResourceLinksAndStatus getStatusesByResourceIdAndEmployeeId(Integer employeeId,Long resourceId)
    {
        ResourceLinksAndStatus resourceLinksAndStatus =new ResourceLinksAndStatus();
        ResourceLinkCompletion resourceLinkCompletion = resourceLinkCompletionRepository.findByEmployeeAndResource(employeeId,resourceId).orElseThrow();
        Resources resourceLink = resourceLinkCompletion.getResource();
        resourceLinksAndStatus.setResourceId(resourceLink.getResourceId());
        resourceLinksAndStatus.setResourceLink(resourceLink.getResourceLink());
        resourceLinksAndStatus.setCompleted(resourceLinkCompletion.getCompleted());
        return resourceLinksAndStatus;
    }

    @Transactional
    public void createResourceLinkCompletions(List<Resources> resources, Employee employee) {
        for (Resources resource : resources) {
            ResourceLinkCompletion completion = new ResourceLinkCompletion();
            completion.setResource(resource);
            completion.setEmployee(employee);
            completion.setCompleted(false); // Set as needed

            // Save the completion record
            resourceLinkCompletionRepository.save(completion);
        }
    }
}
