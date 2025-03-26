export type User = {
  id: string;
  name: string;
  lastname: string;
  fullname?: string;
  email: string;
  role: userRole;
  phone?: string;
  profileImage?: string;
};
  
export type userRole = 'user' | 'admin';

export type UserUpdateData = Partial<Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>>;