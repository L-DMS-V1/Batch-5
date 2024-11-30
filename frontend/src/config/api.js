import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Add Bearer prefix if not present
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log('Request config:', {
        url: config.url,
        method: config.method,
        headers: config.headers
      });
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', {
        url: error.config.url,
        headers: error.config.headers,
        response: error.response.data
      });
      
    }
    return Promise.reject(error);
  }
);

export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/user/login',
  REGISTER: '/api/user/register',
  SET_PASSWORD: '/api/user/setPassword',

  // Employee endpoints
  EMPLOYEE_GET_COURSES: '/api/employee/getCourses',
  EMPLOYEE_GET_COURSE: (courseId) => `/api/employee/getCourse/${courseId}`,
  EMPLOYEE_MARK_COMPLETED: (resourceId) => `/api/employee/${resourceId}/completed`,
  EMPLOYEE_MARK_NOT_COMPLETED: (resourceId) => `/api/employee/${resourceId}/notCompleted`,
  EMPLOYEE_SUBMIT_FEEDBACK: (courseId, assignmentId) => `/api/employee/feedback/${courseId}/${assignmentId}`,
  EMPLOYEE_GET_FEEDBACKS: (courseId) => `/api/employee/getFeedbacks/${courseId}`,

  // Manager endpoints 
  MANAGER_CREATE_REQUEST: '/api/manager/createCourseRequest',
  MANAGER_GET_REQUESTS: '/api/manager/getCourseRequests',
  MANAGER_GET_REQUEST_BY_ID: (id) => `/api/manager/getCourseRequest/${id}`,
  MANAGER_GET_POSITIONS: '/api/manager/getAllPositions',

  // Admin endpoints 
  ADMIN_ADD_EMPLOYEE: '/api/admin/addEmployee',
  ADMIN_ACCEPT_REQUEST: (id) => `/api/admin/acceptRequest/${id}`,
  ADMIN_REJECT_REQUEST: (id) => `/api/admin/rejectRequest/${id}`,
  ADMIN_GET_ALL_REQUESTS: '/api/admin/getAllRequests',
  ADMIN_CREATE_COURSE: '/api/admin/course/create',
  ADMIN_ASSIGN_COURSE: '/api/admin/course/assign',
  ADMIN_DELETE_COURSE: (courseId) => `/api/admin/course/${courseId}/delete`,
  ADMIN_UPDATE_COURSE: (courseId) => `/api/admin/course/update/${courseId}`,
  ADMIN_GET_ALL_COURSES: '/api/admin/getAllCourses',
  ADMIN_GET_COURSE: (courseId) => `/api/admin/getCourse/${courseId}`,
  ADMIN_GET_PROGRESSES: '/api/admin/getProgresses',
  ADMIN_GET_EMPLOYEES_BY_POSITION: (position) => `/api/admin/getAllEmployeesByPosition/${position}`,
  ADMIN_GET_FEEDBACKS: '/api/admin/getFeedbacks',
  ADMIN_GET_FEEDBACK_FREQUENCIES: '/api/admin/getFeedbackFrequencies',
  ADMIN_GET_FEEDBACK: (courseId) => `/api/admin/getFeedback/${courseId}`
};

export const handleApiError = (error, setMessage) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  }
  return 'Network error occurred';
};