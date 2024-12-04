package com.LDMSAppBackend.BackendModule.services;

import com.LDMSAppBackend.BackendModule.Dtos.RequestDtos.FeedBackDto;
import com.LDMSAppBackend.BackendModule.Dtos.ResponseDtos.FeedBackViewDto;
import com.LDMSAppBackend.BackendModule.entites.Course;
import com.LDMSAppBackend.BackendModule.entites.CourseAssignment;
import com.LDMSAppBackend.BackendModule.entites.Feedback;
import com.LDMSAppBackend.BackendModule.entites.User;
import com.LDMSAppBackend.BackendModule.repositories.CourseAssignmentRepository;
import com.LDMSAppBackend.BackendModule.repositories.CourseRepository;
import com.LDMSAppBackend.BackendModule.repositories.FeedBackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FeedBackService {

    private final CourseRepository courseRepository;
    private final FeedBackRepository feedBackRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;

    @Autowired
    public FeedBackService(CourseRepository courseRepository, FeedBackRepository feedBackRepository, CourseAssignmentRepository courseAssignmentRepository) {
        this.courseRepository = courseRepository;
        this.feedBackRepository = feedBackRepository;
        this.courseAssignmentRepository = courseAssignmentRepository;
    }

    @Transactional
    public void addFeedback(FeedBackDto feedBackDto, Long courseId, Long assignmentId) throws RuntimeException
    {
        CourseAssignment courseAssignment = courseAssignmentRepository.findById(assignmentId).orElseThrow();
        if(courseAssignment.getCourseProgress().getPercentage() != 100)
        {
            throw new RuntimeException("You have not yet completed the course. you can submit feedback only on completion of the course");
        }
        Course course = courseRepository.findByCourseId(courseId);
        Feedback feedback = new Feedback();
        feedback.setComment(feedBackDto.getComment());
        feedback.setCourse(course);
        User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        feedback.setEmployeeName(user.getUsername());
        feedback.setRating(feedBackDto.getRating());

        System.out.println("feedback created");
        feedBackRepository.save(feedback);
        System.out.println("feedback saved");

    }

    public List<FeedBackViewDto> getFeedBacks(Long courseId)
    {
        List<Feedback> feedbacks = feedBackRepository.findByCourse_CourseId(courseId);
        List<FeedBackViewDto> feedBackViewDtos = new ArrayList<>();
        for(Feedback feedback:feedbacks)
        {
            feedBackViewDtos.add(new FeedBackViewDto(feedback.getFeedBackId(), feedback.getRating(),feedback.getComment(),feedback.getEmployeeName()));
        }
        return feedBackViewDtos;
    }

    @Transactional
    public Map<Integer, Long> getRatingFrequency(Long courseId) {
        List<Object[]> ratingCounts = feedBackRepository.getRatingFrequencyByCourse(courseId);

        Map<Integer, Long> frequencyMap = new HashMap<>();
        for (Object[] entry : ratingCounts) {
            Integer rating = (Integer) entry[0];
            Long count = (Long) entry[1];
            frequencyMap.put(rating, count);
        }
        for (int i = 1; i <= 5; i++) {
            frequencyMap.putIfAbsent(i, 0L);
        }
        return frequencyMap;
    }
}
