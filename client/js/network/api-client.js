// client/js/network/api-client.js - Cliente HTTP para API REST
import authManager from '../auth/auth-manager.js';

const API_BASE_URL = window.location.origin;

class ApiClient {
    /**
     * Fazer requisição HTTP autenticada
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = authManager.getToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Se token inválido, fazer logout
                if (response.status === 401 || response.status === 403) {
                    authManager.logout();
                    window.location.reload();
                }
                throw new Error(data.error || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Singleton instance
const apiClient = new ApiClient();

export default apiClient;

