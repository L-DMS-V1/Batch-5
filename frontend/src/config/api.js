export const API_BASE_URL = 'http://localhost:8080'; // Update to your local backend URL

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/user/login`,
  REGISTER: `${API_BASE_URL}/api/user/register`,
  EMPLOYEE_DASHBOARD: `${API_BASE_URL}/api/employee/dashboard`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  MANAGER_DASHBOARD: `${API_BASE_URL}/api/manager/dashboard`, 
};
