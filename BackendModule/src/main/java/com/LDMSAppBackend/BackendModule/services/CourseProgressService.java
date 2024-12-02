package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.CourseProgressDisplayDto;
import com.LDMSAppBackend.BackendModule.entites.CourseAssignment;
import com.LDMSAppBackend.BackendModule.entites.CourseProgress;
import com.LDMSAppBackend.BackendModule.enums.CourseStatus;
import com.LDMSAppBackend.BackendModule.repositories.CourseAssignmentRepository;
import com.LDMSAppBackend.BackendModule.repositories.CourseProgressRepository;
import com.LDMSAppBackend.BackendModule.repositories.ResourceLinkCompletionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CourseProgressService {

    private final ResourceLinkCompletionRepository resourceLinkCompletionRepository;
    private final CourseProgressRepository courseProgressRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;

    @Autowired
    public CourseProgressService(ResourceLinkCompletionRepository resourceLinkCompletionRepository, CourseProgressRepository courseProgressRepository, CourseAssignmentRepository courseAssignmentRepository) {
        this.resourceLinkCompletionRepository = resourceLinkCompletionRepository;
        this.courseProgressRepository = courseProgressRepository;
        this.courseAssignmentRepository = courseAssignmentRepository;
    }

    public String updateCourseProgress(Integer employeeId, Long courseId) {
        // Fetch total links
        Long totalLinksCount = resourceLinkCompletionRepository.countTotalLinksByEmployeeAndCourse(courseId,employeeId);
        int totalLinks = totalLinksCount != null ? totalLinksCount.intValue() : 0;

        // Fetch completed links
        Long completedLinksCount = resourceLinkCompletionRepository.countCompletedLinksByEmployeeAndCourse(courseId,employeeId);
        int completedLinks = completedLinksCount != null ? completedLinksCount.intValue() : 0;

        // Calculate progress percentage
        int progressPercentage = (totalLinks == 0) ? 0 : (completedLinks * 100 / totalLinks);

        // Fetch and update course progress
        CourseProgress courseProgress = courseAssignmentRepository
                .findByCourse_CourseIdAndEmployee_EmployeeId(courseId, employeeId)
                .orElseThrow(() -> new NoSuchElementException("Course progress not found for employee ID " + employeeId + " and course ID " + courseId))
                .getCourseProgress();

        courseProgress.setPercentage(progressPercentage);
        courseProgress.setLastUpdatedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

        courseProgressRepository.save(courseProgress);
        if(progressPercentage == 100)
        {
            CourseAssignment courseAssignment =courseAssignmentRepository.findByCourseProgress(courseProgress);
            courseAssignment.setCourseStatus(CourseStatus.COMPLETED);
            courseAssignmentRepository.save(courseAssignment);
            return "Course completed";
        }
        return "Great job! you can go to next resource";
    }

    public List<CourseProgressDisplayDto> getAllProgress()
    {
        List<CourseAssignment> courseAssignments = courseAssignmentRepository.findAll();
        List<CourseProgressDisplayDto> courseProgressDisplayDtos = new ArrayList<>();
        for(CourseAssignment courseAssignment: courseAssignments)
        {
            courseProgressDisplayDtos.add(mapCourseAssignmentToCourseProgressDto(courseAssignment));
        }
        return courseProgressDisplayDtos;
    }

    private CourseProgressDisplayDto mapCourseAssignmentToCourseProgressDto(CourseAssignment courseAssignment)
    {
        CourseProgressDisplayDto courseProgressDisplayDto = new CourseProgressDisplayDto();
        courseProgressDisplayDto.setAssignmentId(courseAssignment.getAssignmentId());
        courseProgressDisplayDto.setDeadline(courseAssignment.getDeadline());
        courseProgressDisplayDto.setEmployeeName(courseAssignment.getEmployee().getUser().getUsername());
        CourseProgress courseProgress = courseAssignment.getCourseProgress();
        courseProgressDisplayDto.setPercentage(courseProgress.getPercentage());
        courseProgressDisplayDto.setLastUpdatedDate(courseProgress.getLastUpdatedDate());
        courseProgressDisplayDto.setCourseId(courseAssignment.getCourse().getCourseId());
        courseProgressDisplayDto.setCourseName(courseAssignment.getCourse().getCourseName());
        return courseProgressDisplayDto;
    }
}

