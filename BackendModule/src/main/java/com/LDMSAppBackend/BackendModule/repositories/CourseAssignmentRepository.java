package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.Course;
import com.LDMSAppBackend.BackendModule.entites.CourseAssignment;
import com.LDMSAppBackend.BackendModule.entites.CourseProgress;
import com.LDMSAppBackend.BackendModule.entites.Employee;

import com.LDMSAppBackend.BackendModule.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Long> {
    Boolean existsByEmployee_EmployeeIdAndCourse_CourseId(Integer employeeId, Long courseId);

    CourseAssignment findByCourseProgress(CourseProgress courseProgress);
	List<CourseAssignment> findByEmployee(Employee employee);
	Optional<CourseAssignment> findByCourse_CourseIdAndEmployee(Long courseId,Employee employee);
	Optional<CourseAssignment> findByCourse_CourseIdAndEmployee_EmployeeId(Long courseId, Integer employeeId);
	long countByCourse(Course course);
	long countByCourseAndCourseStatus(Course course, CourseStatus courseStatus);

}