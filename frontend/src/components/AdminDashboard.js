// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance, ENDPOINTS } from '../config/api';
import '../styles/Dashboard.css';
import '../styles/CourseProgress.css';
import FeedbackChart from './FeedbackChart'; // Import the FeedbackChart component
import ChangePasswordModal from './ChangePasswordModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [progressStats, setProgressStats] = useState(null);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    accountName: '',
    userName: '',
    password: '',
    email: '',
    role: 'EMPLOYEE',
    position: '',
    contact: '',
    managerName: ''
  });
  const [managers, setManagers] = useState([]);
  const [isManagerRegistration, setIsManagerRegistration] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [courseForm, setCourseForm] = useState({
    courseId: '',
    courseName: '',
    keyConcepts: '',
    duration: '',
    resources: [{ resourceName: '', resourceLink: '' }],
    outcomes: ''
  });
  const [assignCourseForm, setAssignCourseForm] = useState({
    courseId: '',
    deadline: '',
    employeeIds: []
  });
  const [employees, setEmployees] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [showCreatedCourses, setShowCreatedCourses] = useState(false);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedCourseForUpdate, setSelectedCourseForUpdate] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [courseProgresses, setCourseProgresses] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role?.toLowerCase() !== 'admin') {
      setMessage({ text: 'Please login with admin credentials', type: 'error' });
      navigate('/login');
      return;
    }

    fetchInitialData();

    const pollInterval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      const currentRole = localStorage.getItem('role');
      
      if (currentToken && currentRole?.toLowerCase() === 'admin') {
        fetchInitialData();
      } else {
        clearInterval(pollInterval);
      }
    }, 300000); // Poll every 5 minutes

    return () => clearInterval(pollInterval);
  }, [navigate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [requestsResponse, coursesResponse] = await Promise.all([
        axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_REQUESTS),
        axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_COURSES)
      ]);

      if (requestsResponse.data) {
        setRequests(requestsResponse.data);
      }
      
      if (coursesResponse.data) {
        setCreatedCourses(coursesResponse.data);
      }

      try {
        const progressResponse = await axiosInstance.get(ENDPOINTS.ADMIN_GET_PROGRESSES);
        if (progressResponse.data) {
          setProgressStats(progressResponse.data);
        }
      } catch (error) {
        console.error('Error fetching progress stats:', error);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setMessage({ 
        text: 'Error loading dashboard data. Please refresh the page.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role?.toLowerCase() !== 'admin') {
          setMessage({ text: 'Authentication error. Please check your session.', type: 'error' });
          return;
        }

        const response = await axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_MANAGERS);
        if (response.data && response.data.managerNames) {
          setManagers(response.data.managerNames);
        }
      } catch (error) {
        console.error('Error fetching managers:', error);
        setMessage({ 
          text: error.response?.data?.message || 'Error fetching managers. Please try again.', 
          type: 'error' 
        });
      }
    };
    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role?.toLowerCase() !== 'admin') {
          setMessage({ text: 'Authentication error. Please check your session.', type: 'error' });
          return;
        }

        const response = await axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_MANAGERS);
        if (response.data && response.data.managerNames) {
          setManagers(response.data.managerNames);
        }
      } catch (error) {
        console.error('Error fetching managers:', error);
        setMessage({ 
          text: error.response?.data?.message || 'Error fetching managers. Please try again.', 
          type: 'error' 
        });
      }
    };

    if (showAddEmployeeForm) {
      fetchManagers();
    }
  }, [showAddEmployeeForm]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isManagerRegistration ? 
        ENDPOINTS.ADMIN_ADD_MANAGER : 
        ENDPOINTS.ADMIN_ADD_EMPLOYEE;
      
      const formData = isManagerRegistration ? 
        {
          accountName: employeeForm.accountName,
          userName: employeeForm.userName,
          password: employeeForm.password,
          email: employeeForm.email,
          role: 'MANAGER'
        } : 
        {
          ...employeeForm,
          role: 'EMPLOYEE'
        };

      await axiosInstance.post(endpoint, formData);
      
      setMessage({ 
        text: `${isManagerRegistration ? 'Manager' : 'Employee'} added successfully`, 
        type: 'success' 
      });
      setShowAddEmployeeForm(false);
      setEmployeeForm({
        accountName: '',
        userName: '',
        password: '',
        email: '',
        role: 'EMPLOYEE',
        position: '',
        contact: '',
        managerName: ''
      });
      
      // Refresh managers list if we just added a new manager
      if (isManagerRegistration) {
        const response = await axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_MANAGERS);
        setManagers(response.data.managerNames || []);
      }
    } catch (error) {
      console.error(`Error adding ${isManagerRegistration ? 'manager' : 'employee'}:`, error);
      setMessage({ 
        text: error.response?.data?.message || `Error adding ${isManagerRegistration ? 'manager' : 'employee'}`, 
        type: 'error' 
      });
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      // Verify token and role
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role?.toLowerCase() !== 'admin') {
        setMessage({ text: 'Authentication error. Please check your session.', type: 'error' });
        return;
      }

      await axiosInstance.put(
        ENDPOINTS.ADMIN_ACCEPT_REQUEST(id),
        {},
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      setMessage({ text: 'Request accepted successfully', type: 'success' });
      await Promise.all([
        fetchInitialData(),
        fetchAcceptedRequests()
      ]);

      // Find the accepted request and show course creation form
      const acceptedRequest = requests.find(req => req.id === id);
      if (acceptedRequest) {
        setSelectedRequest(acceptedRequest);
        setCourseForm({
          courseId: '',
          courseName: '',
          keyConcepts: '',
          duration: '',
          resources: [{ resourceName: '', resourceLink: '' }],
          outcomes: ''
        });
        setShowCourseForm(true);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error accepting request. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(
        ENDPOINTS.ADMIN_REJECT_REQUEST(requestId),
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage({ text: 'Request rejected successfully', type: 'success' });
      fetchInitialData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      setMessage({ text: error.response?.data?.message || 'Error rejecting request', type: 'error' });
    }
  };

  const handleAddResource = () => {
    setCourseForm({
      ...courseForm,
      resources: [...courseForm.resources, { resourceName: '', resourceLink: '' }]
    });
  };

  const handleRemoveResource = (index) => {
    const newResources = courseForm.resources.filter((_, i) => i !== index);
    setCourseForm({ ...courseForm, resources: newResources });
  };

  const handleResourceChange = (index, field, value) => {
    const newResources = [...courseForm.resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setCourseForm({ ...courseForm, resources: newResources });
  };

  const handleUpdateCourse = async (courseId) => {
    try {
      // Get the course details
      const course = courses.find(c => c.courseId === courseId);
      if (!course) {
        setMessage({ text: 'Course not found', type: 'error' });
        return;
      }

      console.log('Course data for update:', course);

      // Pre-fill the course form with existing data
      const formData = {
        courseId: course.courseId,
        courseName: course.courseName || '',
        keyConcepts: course.keyConcepts || course.key_concepts || '',
        duration: course.duration || '',
        outcomes: course.outcomes || course.course_outcomes || '',
        resources: []
      };

      // Handle different possible resource structures
      if (course.resources && Array.isArray(course.resources)) {
        formData.resources = course.resources.map(r => ({
          resourceName: r.resourceName || r.resourceNames || '',
          resourceLink: r.resourceLink || r.resourceLinks || r.link || ''
        }));
      } else if (course.resourceLinksAndStatuses && Array.isArray(course.resourceLinksAndStatuses)) {
        formData.resources = course.resourceLinksAndStatuses.map(r => ({
          resourceName: r.resourceName || r.resourceNames || '',
          resourceLink: r.resourceLink || r.resourceLinks || r.link || ''
        }));
      }

      // Ensure at least one empty resource field
      if (!formData.resources || formData.resources.length === 0) {
        formData.resources = [{ resourceName: '', resourceLink: '' }];
      }

      console.log('Form data for update:', formData);

      // Set form data
      setCourseForm(formData);

      // Set update mode
      setSelectedCourseForUpdate(courseId);
      setShowCourseForm(true);
    } catch (error) {
      console.error('Error preparing course update:', error);
      setMessage({ text: 'Error preparing course update', type: 'error' });
    }
  };

  const handleSubmitCourseForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      console.log('Current course form:', courseForm);

      // Validate resources - ensure at least one resource is properly filled
      const validResources = courseForm.resources.filter(
        resource => resource.resourceName && resource.resourceName.trim() !== '' && 
                   resource.resourceLink && resource.resourceLink.trim() !== ''
      );

      if (validResources.length === 0) {
        setMessage({ text: 'Please add at least one resource with both name and link', type: 'error' });
        return;
      }

      // Create a clean form object
      const transformedCourseForm = {
        courseName: courseForm.courseName.trim(),
        keyConcepts: courseForm.keyConcepts.trim(),
        duration: courseForm.duration.trim(),
        outcomes: courseForm.outcomes.trim(),
        resources: validResources.map(resource => ({
          resourceLinks: resource.resourceLink.trim(),
          resourceNames: resource.resourceName.trim()
        })),
        managerName: selectedRequest?.managerName || localStorage.getItem('userName')
      };

      console.log('Submitting transformed course form:', transformedCourseForm);

      if (selectedCourseForUpdate) {
        await axiosInstance.put(
          ENDPOINTS.ADMIN_UPDATE_COURSE(selectedCourseForUpdate),
          transformedCourseForm,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setMessage({ text: 'Course updated successfully', type: 'success' });
      } else {
        // Create new course
        const response = await axiosInstance.post(
          ENDPOINTS.ADMIN_CREATE_COURSE,
          transformedCourseForm,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        console.log('Course creation response:', response.data);
        
        if (response.data.courseCreationDto) {
          setMessage({ text: 'Course created successfully', type: 'success' });
          const courseId = response.data.courseCreationDto.id;
          
          // Set the courseId for assignment
          setAssignCourseForm(prev => ({
            ...prev,
            courseId: courseId
          }));
          
          if (selectedRequest?.employeePosition) {
            await fetchEmployeesByPosition(selectedRequest.employeePosition);
            setShowAssignForm(true);
          }
        } else {
          setMessage({ text: 'Error creating course: Invalid response', type: 'error' });
        }
      }

      // Reset form and close modal on success
      setCourseForm({
        courseId: '',
        courseName: '',
        keyConcepts: '',
        duration: '',
        resources: [{ resourceName: '', resourceLink: '' }],
        outcomes: ''
      });
      setShowCourseForm(false);
      setSelectedCourseForUpdate(null);
      fetchInitialData();
    } catch (error) {
      console.error('Error submitting course form:', error);
      setMessage({ text: error.response?.data?.message || 'Error submitting course form', type: 'error' });
    }
  };

  const handleAssignFromCreatedCourses = async (course) => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role?.toLowerCase() !== 'admin') {
        setMessage({ text: 'Authentication error. Please check your session.', type: 'error' });
        return;
      }

      if (!course?.courseId) {
        setMessage({ text: 'Invalid course selection', type: 'error' });
        return;
      }

      setLoading(true);
      console.log('Getting course details for:', course.courseId);

      // First get the course details
      const courseResponse = await axiosInstance.get(
        ENDPOINTS.ADMIN_GET_COURSE(course.courseId)
      );
      
      console.log('Course details received:', courseResponse?.data);
      
      if (!courseResponse?.data) {
        throw new Error('Failed to fetch course details');
      }

      const courseDetails = courseResponse.data;
      
      // Get manager name from course details or local storage
      const managerName = courseDetails.managerName || localStorage.getItem('userName');

      // Get all training requests to find the one matching this course
      const requestsResponse = await axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_REQUESTS);
      const matchingRequest = requestsResponse.data.find(req => 
        req.courseName === courseDetails.courseName && 
        req.status === 'APPROVED'
      );

      if (!matchingRequest) {
        setMessage({ text: 'Could not find the original training request', type: 'error' });
        return;
      }

      const position = matchingRequest.employeePosition;
      const requiredEmployeeCount = parseInt(matchingRequest.requiredEmployees) || 0;
      
      console.log('Found matching request with position:', position, 'required employees:', requiredEmployeeCount);

      if (!position) {
        setMessage({ text: 'Position not found in training request', type: 'error' });
        return;
      }

      console.log('Fetching employees for manager:', managerName, 'position:', position);

      // Get employees under the manager for the specific position
      const employeesResponse = await axiosInstance.post(
        ENDPOINTS.ADMIN_GET_EMPLOYEES_BY_POSITION,
        {
          managerName,
          position
        }
      );

      console.log('Employees response:', employeesResponse?.data);

      if (!employeesResponse?.data) {
        throw new Error('Failed to fetch employees');
      }

      // Set the employees for dropdown
      setEmployees(employeesResponse.data);
      
      // Set the selected course info with required employee count
      setSelectedRequest({
        managerName: managerName,
        employeePosition: position,
        id: course.courseId,
        requiredEmployeeCount: requiredEmployeeCount
      });

      // Reset the assignment form
      setAssignCourseForm({
        courseId: course.courseId,
        deadline: '',
        employeeIds: []
      });

      console.log('Showing assign form');
      // Show the assignment form
      setShowAssignForm(true);
      
    } catch (error) {
      console.error('Error preparing course assignment:', error);
      if (error.response?.status === 401) {
        setMessage({ 
          text: 'Your session has expired. Please log in again.',
          type: 'error' 
        });
      } else {
        setMessage({ 
          text: error.response?.data?.message || 'Error preparing course assignment. Please try again.',
          type: 'error' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelection = (selectedIds) => {
    const requiredCount = selectedRequest?.requiredEmployeeCount || 0;
    
    // If trying to select more than required
    if (selectedIds.length > requiredCount) {
      setMessage({ 
        text: `You can only select up to ${requiredCount} employee${requiredCount !== 1 ? 's' : ''}`, 
        type: 'warning' 
      });
      return;
    }

    setAssignCourseForm(prev => ({
      ...prev,
      employeeIds: selectedIds
    }));
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role?.toLowerCase() !== 'admin') {
        setMessage({ text: 'Authentication error. Please check your session.', type: 'error' });
        return;
      }
      
      if (!assignCourseForm.courseId) {
        setMessage({ text: 'Course ID is missing', type: 'error' });
        return;
      }

      if (!assignCourseForm.deadline) {
        setMessage({ text: 'Please set a deadline', type: 'error' });
        return;
      }

      const formattedDeadline = new Date(assignCourseForm.deadline).toISOString().split('T')[0];
      
      const assignmentPayload = {
        courseId: assignCourseForm.courseId,
        employeeIds: assignCourseForm.employeeIds,
        deadline: formattedDeadline
      };

      console.log('Assignment payload:', assignmentPayload);

      await axiosInstance.post(
        ENDPOINTS.ADMIN_ASSIGN_COURSE,
        assignmentPayload,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      setMessage({ text: 'Course assigned successfully', type: 'success' });
      setShowAssignForm(false);
      setSelectedRequest(null);
      setAssignCourseForm({
        courseId: '',
        deadline: '',
        employeeIds: []
      });
      await fetchInitialData();
    } catch (error) {
      console.error('Error assigning course:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error assigning course. Please try again.', 
        type: 'error' 
      });
    }
  };

  const fetchAcceptedRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role?.toLowerCase() !== 'admin') {
        setMessage({ text: 'Authentication error. Please check your session.', type: 'error' });
        return;
      }

      const response = await axiosInstance.get(
        ENDPOINTS.ADMIN_GET_ALL_REQUESTS,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Filter for accepted requests that don't have courses created yet
      const accepted = response.data.filter(req => req.status === 'APPROVED');
      setAcceptedRequests(accepted);
    } catch (error) {
      console.error('Error fetching accepted requests:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error fetching accepted requests. Please try again.', 
        type: 'error' 
      });
    }
  };

  useEffect(() => {
    if (showCreatedCourses) {
      fetchCreatedCourses();
    }
  }, [showCreatedCourses]);

  const fetchCreatedCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(
        ENDPOINTS.ADMIN_GET_ALL_COURSES,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setCreatedCourses(response.data);
    } catch (error) {
      console.error('Error fetching created courses:', error);
      setMessage({ text: 'Error fetching created courses', type: 'error' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchInitialData(),
          fetchAcceptedRequests()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ text: 'Error fetching data', type: 'error' });
      }
    };
    fetchData();
  }, []);

  const handleCreateCourseClick = (request) => {
    setCourseForm({
      courseName: request.courseName || '',
      keyConcepts: request.concepts || '',
      duration: request.duration || '',
      resources: [{ resourceName: '', resourceLink: '' }],
      outcomes: request.outcomes || '',
      requestId: request.id // Store the request ID to update its status after course creation
    });
    setShowCourseForm(true);
  };

  const handleCourseCreationSuccess = async () => {
    try {
      await fetchAcceptedRequests(); // Refresh the accepted requests list
      await fetchCreatedCourses(); // Refresh the created courses list
      setShowCourseForm(false);
      setMessage({ text: 'Course created successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating lists:', error);
      setMessage({ text: 'Error updating lists', type: 'error' });
    }
  };

  const fetchCourseProgresses = async () => {
    try {
      setProgressLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.ADMIN_GET_PROGRESSES);
      
      // Group progress data by courseId
      const groupedData = response.data.reduce((acc, progress) => {
        if (!acc[progress.courseId]) {
          acc[progress.courseId] = {
            courseId: progress.courseId,
            courseName: progress.courseName,
            employees: []
          };
        }
        acc[progress.courseId].employees.push({
          employeeId: progress.assignmentId,
          employeeName: progress.employeeName,
          completionPercentage: progress.percentage,
          deadline: progress.deadline,
          lastUpdatedDate: progress.lastUpdatedDate
        });
        return acc;
      }, {});

      // Convert to array
      const formattedData = Object.values(groupedData);
      console.log('Formatted data:', formattedData);
      setCourseProgresses(formattedData);
    } catch (error) {
      console.error('Error fetching course progresses:', error);
      setMessage({ text: 'Error fetching course progresses', type: 'error' });
      setCourseProgresses([]);
    } finally {
      setProgressLoading(false);
    }
  };

  useEffect(() => {
    if (showProgressModal) {
      fetchCourseProgresses();
    }
  }, [showProgressModal]);

  const handleViewFeedback = async (courseId) => {
    try {
      console.log('Fetching feedback for courseId:', courseId);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [feedbacksRes, frequenciesRes] = await Promise.all([
        axiosInstance.get(`/api/admin/getFeedbacks/${courseId}`, config),
        axiosInstance.get(`/api/admin/getFeedbackFrequencies/${courseId}`, config)
      ]);

      console.log('API Responses:', {
        feedbacks: feedbacksRes.data,
        frequencies: frequenciesRes.data
      });

      setFeedbackData(frequenciesRes.data);
      setFeedbacks(feedbacksRes.data);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      setMessage({ 
        text: error.response?.status === 404 
          ? 'No feedbacks found for this course' 
          : 'Error fetching feedback data', 
        type: 'error' 
      });
      return null;
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(ENDPOINTS.ADMIN_GET_ALL_COURSES, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage({ text: 'Error fetching courses', type: 'error' });
    }
  };

  useEffect(() => {
    if (showFeedbackModal) {
      fetchCourses();
    }
  }, [showFeedbackModal]);

  const handleCourseSelect = async (courseId) => {
    if (!courseId) return;
    
    try {
      setFeedbackLoading(true);
      console.log('Selected course ID:', courseId);

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const [feedbacksRes, frequenciesRes] = await Promise.all([
        axiosInstance.get(`/api/admin/getFeedbacks/${courseId}`, config),
        axiosInstance.get(`/api/admin/getFeedbackFrequencies/${courseId}`, config)
      ]);

      console.log('API Responses:', {
        feedbacks: feedbacksRes.data,
        frequencies: frequenciesRes.data
      });

      setFeedbackData(frequenciesRes.data);
      setFeedbacks(feedbacksRes.data);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setMessage({ text: 'Error fetching feedback data', type: 'error' });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role?.toLowerCase() !== 'admin') {
        setMessage({ text: 'Authentication error. Please check your session.', type: 'error' });
        return;
      }

      if (!courseId) {
        setMessage({ text: 'Course ID is missing', type: 'error' });
        return;
      }

      await axiosInstance.delete(
        ENDPOINTS.ADMIN_DELETE_COURSE(courseId),
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      setMessage({ text: 'Course deleted successfully', type: 'success' });
      // Reset any related state
      setSelectedCourseForUpdate(null);
      setShowCourseForm(false);
      // Refresh the course list
      await fetchInitialData();
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error deleting course. Please try again.', 
        type: 'error' 
      });
    }
  };

  const fetchEmployeesByPosition = async (position) => {
    try {
      // Verify token and role
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role?.toLowerCase() !== 'admin') {
        setMessage({ text: 'Authentication error. Please check your session.', type: 'error' });
        return;
      }

      // Check required data
      if (!selectedRequest?.managerName) {
        setMessage({ text: 'Manager information is missing', type: 'error' });
        return;
      }

      console.log('Fetching employees with:', {
        managerName: selectedRequest.managerName,
        position: position
      });

      // Explicitly set the Authorization header
      const response = await axiosInstance.post(
        ENDPOINTS.ADMIN_GET_EMPLOYEES_BY_POSITION,
        {
          managerName: selectedRequest.managerName,
          position: position
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        console.log('Employees fetched:', response.data);
        setEmployees(response.data);
      } else {
        console.log('No employees found');
        setMessage({ text: 'No employees found for the selected position', type: 'warning' });
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error fetching employees. Please try again.', 
        type: 'error' 
      });
      setEmployees([]);
    }
  };

  const FeedbackModal = () => {
    if (!showFeedbackModal) return null;

    return (
      <div className="modal">
        <div className="modal-content feedback-modal">
          <h2>Course Feedbacks</h2>
          
          <div className="feedback-container">
            <div className="course-selector">
              <label>Select Course:</label>
              <select 
                value={selectedCourse || ''}
                onChange={(e) => {
                  const courseId = e.target.value ? parseInt(e.target.value, 10) : null;
                  if (courseId) {
                    setSelectedCourse(courseId);
                    handleCourseSelect(courseId);
                  }
                }}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {feedbackLoading ? (
              <div className="loading">Loading feedback data...</div>
            ) : selectedCourse && (
              <div className="feedback-content">
                {feedbackData && (
                  <div className="feedback-stats">
                    <h3>Rating Distribution</h3>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="rating-bar">
                        <span>{rating} ★</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill"
                            style={{ 
                              width: `${((feedbackData[rating] || 0) / 
                                Object.values(feedbackData).reduce((a, b) => a + b, 0)) * 100}%`,
                              backgroundColor: `hsl(${rating * 30}, 70%, 50%)`
                            }}
                          />
                        </div>
                        <span>{feedbackData[rating] || 0}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="feedback-list">
                  <h3>Feedback Comments ({feedbacks.length})</h3>
                  {feedbacks.length > 0 ? (
                    feedbacks.map(feedback => (
                      <div key={feedback.id} className="feedback-item">
                        <div className="feedback-header">
                          <span className="employee-name">{feedback.employeeName}</span>
                          <span className="rating">{feedback.rating} ★</span>
                        </div>
                        <p className="comments">{feedback.comments}</p>
                      </div>
                    ))
                  ) : (
                    <p>No feedback available for this course</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            className="admin-action-button"
            onClick={() => {
              setShowFeedbackModal(false);
              setSelectedCourse(null);
              setFeedbackData(null);
              setFeedbacks([]);
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="button-group">
          <button className="action-button" onClick={() => setShowPasswordModal(true)}>
            <i className="fas fa-key"></i> Change Password
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
      <div className="dashboard-main">
        <div className="welcome-section">
          <h1>Welcome back, <span className="user-name">Admin</span>! 👋</h1>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <i className="fas fa-users stat-icon"></i>
            <h3>Total Requests</h3>
            <p className="stat-number">{requests.length}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-book stat-icon"></i>
            <h3>Total Courses</h3>
            <p className="stat-number">{courses.length}</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-clock stat-icon"></i>
            <h3>Pending Requests</h3>
            <p className="stat-number">
              {requests.filter(r => r.status === 'PENDING').length}
            </p>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="create-button"
            onClick={() => setShowAddEmployeeForm(true)}
          >
            <i className="fas fa-user-plus"></i> Add Employee
          </button>
          <button 
            className="create-button"
            onClick={() => setShowCreatedCourses(true)}
          >
            <i className="fas fa-book"></i> View Created Courses
          </button>
          <button 
            className="create-button"
            onClick={() => setShowProgressModal(true)}
          >
            <i className="fas fa-chart-line"></i> Course Progress
          </button>
          <button 
            className="create-button"
            onClick={() => setShowFeedbackModal(true)}
          >
            <i className="fas fa-comments"></i> View Feedbacks
          </button>
        </div>

        {showAddEmployeeForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New {isManagerRegistration ? 'Manager' : 'Employee'}</h2>
              <form onSubmit={handleAddEmployee} className="form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={employeeForm.accountName}
                    onChange={(e) => setEmployeeForm({...employeeForm, accountName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Username"
                    value={employeeForm.userName}
                    onChange={(e) => setEmployeeForm({...employeeForm, userName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({...employeeForm, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Registration Type</label>
                  <select
                    className="form-control"
                    value={isManagerRegistration ? 'MANAGER' : 'EMPLOYEE'}
                    onChange={(e) => {
                      const isManager = e.target.value === 'MANAGER';
                      setIsManagerRegistration(isManager);
                      setEmployeeForm(prev => ({
                        ...prev,
                        role: e.target.value,
                        position: isManager ? '' : prev.position,
                        contact: isManager ? '' : prev.contact,
                        managerName: isManager ? '' : prev.managerName
                      }));
                    }}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                </div>

                {!isManagerRegistration && (
                  <>
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter position"
                        value={employeeForm.position}
                        onChange={(e) => setEmployeeForm({...employeeForm, position: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter contact"
                        value={employeeForm.contact}
                        onChange={(e) => setEmployeeForm({...employeeForm, contact: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Manager</label>
                      <select
                        className="form-control"
                        value={employeeForm.managerName}
                        onChange={(e) => setEmployeeForm({...employeeForm, managerName: e.target.value})}
                        required
                      >
                        <option value="">Select Manager</option>
                        {managers.map((manager, index) => (
                          <option key={index} value={manager}>{manager}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                
                <div className="modal-buttons">
                  <button type="submit" className="btn-primary">
                    Add {isManagerRegistration ? 'Manager' : 'Employee'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      setShowAddEmployeeForm(false);
                      setEmployeeForm({
                        accountName: '',
                        userName: '',
                        password: '',
                        email: '',
                        role: 'EMPLOYEE',
                        position: '',
                        contact: '',
                        managerName: ''
                      });
                      setIsManagerRegistration(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCreatedCourses && (
          <div className="modal">
            <div className="modal-content">
              <h2>Created Courses</h2>
              <div className="courses-list">
                {createdCourses.map((course) => (
                  <div key={course.courseId} className="course-card">
                    <h3>{course.courseName}</h3>
                    <p><strong>Duration:</strong> {course.duration}</p>
                    <p><strong>Key Concepts:</strong> {course.keyConcepts}</p>
                    <div className="course-actions">
                      <button
                        className="assign-button"
                        onClick={() => handleAssignFromCreatedCourses(course)}
                      >
                        <i className="fas fa-user-plus"></i> Assign Employees
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteCourse(course.courseId)}
                      >
                        <i className="fas fa-trash-alt"></i> Delete Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="close-button"
                onClick={() => setShowCreatedCourses(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="requests-list-container">
          <h2>Training Requests</h2>
          <div className="status-filter-container">
            <button 
              className={`filter-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All Requests
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('PENDING')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'APPROVED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('APPROVED')}
            >
              Approved
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'REJECTED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('REJECTED')}
            >
              Rejected
            </button>
          </div>
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Position</th>
                  <th>Required Employees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  // Find if a course exists for this request
                  const courseExists = courses.some(course => course.courseName === request.courseName);
                  
                  return (
                    <tr key={request.id}>
                      <td>{request.courseName}</td>
                      <td>{request.description}</td>
                      <td>{request.employeePosition}</td>
                      <td>{request.requiredEmployees}</td>
                      <td>{request.status}</td>
                      <td>
                        {request.status === 'PENDING' && (
                          <>
                            <button className="admin-action-button accept-button" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                            <button className="admin-action-button reject-button" onClick={() => handleRejectRequest(request.id)}>Reject</button>
                          </>
                        )}
                        {request.status === 'REJECTED' && (
                          <button 
                            className="admin-action-button re-evaluate-button"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            Re-evaluate
                          </button>
                        )}
                        {request.status === 'APPROVED' && !courseExists && (
                          <button 
                            className="admin-action-button create-course-button"
                            onClick={() => handleCreateCourseClick(request)}
                          >
                            Create Course
                          </button>
                        )}
                        {request.status === 'APPROVED' && courseExists && (
                          <>
                            <button 
                              className="admin-action-button"
                              onClick={() => handleDeleteCourse(courses.find(c => c.courseName === request.courseName)?.id)}
                            >
                              Delete Course
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showAssignForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Assign Course</h2>
              <form onSubmit={handleAssignCourse} className="form">
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={assignCourseForm.deadline}
                    onChange={(e) => setAssignCourseForm({
                      ...assignCourseForm,
                      deadline: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Select Employees {selectedRequest.requiredEmployeeCount > 0 && `(Required: ${selectedRequest.requiredEmployeeCount})`}</label>
                  <select 
                    className="employee-select"
                    value=""
                    onChange={(e) => {
                      const employeeId = parseInt(e.target.value);
                      if (employeeId) {
                        if (assignCourseForm.employeeIds.length >= selectedRequest.requiredEmployeeCount) {
                          setMessage({ 
                            text: `You can only select up to ${selectedRequest.requiredEmployeeCount} employee${selectedRequest.requiredEmployeeCount !== 1 ? 's' : ''}`, 
                            type: 'warning' 
                          });
                          return;
                        }
                        const newEmployeeIds = [...assignCourseForm.employeeIds, employeeId];
                        setAssignCourseForm({
                          ...assignCourseForm,
                          employeeIds: newEmployeeIds
                        });
                      }
                    }}
                  >
                    <option value="">Select an employee</option>
                    {employees.map(employee => (
                      <option 
                        key={employee.employeeId} 
                        value={employee.employeeId}
                        disabled={assignCourseForm.employeeIds.includes(employee.employeeId)}
                      >
                        {employee.userName} - {employee.position}
                      </option>
                    ))}
                  </select>

                  <div className="selected-employees">
                    <label>Selected Employees ({assignCourseForm.employeeIds.length} / {selectedRequest.requiredEmployeeCount})</label>
                    <div className="employees-list">
                      {assignCourseForm.employeeIds.map(id => {
                        const employee = employees.find(e => e.employeeId === id);
                        return (
                          <div key={id} className="selected-employee">
                            <span>{employee?.userName} - {employee?.position}</span>
                            <button 
                              type="button"
                              className="remove-employee-btn"
                              onClick={() => {
                                const newEmployeeIds = assignCourseForm.employeeIds.filter(eId => eId !== id);
                                setAssignCourseForm({
                                  ...assignCourseForm,
                                  employeeIds: newEmployeeIds
                                });
                              }}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="form-buttons">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={
                      !assignCourseForm.deadline || 
                      !assignCourseForm.employeeIds.length ||
                      (selectedRequest.requiredEmployeeCount > 0 && 
                       assignCourseForm.employeeIds.length !== selectedRequest.requiredEmployeeCount)
                    }
                  >
                    Assign Course
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowAssignForm(false);
                      setSelectedRequest(null);
                      setAssignCourseForm({
                        courseId: '',
                        deadline: '',
                        employeeIds: []
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCourseForm && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedCourseForUpdate ? 'Update Course' : 'Create Course'}</h2>
              <form onSubmit={handleSubmitCourseForm} className="form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={courseForm.courseName}
                    onChange={(e) => setCourseForm({...courseForm, courseName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Key Concepts"
                    value={courseForm.keyConcepts}
                    onChange={(e) => setCourseForm({...courseForm, keyConcepts: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Duration"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Outcomes"
                    value={courseForm.outcomes}
                    onChange={(e) => setCourseForm({...courseForm, outcomes: e.target.value})}
                    required
                  />
                </div>
                
                <div className="resources-section">
                  <h3>Resources</h3>
                  {courseForm.resources.map((resource, index) => (
                    <div key={index} className="resource-item">
                      <input
                        type="text"
                        placeholder="Resource Name"
                        value={resource.resourceName}
                        onChange={(e) => handleResourceChange(index, 'resourceName', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Resource Link"
                        value={resource.resourceLink}
                        onChange={(e) => handleResourceChange(index, 'resourceLink', e.target.value)}
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveResource(index)}
                          className="remove-resource-button"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddResource}
                    className="add-resource-button"
                  >
                    Add Resource
                  </button>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-button">Submit</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowCourseForm(false);
                      setSelectedCourseForUpdate(null);
                      setSelectedRequest(null);
                      setCourseForm({
                        courseId: '',
                        courseName: '',
                        keyConcepts: '',
                        duration: '',
                        resources: [{ resourceName: '', resourceLink: '' }],
                        outcomes: ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showProgressModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Course Progress Overview</h2>
              {progressLoading ? (
                <div className="loading">Loading progress data...</div>
              ) : courseProgresses && courseProgresses.length > 0 ? (
                <div className="progress-container">
                  {courseProgresses.map((course) => (
                    <div key={course.courseId} className="course-progress-item">
                      <h3>{course.courseName}</h3>
                      <div className="employee-progress-list">
                        {course.employees && course.employees.map((employee) => (
                          <div key={employee.employeeId} className="employee-progress">
                            <div className="employee-header">
                              <span className="employee-name">{employee.employeeName}</span>
                              <span className={`status-badge ${employee.completionPercentage === 100 ? 'completed' : 
                                employee.completionPercentage >= 75 ? 'near-complete' :
                                employee.completionPercentage >= 50 ? 'in-progress' :
                                employee.completionPercentage >= 25 ? 'started' : 'not-started'}`}>
                                {employee.completionPercentage === 100 ? 'Completed' :
                                 employee.completionPercentage >= 75 ? 'Almost Done' :
                                 employee.completionPercentage >= 50 ? 'In Progress' :
                                 employee.completionPercentage >= 25 ? 'Started' : 'Just Started'}
                              </span>
                            </div>
                            <div className="progress-details">
                              <div className="progress-bar-container">
                                <div 
                                  className={`progress-bar-fill ${
                                    employee.completionPercentage === 100 ? 'complete' :
                                    employee.completionPercentage >= 75 ? 'near-complete' :
                                    employee.completionPercentage >= 50 ? 'in-progress' :
                                    employee.completionPercentage >= 25 ? 'started' : 'not-started'
                                  }`}
                                  style={{ width: `${employee.completionPercentage}%` }}
                                >
                                  <span className="progress-text">
                                    {employee.completionPercentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="progress-dates">
                                <div className="date-item">
                                  <i className="fas fa-calendar-alt"></i>
                                  <span>Deadline: {new Date(employee.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="date-item">
                                  <i className="fas fa-clock"></i>
                                  <span>Updated: {new Date(employee.lastUpdatedDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No course progress data available</div>
              )}
              <div className="modal-actions">
                <button onClick={() => {
                  setShowProgressModal(false);
                  setCourseProgresses(null); // Reset state when closing
                }} className="close-button">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showFeedbackModal && (
          <FeedbackModal />
        )}

        {showPasswordModal && (
          <ChangePasswordModal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
          />
        )}

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;