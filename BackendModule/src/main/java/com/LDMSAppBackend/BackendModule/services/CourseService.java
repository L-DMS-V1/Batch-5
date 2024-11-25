package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.*;
import com.LDMSAppBackend.BackendModule.entites.*;
import com.LDMSAppBackend.BackendModule.enums.CourseStatus;
import com.LDMSAppBackend.BackendModule.repositories.CourseAssignmentRepository;
import com.LDMSAppBackend.BackendModule.repositories.CourseRepository;
import com.LDMSAppBackend.BackendModule.repositories.EmployeeRepository;
import com.LDMSAppBackend.BackendModule.repositories.ResourcesRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;
    private final EmployeeRepository employeeRepository;
    private final ResourceLinkCompletionService resourceLinkCompletionService;
    private final ResourcesRepository resourcesRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository,
                         CourseAssignmentRepository courseAssignmentRepository,
                         EmployeeRepository employeeRepository, ResourceLinkCompletionService resourceLinkCompletionService, ResourcesRepository resourcesRepository) {
        this.courseRepository = courseRepository;
        this.courseAssignmentRepository = courseAssignmentRepository;
        this.employeeRepository = employeeRepository;
        this.resourceLinkCompletionService = resourceLinkCompletionService;
        this.resourcesRepository = resourcesRepository;
    }

    // Create a new course
    @Transactional
    public CourseCreationDto create(CourseCreationDto courseCreationDto){
        Course course = mapToCourseEntity(courseCreationDto);
        Course savedCourse = courseRepository.save(course);

        return mapToCourseDto(savedCourse);
    }

    // Get course by ID
    public CourseCreationDto getCourseByCourseId(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        CourseCreationDto courseCreationDto = mapToCourseDto(course);
        return courseCreationDto;
    }

    // Get all courses
    public List<CourseDisplayForAdmin> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream().map(this::mapToCoursesForAdminDto).collect(Collectors.toList());
    }

    // Update an existing course
    public CourseCreationDto updateCourse(Long courseId, CourseCreationDto courseCreationDto) {
        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course with ID " + courseId + " not found."));

        existingCourse.setCourseName(courseCreationDto.getCourseName());
        existingCourse.setKeyConcepts(courseCreationDto.getKeyConcepts());
        existingCourse.setDuration(courseCreationDto.getDuration());
        existingCourse.setOutcomes(courseCreationDto.getOutcomes());

        // Update resources
        List<Resources> updatedResources = mapToResourceEntities(courseCreationDto.getResources());
        existingCourse.getResources().clear();
        existingCourse.getResources().addAll(updatedResources);

        Course updatedCourse = courseRepository.save(existingCourse);
        return mapToCourseDto(updatedCourse);
    }

    // Delete a course by ID
    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course with ID " + courseId + " not found.");
        }
        courseRepository.deleteById(courseId);
    }

    // Get course by name
    public CourseCreationDto getCourseByName(String courseName) {
        Optional<Course> courseOptional = courseRepository.findByCourseName(courseName);
        if (courseOptional.isEmpty()) {
            throw new RuntimeException("Course with name '" + courseName + "' not found");
        }
        return mapToCourseDto(courseOptional.get());
    }

    // Assign courses to employees
    public CourseAssignmentResponseDto assignCourses(CourseAssignmentDto courseAssignmentDto) {
        Course course = courseRepository.findByCourseId(courseAssignmentDto.getCourseId());
        if (course == null) {
            throw new IllegalArgumentException("Course with ID " + courseAssignmentDto.getCourseId() + " does not exist.");
        }

        List<Integer> employeeIds = courseAssignmentDto.getEmployeeIds();
        List<Employee> employees = employeeRepository.findAllById(employeeIds);

        Set<Integer> existingEmployeeIds = employees.stream()
                .map(Employee::getEmployeeId)
                .collect(Collectors.toSet());

        List<CourseAssignment> courseAssignments = new ArrayList<>();
        List<Integer> faultyEmployeeIds = new ArrayList<>();
        List<Integer> alreadyExists = new ArrayList<>();

        for (Integer employeeId : employeeIds) {
            if (existingEmployeeIds.contains(employeeId)) {
                // Check if the course assignment already exists
                boolean assignmentExists = courseAssignmentRepository.existsByEmployee_EmployeeIdAndCourse_CourseId(employeeId, course.getCourseId());
                if (assignmentExists) {
                    alreadyExists.add(employeeId);
                } else {
                    CourseAssignment courseAssignment = new CourseAssignment();
                    courseAssignment.setCourse(course);
                    courseAssignment.setEmployee(employees.stream().filter(emp -> emp.getEmployeeId().equals(employeeId)).findFirst().orElse(null));
                    courseAssignment.setCourseStatus(CourseStatus.NOTCOMPLETED);
                    courseAssignment.setDeadline(courseAssignmentDto.getDeadline());
                    CourseProgress courseProgress = new CourseProgress();
                    courseProgress.setCourseAssignment(courseAssignment);
                    courseAssignment.setCourseProgress(courseProgress);
                    courseAssignments.add(courseAssignment);
                    List<Resources> resourceLinks = course.getResources();
                    resourceLinkCompletionService.createResourceLinkCompletions(resourceLinks,employees.stream().filter(emp -> emp.getEmployeeId().equals(employeeId)).findFirst().orElse(null));
                }
            } else {
                faultyEmployeeIds.add(employeeId);
            }
        }

        courseAssignmentRepository.saveAll(courseAssignments);

        CourseAssignmentResponseDto courseAssignmentResponseDto = new CourseAssignmentResponseDto();
        StringBuilder messageBuilder = new StringBuilder();

        if (!faultyEmployeeIds.isEmpty()) {
            messageBuilder.append("Employees with Id's ").append(faultyEmployeeIds).append(" do not exist. Existing employees are assigned to course");
        }

        if (!alreadyExists.isEmpty()) {
            messageBuilder.append("Employees with Id's ").append(alreadyExists).append(" are already assigned to this course. ");
        }

        if (faultyEmployeeIds.isEmpty() && alreadyExists.isEmpty()) {
            messageBuilder.append("All employees have been assigned to the course.");
        }

        courseAssignmentResponseDto.setMessage(messageBuilder.toString());
        return courseAssignmentResponseDto;
    }

    // Get courses assigned to an employee
    public List<CoursesDisplayForEmployee> getCoursesByEmployee(Integer employeeId) throws Exception {
        List<CourseAssignment> courseAssignments = courseAssignmentRepository.findByEmployee_EmployeeId(employeeId);
        List<CoursesDisplayForEmployee> coursesDisplayForEmployee = new ArrayList<>();
        for (CourseAssignment courseAssignment : courseAssignments) {
            Course course = courseAssignment.getCourse();
            coursesDisplayForEmployee.add(new CoursesDisplayForEmployee(course.getCourseId(),course.getCourseName(),course.getDuration(),courseAssignment.getDeadline()));
        }
        return coursesDisplayForEmployee;
    }

    // Helper method to map CourseDto to Course entity
    private CourseCreationDto mapToCourseDto(Course course) {
        return new CourseCreationDto(
                course.getCourseId(),
                course.getCourseName(),
                course.getKeyConcepts(),
                course.getDuration(),
                mapToResourcesDto(course.getResources()),
                course.getOutcomes()
        );
    }private CourseDisplayForAdmin mapToCoursesForAdminDto(Course course) {
        return new CourseDisplayForAdmin(
                course.getCourseId(),course.getCourseName(),course.getDuration()
        );
    }

    private List<ResourcesDto> mapToResourcesDto(List<Resources> resources) {
        List<ResourcesDto> resourcesDtos = new ArrayList<>();

        for (Resources resource : resources) {
            ResourcesDto resourcesDto = new ResourcesDto();
            resourcesDto.setResourceLinks(resource.getResourceLink());
            resourcesDto.setResourceNames(resource.getResourceName());
            resourcesDtos.add(resourcesDto);
        }
        return resourcesDtos;
    }

    // Helper method to map Course entity to CourseDto
    private Course mapToCourseEntity(CourseCreationDto courseCreationDto) {
        Course course = new Course();
        course.setCourseName(courseCreationDto.getCourseName());
        course.setKeyConcepts(courseCreationDto.getKeyConcepts());
        course.setDuration(courseCreationDto.getDuration());
        course.setOutcomes(courseCreationDto.getOutcomes());

        // Map resources and associate them with the course
        List<Resources> resources = mapToResourceEntities(courseCreationDto.getResources());
        for (Resources resource : resources) {
            resource.setCourse(course); // Set the course for each resource
        }
        course.setResources(resources); // Add resources to the course

        return course;
    }


    // Helper method to map ResourceLinksDto to Resources entity
    private List<Resources> mapToResourceEntities(List<ResourcesDto> resourcesDtos) {
        List<Resources> resourcesList = new ArrayList<>();
        for (ResourcesDto resourceDto : resourcesDtos) {
            Resources resource = new Resources();
            resource.setResourceLink(resourceDto.getResourceLinks());
            resource.setResourceName(resourceDto.getResourceNames());
            resourcesList.add(resource);
        }
        return resourcesList;
    }


}
