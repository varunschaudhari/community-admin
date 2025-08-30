const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'moderator' | 'member';
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
        token: string;
    };
    error?: string;
}

class ApiService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        return this.handleResponse<AuthResponse>(response);
    }

    async register(userData: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        return this.handleResponse<AuthResponse>(response);
    }

    async getProfile(): Promise<{ success: boolean; data: User }> {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        return this.handleResponse<{ success: boolean; data: User }>(response);
    }

    async validateToken(): Promise<{ success: boolean; data: User }> {
        const response = await fetch(`${API_BASE_URL}/auth/validate`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        return this.handleResponse<{ success: boolean; data: User }>(response);
    }

    async logout(): Promise<void> {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    // Health check
    async healthCheck(): Promise<{ success: boolean; message: string }> {
        const response = await fetch('http://localhost:5000/health');
        return this.handleResponse<{ success: boolean; message: string }>(response);
    }
}

export const apiService = new ApiService();
