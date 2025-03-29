import { User } from './types';

let users: User[] = [];

// Get users
export const getUsers = () => users;

// Set users
export const setUsers = (newUsers: User[]) => {
  users = newUsers;
};

// Update user
export const updateUser = (id: number, updatedUser: Partial<User>) => {
  users = users.map(user => 
    user.id === id ? { ...user, ...updatedUser } : user
  );
};

// Delete user
export const deleteUser = (id: number) => {
  users = users.filter(user => user.id !== id);
};