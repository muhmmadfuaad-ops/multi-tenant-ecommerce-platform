// src/users/interfaces/user.interface.ts
export interface User {
  id: number;
  name: string;
  email: string;
  // optional fields
  phoneNumber?: string;
  role?: 'admin' | 'customer';
  createdAt?: Date;
}
