package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.CourseAssignment;
import com.LDMSAppBackend.BackendModule.entites.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Integer> {
    List<CourseAssignment> findByEmployee_EmployeeId(Integer employeeId);
    Optional<CourseAssignment> findByCourse_CourseIdAndEmployee_EmployeeId(Long courseId, Integer employeeId);
    Boolean existsByEmployee_EmployeeIdAndCourse_CourseId(Integer employeeId, Long courseId);

    CourseAssignment findByCourseProgress(CourseProgress courseProgress);
}