import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('senja_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('senja_token');
            if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

// ===== AUTH =====
export const login = (data) => api.post('/auth/login', data);
export const changePassword = (data) => api.put('/auth/change-password', data);
export const getMe = () => api.get('/auth/me');

// ===== HERO =====
export const getHero = () => api.get('/hero');
export const updateHero = (formData) =>
    api.put('/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

// ===== MENU =====
export const getCategories = () => api.get('/menu/categories');
export const getMenuItems = (categoryId) =>
    api.get('/menu/items', { params: categoryId ? { category_id: categoryId } : {} });
export const getAllMenuItems = () => api.get('/menu/items/all');
export const createMenuItem = (formData) =>
    api.post('/menu/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const updateMenuItem = (id, formData) =>
    api.put(`/menu/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const deleteMenuItem = (id) => api.delete(`/menu/items/${id}`);

// ===== TESTIMONIALS =====
export const getTestimonials = () => api.get('/testimonials');
export const getAllTestimonials = () => api.get('/testimonials/all');
export const createTestimonial = (data) => api.post('/testimonials', data);
export const updateTestimonial = (id, data) => api.put(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

// ===== SETTINGS =====
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export default api;
