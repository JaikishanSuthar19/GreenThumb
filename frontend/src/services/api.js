import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('greenthumb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth Endpoints
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

// Plant Endpoints
export const getPlants = async () => {
  const response = await api.get('/plants');
  return response.data;
};

export const getPlantById = async (id) => {
  const response = await api.get(`/plants/${id}`);
  return response.data;
};

export const createPlant = async (formData) => {
  // If formData is FormData instance (for image file upload)
  const isFormData = formData instanceof FormData;
  const response = await api.post('/plants', formData, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

export const updatePlant = async (id, formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.put(`/plants/${id}`, formData, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

export const deletePlant = async (id) => {
  const response = await api.delete(`/plants/${id}`);
  return response.data;
};

export const searchPlants = async (keyword) => {
  const response = await api.get(`/plants/search?keyword=${encodeURIComponent(keyword)}`);
  return response.data;
};

export const identifyPlant = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.post('/plants/identify', formData, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

export const getSpeciesCatalog = async () => {
  const response = await api.get('/plants/catalog');
  return response.data;
};

// Community Post Endpoints
export const getPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (formData) => {
  const isFormData = formData instanceof FormData;
  const response = await api.post('/posts', formData, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

export const addComment = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comment`, { text });
  return response.data;
};

export const toggleLikePost = async (postId) => {
  const response = await api.put(`/posts/${postId}/like`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

// Reminder Endpoints
export const createReminder = async (reminderData) => {
  const response = await api.post('/reminders', reminderData);
  return response.data;
};

export const getMyReminders = async () => {
  const response = await api.get('/reminders');
  return response.data;
};

export const getRemindersByUserId = async (userId) => {
  const response = await api.get(`/reminders/user/${userId}`);
  return response.data;
};

export const updateReminder = async (id, updateData) => {
  const response = await api.put(`/reminders/${id}`, updateData);
  return response.data;
};

export const deleteReminder = async (id) => {
  const response = await api.delete(`/reminders/${id}`);
  return response.data;
};

export default api;
