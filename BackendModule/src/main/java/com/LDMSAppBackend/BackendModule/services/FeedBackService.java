package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.FeedBackDto;
import com.LDMSAppBackend.BackendModule.entites.Course;
import com.LDMSAppBackend.BackendModule.entites.Feedback;
import com.LDMSAppBackend.BackendModule.entites.User;
import com.LDMSAppBackend.BackendModule.repositories.CourseRepository;
import com.LDMSAppBackend.BackendModule.repositories.FeedBackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FeedBackService {

    private final CourseRepository courseRepository;
    private final FeedBackRepository feedBackRepository;

    @Autowired
    public FeedBackService(CourseRepository courseRepository, FeedBackRepository feedBackRepository) {
        this.courseRepository = courseRepository;
        this.feedBackRepository = feedBackRepository;
    }

    @Transactional
    public void addFeedback(FeedBackDto feedBackDto,Long courseId)
    {
        Course course = courseRepository.findByCourseId(courseId);
        Feedback feedback = new Feedback();
        feedback.setComment(feedBackDto.getComment());
        feedback.setCourse(course);
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        feedback.setEmployeeName(user.getUsername());
        feedback.setRating(feedBackDto.getRating());
        feedBackRepository.save(feedback);
    }
}
