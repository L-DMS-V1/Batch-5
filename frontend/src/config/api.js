import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') 
        ? token 
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/user/login',
  REGISTER: '/api/user/register',

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
  ADMIN_GET_EMPLOYEES_BY_POSITION: (position) => `/api/admin/getAllEmployeesByPosition/${position}`
};

export const handleApiError = (error, setMessage) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  }
  return 'Network error occurred';
};