// Mock Authentication Service - Replace with actual JWT auth

import { Admin } from '@/types/complaint';
import { mockAdmins } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock credentials for demo
const validCredentials = [
  { email: 'admin@university.edu', password: 'admin123', role: 'admin' as const },
  { email: 'staff@university.edu', password: 'staff123', role: 'staff' as const },
];

interface AuthResult {
  success: boolean;
  admin?: Admin;
  token?: string;
  error?: string;
}

// Simple token storage (in real app, use secure storage)
let currentToken: string | null = null;
let currentAdmin: Admin | null = null;

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    await delay(800);
    
    const credential = validCredentials.find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );
    
    if (!credential) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    const admin = mockAdmins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!admin) {
      return { success: false, error: 'Admin not found' };
    }
    
    // Generate mock JWT token
    const token = btoa(JSON.stringify({ 
      adminId: admin.id, 
      email: admin.email, 
      role: admin.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    
    currentToken = token;
    currentAdmin = admin;
    
    // Store in localStorage for persistence
    localStorage.setItem('auth_token', token);
    localStorage.setItem('admin_data', JSON.stringify(admin));
    
    return { success: true, admin, token };
  },
  
  async logout(): Promise<void> {
    await delay(200);
    currentToken = null;
    currentAdmin = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_data');
  },
  
  async getCurrentAdmin(): Promise<Admin | null> {
    // Check stored token
    const token = localStorage.getItem('auth_token');
    const adminData = localStorage.getItem('admin_data');
    
    if (!token || !adminData) {
      return null;
    }
    
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        // Token expired
        await this.logout();
        return null;
      }
      
      return JSON.parse(adminData);
    } catch {
      return null;
    }
  },
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  },
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};
