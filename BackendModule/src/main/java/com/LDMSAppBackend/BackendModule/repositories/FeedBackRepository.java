package com.LDMSAppBackend.BackendModule.repositories;

import com.LDMSAppBackend.BackendModule.entites.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedBackRepository extends JpaRepository<Feedback,Long> {
    List<Feedback> findByCourse_CourseId(Long courseId);
    @Query("SELECT f.rating, COUNT(f) FROM Feedback f WHERE f.course.courseId = :courseId GROUP BY f.rating ORDER BY f.rating")
    List<Object[]> getRatingFrequencyByCourse(@Param("courseId") Long courseId);
}
