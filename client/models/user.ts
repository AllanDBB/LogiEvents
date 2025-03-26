export type User = {
  id: string;
  name: string;
  lastname: string;
  fullname?: string;
  email: string;
  role: userRole;
  studentId?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
};
  
export type userRole = 'user' | 'admin';

export type UserUpdateData = Partial<Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>>;