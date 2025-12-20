// client/js/auth/auth-manager.js - Gerenciador de autenticação
const API_BASE_URL = window.location.origin;

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('kardum_token');
        this.user = null;
        this.loadUserFromStorage();
    }

    /**
     * Carregar usuário do localStorage
     */
    loadUserFromStorage() {
        const userStr = localStorage.getItem('kardum_user');
        if (userStr) {
            try {
                this.user = JSON.parse(userStr);
            } catch (e) {
                console.error('Error loading user from storage:', e);
                this.user = null;
            }
        }
    }

    /**
     * Fazer login
     */
    async login(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Erro ao fazer login');
            }

            // Salvar token e usuário
            this.token = data.data.token;
            this.user = data.data.user;
            localStorage.setItem('kardum_token', this.token);
            localStorage.setItem('kardum_user', JSON.stringify(this.user));

            return { success: true, user: this.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Criar conta
     */
    async register(username, email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Erro ao criar conta');
            }

            // Salvar token e usuário
            this.token = data.data.token;
            this.user = data.data.user;
            localStorage.setItem('kardum_token', this.token);
            localStorage.setItem('kardum_user', JSON.stringify(this.user));

            return { success: true, user: this.user };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Fazer logout
     */
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('kardum_token');
        localStorage.removeItem('kardum_user');
    }

    /**
     * Obter usuário atual
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Verificar se está autenticado
     */
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    /**
     * Obter token
     */
    getToken() {
        return this.token;
    }

    /**
     * Atualizar dados do usuário do servidor
     */
    async refreshUser() {
        if (!this.token) {
            return { success: false, error: 'Não autenticado' };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (!data.success) {
                // Token inválido
                this.logout();
                return { success: false, error: data.error };
            }

            this.user = data.data;
            localStorage.setItem('kardum_user', JSON.stringify(this.user));

            return { success: true, user: this.user };
        } catch (error) {
            console.error('Refresh user error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Singleton instance
const authManager = new AuthManager();

export default authManager;

