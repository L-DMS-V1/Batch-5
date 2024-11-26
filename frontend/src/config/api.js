export const ENDPOINTS = {
  LOGIN: '/api/user/login',
  REGISTER: '/api/user/register',
  MANAGER_REQUEST: '/api/manager/createCourseRequest',
  GET_MANAGER_REQUESTS: '/api/manager/getCourseRequests',
  ADMIN_GET_REQUESTS: '/api/admin/getAllRequests',
  ADMIN_CREATE_COURSE: (id) => '/api/admin/acceptRequest/${id}'
};