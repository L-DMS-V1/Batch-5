import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, ENDPOINTS } from '../config/api';
import CourseFeedback from './CourseFeedback';
import '../styles/CourseResources.css';

const CourseResources = ({ courseId, onBack, onResourceComplete }) => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const calculateCompletionPercentage = (resources) => {
    if (!resources || resources.length === 0) return 0;
    const completedCount = resources.filter(r => r.completed).length;
    return Math.round((completedCount / resources.length) * 100);
  };

  // Helper function to extract YouTube video ID
  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Check if URL is a video link
  const isVideoUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Handle resource click
  const handleResourceClick = (resource, e) => {
    e.preventDefault();
    if (isVideoUrl(resource.resourceLink)) {
      const videoId = getYoutubeVideoId(resource.resourceLink);
      if (videoId) {
        setSelectedVideo({
          id: videoId,
          name: resource.resourceName
        });
      } else {
        window.open(resource.resourceLink, '_blank');
      }
    } else {
      window.open(resource.resourceLink, '_blank');
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(ENDPOINTS.EMPLOYEE_GET_COURSE(courseId));
        if (mounted) {
          console.log('Course Data:', response.data);
          setCourseData(response.data);
          
          // Calculate initial completion percentage
          const initialPercentage = calculateCompletionPercentage(response.data.resourceLinksAndStatuses);
          setCompletionPercentage(initialPercentage);
          
          // Store initial percentage
          localStorage.setItem(`course_${courseId}_completion`, initialPercentage.toString());
          
          // Show feedback only if 100% complete
          setShowFeedback(initialPercentage === 100);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching course resources:', error);
          setError('Error loading course resources');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  const handleResourceCompletion = async (resourceId, completed) => {
    try {
      const endpoint = completed ? 
        ENDPOINTS.EMPLOYEE_MARK_COMPLETED(resourceId) :
        ENDPOINTS.EMPLOYEE_MARK_NOT_COMPLETED(resourceId);

      await axiosInstance.put(endpoint);

      // After marking complete, fetch latest course data
      const courseResponse = await axiosInstance.get(ENDPOINTS.EMPLOYEE_GET_COURSE(courseId));
      const updatedCourseData = courseResponse.data;
      
      // Calculate new percentage
      const newPercentage = calculateCompletionPercentage(updatedCourseData.resourceLinksAndStatuses);
      
      console.log('Resource completion update:', {
        courseId,
        resourceId,
        action: completed ? 'completed' : 'uncompleted',
        completionStatus: {
          totalResources: updatedCourseData.resourceLinksAndStatuses.length,
          completedResources: updatedCourseData.resourceLinksAndStatuses.filter(r => r.completed).length,
          newPercentage,
          allCompleted: updatedCourseData.resourceLinksAndStatuses.every(r => r.completed)
        }
      });

      // Update state and storage
      setCourseData(updatedCourseData);
      setCompletionPercentage(newPercentage);
      localStorage.setItem(`course_${courseId}_completion`, newPercentage.toString());
      
      // Show feedback form if 100% complete
      const allCompleted = updatedCourseData.resourceLinksAndStatuses.every(r => r.completed);
      setShowFeedback(newPercentage === 100 && allCompleted);
      
      // Show success message
      setMessage({ 
        text: `Resource ${completed ? 'completed' : 'uncompleted'}. Course completion: ${newPercentage}%`, 
        type: 'success' 
      });

    } catch (error) {
      console.error('Resource completion error:', error);
      setMessage({ 
        text: error.response?.data || 'Error updating resource status', 
        type: 'error' 
      });
    }
  };

  const handleFeedbackSubmit = async (feedback) => {
    try {
      // Verify completion with backend
      const completionResponse = await axiosInstance.get(ENDPOINTS.EMPLOYEE_GET_COURSE(courseId));
      const serverResources = completionResponse.data.resourceLinksAndStatuses;
      const serverPercentage = calculateCompletionPercentage(serverResources);
      
      console.log('Feedback submission verification:', {
        courseId,
        assignmentId: courseData?.assignmentId,
        completionStatus: {
          serverPercentage,
          frontendPercentage: completionPercentage,
          storedPercentage: parseInt(localStorage.getItem(`course_${courseId}_completion`) || '0'),
          allResourcesCompleted: serverResources.every(r => r.completed),
          resourceDetails: serverResources.map(r => ({
            id: r.resourceId,
            completed: r.completed
          }))
        },
        feedback: {
          rating: feedback.rating,
          commentLength: feedback.comment?.length
        }
      });

      // The backend will do its own completion check
      // We just need to ensure the feedback data is valid
      if (!feedback.rating || feedback.rating < 1 || feedback.rating > 5) {
        setMessage({ text: 'Please provide a valid rating between 1 and 5', type: 'error' });
        return;
      }

      if (!feedback.comment || !feedback.comment.trim()) {
        setMessage({ text: 'Please provide feedback comments', type: 'error' });
        return;
      }

      // Submit feedback - backend will verify completion
      const response = await axiosInstance.post(
        ENDPOINTS.EMPLOYEE_SUBMIT_FEEDBACK(courseId, courseData.assignmentId),
        {
          rating: parseInt(feedback.rating),
          comment: feedback.comment.trim()
        }
      );

      setMessage({ text: 'Feedback submitted successfully!', type: 'success' });
      setShowFeedback(false); // Close the feedback form after successful submission
    } catch (error) {
      console.error('Feedback submission error:', error);
      const errorMessage = error.response?.status === 403 
        ? 'Not authorized to submit feedback. Please ensure all resources are completed.'
        : (error.response?.data || 'Error submitting feedback');
      setMessage({ text: errorMessage, type: 'error' });
    }
  };

  const fetchCourseResources = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.EMPLOYEE_GET_COURSE(courseId));
      console.log('Course Data:', response.data);
      setCourseData(response.data);
      
      // Calculate completion percentage
      const percentage = calculateCompletionPercentage(response.data.resourceLinksAndStatuses);
      setCompletionPercentage(percentage);
      
      // Show feedback only if 100% complete
      setShowFeedback(percentage === 100);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course resources:', error);
      setError('Error loading course resources');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading resources...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!courseData) return null;

  return (
    <div className="course-resources-container">
      <div className="resources-header">
        <h2>{courseData.courseName} - Resources</h2>
        <button className="course-back-button" onClick={onBack}>
          Back to Courses
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="completion-status">
        Course Completion: {completionPercentage}%
        {completionPercentage === 100 && (
          <span className="completion-badge">Course Completed!</span>
        )}
      </div>

      <div className="resources-list">
        {courseData.resourceLinksAndStatuses?.map((resource, index) => (
          <div key={index} className={`resource-item ${resource.completed ? 'completed' : ''}`}>
            <div className="resource-info">
              <a 
                href={resource.resourceLink} 
                onClick={(e) => handleResourceClick(resource, e)}
                className="resource-link"
              >
                <span className="resource-title">{resource.resourceName || `Resource ${index + 1}`}</span>
              </a>
              <span className="resource-status">
                {resource.completed ? '✓ Completed' : 'Pending'}
              </span>
            </div>
            <div className="resource-actions">
              <button
                className={`completion-button ${resource.completed ? 'completed' : ''}`}
                onClick={() => handleResourceCompletion(resource.resourceId, !resource.completed)}
              >
                {resource.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        ))}

        {selectedVideo && (
          <div className="video-player-container">
            <div className="video-player-header">
              <h3>{selectedVideo.name}</h3>
              <button className="close-video" onClick={() => setSelectedVideo(null)}>×</button>
            </div>
            <div className="video-player">
              <iframe
                width="100%"
                height="480"
                src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.name}
              />
            </div>
          </div>
        )}
      </div>

      {showFeedback && (
        <div className="feedback-section">
          <h3>Course Completed! Please provide your feedback</h3>
          <CourseFeedback onSubmit={handleFeedbackSubmit} />
        </div>
      )}
    </div>
  );
};

export default CourseResources;
