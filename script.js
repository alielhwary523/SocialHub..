const API_BASE = 'https://route-posts.routemisr.com/';

const apiCall = async (method, endpoint, body = null) => {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(API_BASE + endpoint, options);
  const data = await res.json();

  if (!res.ok) throw data.message || data || 'حدث خطأ غير متوقع';
  return data;
};

// Auth
const signup = (data) => apiCall('POST', 'users/signup', data);
const login = (data) => apiCall('POST', 'users/signin', data);

// Posts
const getPosts = () => apiCall('GET', 'posts/feed').then(res => res.data?.posts || []);
const getSinglePost = (id) => apiCall('GET', `posts/${id}`).then(res => res.data?.post || res.data);

const createNewPost = (data) => apiCall('POST', 'posts', data);
const updatePost = (id, data) => apiCall('PUT', `posts/${id}`, data);
const deletePostAPI = (id) => apiCall('DELETE', `posts/${id}`);

// Comments
const getComments = (postId) => apiCall('GET', `posts/${postId}/comments`).then(res => res.data?.comments || []);
const createComment = (postId, data) => apiCall('POST', `posts/${postId}/comments`, data);
const updateComment = (postId, commentId, data) => apiCall('PUT', `posts/${postId}/comments/${commentId}`, data);
const deleteCommentAPI = (postId, commentId) => apiCall('DELETE', `posts/${postId}/comments/${commentId}`);

// Profile
const getProfile = () => apiCall('GET', 'users/profile-data').then(res => res.data?.user);
const changePassword = (data) => apiCall('PATCH', 'users/change-password', data);

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

const showError = (msg) => alert(msg || 'حدث خطأ');

// Auth Guard محسن
const checkAuth = () => {
  const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('signup');
  if (!localStorage.getItem('token') && !isAuthPage) {
    window.location.href = 'login.html';
  }
  if (localStorage.getItem('token') && isAuthPage) {
    window.location.href = 'home.html';
  }
};

checkAuth();