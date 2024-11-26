package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findByCourseId(Long courseId);

    Optional<Course> findByCourseName(String courseName);
}
