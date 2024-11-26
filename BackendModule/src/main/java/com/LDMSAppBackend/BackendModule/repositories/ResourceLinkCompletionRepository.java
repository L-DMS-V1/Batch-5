package com.LDMSAppBackend.BackendModule.repositories;
import com.LDMSAppBackend.BackendModule.entites.ResourceLinkCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceLinkCompletionRepository extends JpaRepository<ResourceLinkCompletion, Long> {
    // Method to count total links for a specific course
    @Query("SELECT COUNT(l) FROM ResourceLinkCompletion l WHERE l.resource.course.courseId = :courseId")
    Long countTotalLinks(@Param("courseId") Long courseId);

    // Method to count completed links for a specific course
    @Query("SELECT COUNT(l) FROM ResourceLinkCompletion l WHERE l.resource.course.courseId = :courseId AND l.completed = true")
    Long countCompletedLinks(@Param("courseId") Long courseId);

    @Query("SELECT rlc FROM ResourceLinkCompletion rlc WHERE rlc.employee.employeeId = :employeeId AND rlc.resource.resourceId = :resourceId")
    Optional<ResourceLinkCompletion> findByEmployeeAndResource(@Param("employeeId") Integer employeeId,
                                                               @Param("resourceId") Long resourceId);
}
