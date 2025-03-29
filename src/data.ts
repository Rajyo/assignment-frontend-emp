import { User } from './types';

let users: User[] = [];

export const getUsers = () => users;

export const setUsers = (newUsers: User[]) => {
  users = newUsers;
};

export const updateUser = (id: number, updatedUser: Partial<User>) => {
  users = users.map(user => 
    user.id === id ? { ...user, ...updatedUser } : user
  );
};

export const deleteUser = (id: number) => {
  users = users.filter(user => user.id !== id);
};