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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Retry logic helper
const retryRequest = async (error, maxRetries = 2, delay = 1000) => {
  const config = error.config;
  
  // Only retry on 500 errors and if we haven't exceeded max retries
  if (!config || !error.response || error.response.status !== 500 || 
      config.__retryCount >= maxRetries) {
    return Promise.reject(error);
  }

  // Increment retry count
  config.__retryCount = config.__retryCount || 0;
  config.__retryCount++;

  // Wait before retrying
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Create new promise for retry
  return axiosInstance(config);
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Log error details for debugging
    console.error('API Error:', {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    // Try to retry 500 errors
    if (error.response?.status === 500) {
      try {
        return await retryRequest(error);
      } catch (retryError) {
        console.error('All retry attempts failed:', {
          endpoint: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        });
        return Promise.reject(retryError);
      }
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
  MANAGER_GET_CREATED_COURSES: '/api/manager/getCreatedCourses',

  // Admin endpoints 
  ADMIN_ADD_EMPLOYEE: '/api/admin/addEmployee',
  ADMIN_ADD_MANAGER: '/api/admin/addManager',
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
  ADMIN_GET_EMPLOYEES_BY_POSITION: '/api/admin/getAllEmployeesByPosition',
  ADMIN_GET_FEEDBACK_FREQUENCIES: '/api/admin/getFeedbackFrequencies',
  ADMIN_GET_FEEDBACK: (courseId) => `/api/admin/getFeedback/${courseId}`,
  ADMIN_GET_ALL_MANAGERS: '/api/admin/getAllManagers',
};

export const handleApiError = (error, setMessage) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  }
  return 'Network error occurred';
};