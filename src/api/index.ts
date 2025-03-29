import axios from 'axios';
import { LoginCredentials, LoginResponse, UsersResponse, User } from '../types';

// Base URL
const BASE_URL = 'https://reqres.in/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
export const login = async (credentials: LoginCredentials) => {
  const response = await api.post<LoginResponse>('/login', credentials);
  return response.data;
};

// Get users
export const getUsers = async (page: number) => {
  const response = await api.get<UsersResponse>(`/users?page=${page}`);
  return response.data;
};

// Update user
export const updateUserApi = async (id: number, userData: Partial<User>) => {
  const response = await api.put<User>(`/users/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUserApi = async (id: number) => {
  await api.delete(`/users/${id}`);
};