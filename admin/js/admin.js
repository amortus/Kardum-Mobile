// admin/js/admin.js - JavaScript da Dashboard Admin
class AdminDashboard {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.cards = [];
        this.users = [];

        this.init();
    }

    init() {
        // Setup event listeners
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('btn-logout')?.addEventListener('click', () => this.logout());
        document.getElementById('btn-new-card')?.addEventListener('click', () => this.showCardForm());
        document.getElementById('btn-cancel-card')?.addEventListener('click', () => this.hideCardForm());
        document.getElementById('card-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCard();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Check if already logged in
        const token = localStorage.getItem('admin_token');
        if (token) {
            this.isAuthenticated = true;
            this.showDashboard();
            this.loadData();
        }
    }

    async login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('login-error');

        // Temporary hardcoded check (in production, use server-side auth)
        if (username === 'admin' && password === 'admin123') {
            this.isAuthenticated = true;
            this.currentUser = { username: 'admin', isAdmin: true };
            localStorage.setItem('admin_token', 'temp_token');

            errorEl.textContent = '';
            this.showDashboard();
            this.loadData();
        } else {
            errorEl.textContent = 'Usuário ou senha incorretos';
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('admin_token');

        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('login-screen').style.display = 'flex';
    }

    showDashboard() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').classList.remove('hidden');
    }

    showPage(pageName) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');

        // Show page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`page-${pageName}`)?.classList.add('active');

        // Load page-specific data
        if (pageName === 'cards') {
            this.loadCards();
        } else if (pageName === 'users') {
            this.loadUsers();
        }
    }

    async loadData() {
        this.loadOverview();
        this.loadCards();
        this.loadUsers();
    }

    loadOverview() {
        // Mock data - em produção, buscar do servidor
        document.getElementById('total-users').textContent = '15';
        document.getElementById('total-matches').textContent = '238';
        document.getElementById('total-cards').textContent = '45';
        document.getElementById('active-players').textContent = '8';
    }

    loadCards() {
        // Mock data - em produção, fetch do servidor
        this.cards = [
            { id: 'gen_001', name: 'Rei Marcus', type: 'general', race: 'human', cost: 0, attack: 0, defense: 30 },
            { id: 'def_001', name: 'Soldado Humano', type: 'defender', race: 'human', cost: 2, attack: 2, defense: 3 },
            { id: 'eq_001', name: 'Espada de Ferro', type: 'equipment', race: 'human', cost: 2, attack: 2, defense: 0 }
        ];

        const tbody = document.querySelector('#cards-list tbody');
        tbody.innerHTML = '';

        this.cards.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${card.id}</td>
        <td>${card.name}</td>
        <td>${card.type}</td>
        <td>${card.race || '-'}</td>
        <td>${card.cost}</td>
        <td>${card.attack ?? '-'}</td>
        <td>${card.defense ?? '-'}</td>
        <td>
          <button class="btn-edit" onclick="adminDashboard.editCard('${card.id}')">Editar</button>
          <button class="btn-danger" onclick="adminDashboard.deleteCard('${card.id}')">Deletar</button>
        </td>
      `;
            tbody.appendChild(tr);
        });
    }

    loadUsers() {
        // Mock data
        this.users = [
            { id: 1, username: 'player1', elo_casual: 1200, elo_ranked: 1100, total_matches: 45, wins: 25, created_at: '2024-01-15' },
            { id: 2, username: 'player2', elo_casual: 1150, elo_ranked: 1050, total_matches: 32, wins: 18, created_at: '2024-01-20' }
        ];

        const tbody = document.querySelector('#users-list tbody');
        tbody.innerHTML = '';

        this.users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.elo_casual}</td>
        <td>${user.elo_ranked}</td>
        <td>${user.total_matches}</td>
        <td>${user.wins}</td>
        <td>${user.created_at}</td>
      `;
            tbody.appendChild(tr);
        });
    }

    showCardForm(card = null) {
        const modal = document.getElementById('card-form-modal');
        const form = document.getElementById('card-form');
        const title = document.getElementById('modal-title');

        if (card) {
            title.textContent = 'Editar Carta';
            // Populate form
            form.elements['id'].value = card.id;
            form.elements['name'].value = card.name;
            form.elements['type'].value = card.type;
            form.elements['race'].value = card.race || '';
            form.elements['cost'].value = card.cost;
            form.elements['attack'].value = card.attack ?? '';
            form.elements['defense'].value = card.defense ?? '';
            form.elements['text'].value = card.text || '';
        } else {
            title.textContent = 'Nova Carta';
            form.reset();
        }

        modal.classList.remove('hidden');
    }

    hideCardForm() {
        document.getElementById('card-form-modal').classList.add('hidden');
    }

    saveCard() {
        const form = document.getElementById('card-form');
        const formData = new FormData(form);
        const card = {};

        for (let [key, value] of formData.entries()) {
            card[key] = value;
        }

        console.log('Saving card:', card);

        // Em produção, enviar para o servidor
        alert('Carta salva com sucesso!');
        this.hideCardForm();
        this.loadCards();
    }

    editCard(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (card) {
            this.showCardForm(card);
        }
    }

    deleteCard(cardId) {
        if (confirm('Deseja realmente deletar esta carta?')) {
            console.log('Deleting card:', cardId);
            // Em produção, enviar DELETE para o servidor
            alert('Carta deletada!');
            this.loadCards();
        }
    }
}

// Initialize
const adminDashboard = new AdminDashboard();
window.adminDashboard = adminDashboard;
