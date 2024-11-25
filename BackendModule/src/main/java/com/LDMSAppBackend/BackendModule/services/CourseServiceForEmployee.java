package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.CourseAssignedToEmployee;
import com.LDMSAppBackend.BackendModule.Dtos.ResourceLinksAndStatus;
import com.LDMSAppBackend.BackendModule.entites.Course;
import com.LDMSAppBackend.BackendModule.entites.CourseAssignment;
import com.LDMSAppBackend.BackendModule.entites.Resources;
import com.LDMSAppBackend.BackendModule.repositories.CourseAssignmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CourseServiceForEmployee {

    private final CourseAssignmentRepository courseAssignmentRepository;
    private final ResourceLinkCompletionService resourceLinkCompletionService;

    @Autowired
    public CourseServiceForEmployee(CourseAssignmentRepository courseAssignmentRepository, ResourceLinkCompletionService resourceLinkCompletionService) {
        this.courseAssignmentRepository = courseAssignmentRepository;
        this.resourceLinkCompletionService = resourceLinkCompletionService;
    }

    @Transactional
    public CourseAssignedToEmployee getCourseForEmployee(Integer employeeId,Long courseId) throws NoSuchElementException {
        CourseAssignment courseAssignment = courseAssignmentRepository.findByCourse_CourseIdAndEmployee_EmployeeId(courseId,employeeId).orElseThrow();
        Course course = courseAssignment.getCourse();

        //setting courses for employees
        CourseAssignedToEmployee courseAssignedToEmployee = new CourseAssignedToEmployee();
        courseAssignedToEmployee.setCourseId(course.getCourseId());
        courseAssignedToEmployee.setCourseName(course.getCourseName());
        courseAssignedToEmployee.setDuration(course.getDuration());
        courseAssignedToEmployee.setOutcomes(course.getOutcomes());
        courseAssignedToEmployee.setDeadLine(courseAssignment.getDeadline());
        courseAssignedToEmployee.setKeyConcepts(course.getKeyConcepts());
        courseAssignedToEmployee.setAssignmentId(courseAssignment.getAssignmentId());

        //getting resources statuses by employees and resource id
        List<Resources> resourceLinks = course.getResources();
        List<ResourceLinksAndStatus> resourceLinksAndStatuses = new ArrayList<>();

        for(Resources resourceLink:resourceLinks)
        {
            resourceLinksAndStatuses.add(resourceLinkCompletionService.getStatusesByResourceIdAndEmployeeId(employeeId,resourceLink.getResourceId()));
        }

        courseAssignedToEmployee.setResourceLinksAndStatuses(resourceLinksAndStatuses);

        return courseAssignedToEmployee;
    }

}
