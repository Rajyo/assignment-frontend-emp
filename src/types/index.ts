// Interfaces

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserCardProps {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string; 
  setLocalUsers: React.Dispatch<React.SetStateAction<User[]>>;
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}