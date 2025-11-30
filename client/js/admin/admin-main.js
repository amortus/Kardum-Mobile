// admin-main.js - Entry point do Admin Panel
import * as CardsDB from '../data/cards-database.js';

class AdminPanel {
    constructor() {
        this.PASSWORD = 'iepepe01';
        this.isAuthenticated = false;
        this.currentCard = null;
        this.cards = [];
        this.filteredCards = [];

        this.init();
    }

    init() {
        // Check if already authenticated
        const auth = sessionStorage.getItem('admin_auth');
        if (auth === 'true') {
            this.isAuthenticated = true;
            this.showAdminPanel();
        } else {
            this.showLoginScreen();
        }

        this.setupLoginHandlers();
        this.setupAdminHandlers();
        this.loadCards();
    }

    // ===== AUTHENTICATION =====
    setupLoginHandlers() {
        const loginForm = document.getElementById('login-form');
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    handleLogin() {
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        if (password === this.PASSWORD) {
            this.isAuthenticated = true;
            sessionStorage.setItem('admin_auth', 'true');
            errorDiv.classList.add('hidden');
            this.showAdminPanel();
        } else {
            errorDiv.textContent = '❌ Senha incorreta!';
            errorDiv.classList.remove('hidden');
        }
    }

    showLoginScreen() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('admin-panel').classList.add('hidden');
    }

    showAdminPanel() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        this.renderCardsList();
    }

    // ===== ADMIN HANDLERS =====
    setupAdminHandlers() {
        // Logout
        document.getElementById('btn-logout')?.addEventListener('click', () => {
            this.logout();
        });

        // New Card
        document.getElementById('btn-new-card')?.addEventListener('click', () => {
            this.createNewCard();
        });

        // Save Card
        document.getElementById('btn-save-card')?.addEventListener('click', () => {
            this.saveCard();
        });

        // Delete Card
        document.getElementById('btn-delete-card')?.addEventListener('click', () => {
            this.deleteCard();
        });

        // Cancel Edit
        document.getElementById('btn-cancel-edit')?.addEventListener('click', () => {
            this.cancelEdit();
        });

        // Export/Import
        document.getElementById('btn-export')?.addEventListener('click', () => {
            this.exportCards();
        });

        document.getElementById('btn-import')?.addEventListener('click', () => {
            document.getElementById('import-file-input').click();
        });

        document.getElementById('import-file-input')?.addEventListener('change', (e) => {
            this.importCards(e.target.files[0]);
        });

        // Manual Backup
        document.getElementById('btn-manual-backup')?.addEventListener('click', () => {
            const name = prompt('Nome do Backup (opcional):');
            this.saveBackup(name || null);
        });

        // Filters
        document.getElementById('search-cards')?.addEventListener('input', () => {
            this.filterCards();
        });

        document.getElementById('filter-type')?.addEventListener('change', () => {
            this.filterCards();
        });

        document.getElementById('filter-race')?.addEventListener('change', () => {
            this.filterCards();
        });

        document.getElementById('filter-cost')?.addEventListener('change', () => {
            this.filterCards();
        });

        // Form changes for preview
        const form = document.getElementById('card-form');
        form?.addEventListener('input', () => {
            this.updatePreview();
        });

        // Type change para mostrar/ocultar stats
        document.getElementById('card-type')?.addEventListener('change', () => {
            this.toggleStatsSection();
        });
    }

    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('admin_auth');
        this.showLoginScreen();
        document.getElementById('password').value = '';
    }

    // ===== CARDS MANAGEMENT =====
    loadCards() {
        this.cards = [...CardsDB.CARDS_DATABASE];
        this.filteredCards = [...this.cards];
        this.renderCardsList();
        this.loadBackups();
    }

    // ===== BACKUP SYSTEM =====
    saveBackup(name = null) {
        const backupName = name || `Backup Automático - ${new Date().toLocaleString()}`;
        const backupData = {
            timestamp: Date.now(),
            name: backupName,
            cards: this.cards
        };

        let backups = JSON.parse(localStorage.getItem('kardum_backups') || '[]');
        backups.unshift(backupData);

        // Limit to 10 backups
        if (backups.length > 10) {
            backups = backups.slice(0, 10);
        }

        localStorage.setItem('kardum_backups', JSON.stringify(backups));
        this.loadBackups();
        if (name) this.showToast('💾 Backup manual salvo!', 'success');
    }

    loadBackups() {
        const container = document.getElementById('backup-list');
        if (!container) return; // Need to add this to HTML first

        const backups = JSON.parse(localStorage.getItem('kardum_backups') || '[]');
        container.innerHTML = '';

        if (backups.length === 0) {
            container.innerHTML = '<div style="color: #666; font-style: italic;">Nenhum backup encontrado</div>';
            return;
        }

        backups.forEach((backup, index) => {
            const item = document.createElement('div');
            item.className = 'backup-item';
            item.style.cssText = 'display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #333; align-items: center;';

            item.innerHTML = `
                <div style="font-size: 0.9rem;">
                    <div style="color: var(--admin-gold); font-weight: bold;">${backup.name}</div>
                    <div style="color: #888; font-size: 0.8rem;">${new Date(backup.timestamp).toLocaleString()} • ${backup.cards.length} cartas</div>
                </div>
                <button class="btn-restore" style="background: transparent; border: 1px solid #555; color: #aaa; padding: 4px 8px; cursor: pointer; border-radius: 4px;">Restaurar</button>
            `;

            item.querySelector('.btn-restore').addEventListener('click', () => {
                this.restoreBackup(backup);
            });

            container.appendChild(item);
        });
    }

    async restoreBackup(backup) {
        const confirmed = await this.showConfirm(
            'Restaurar Backup',
            `Restaurar "${backup.name}"? Isso substituirá as cartas atuais.`
        );

        if (confirmed) {
            this.cards = backup.cards;
            this.saveToDatabase();
            this.loadCards();
            this.showToast('✅ Backup restaurado com sucesso!', 'success');
        }
    }

    filterCards() {
        const search = document.getElementById('search-cards').value.toLowerCase();
        const type = document.getElementById('filter-type').value;
        const race = document.getElementById('filter-race').value;
        const cost = document.getElementById('filter-cost').value;

        this.filteredCards = this.cards.filter(card => {
            // Search
            if (search && !card.name.toLowerCase().includes(search) &&
                !card.text.toLowerCase().includes(search)) {
                return false;
            }

            // Type
            if (type !== 'all' && card.type !== type) {
                return false;
            }

            // Race
            if (race !== 'all' && card.race !== race) {
                return false;
            }

            // Cost
            if (cost !== 'all') {
                if (cost === '6' && card.cost < 6) return false;
                if (cost !== '6' && card.cost !== parseInt(cost)) return false;
            }

            return true;
        });

        this.renderCardsList();
    }

    renderCardsList() {
        const container = document.getElementById('cards-list');
        if (!container) return;

        container.innerHTML = '';

        if (this.filteredCards.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Nenhuma carta encontrada</div>';
            return;
        }

        this.filteredCards.forEach(card => {
            const item = document.createElement('div');
            item.className = 'card-list-item';
            if (this.currentCard && this.currentCard.id === card.id) {
                item.classList.add('active');
            }

            const typeLabels = {
                'general': 'General',
                'defender': 'Tropa',
                'equipment': 'Equip.',
                'ability': 'Magia'
            };

            item.innerHTML = `
                <div class="card-item-header">
                    <span class="card-item-name">${card.name}</span>
                    <span class="card-item-cost">💎 ${card.cost}</span>
                </div>
                <div class="card-item-meta">
                    <span>📦 ${typeLabels[card.type] || card.type}</span>
                    ${card.race ? `<span>⚔️ ${card.race}</span>` : ''}
                    ${card.attack !== undefined ? `<span>⚔️${card.attack} 🛡️${card.defense}</span>` : ''}
                </div>
            `;

            item.addEventListener('click', () => {
                this.editCard(card);
            });

            container.appendChild(item);
        });
    }

    // ===== CARD EDITOR =====
    createNewCard() {
        this.currentCard = {
            id: `card_${Date.now()}`,
            name: '',
            cost: 0,
            type: '',
            race: null,
            rarity: 'common',
            text: '',
            flavorText: '',
            attack: null,
            defense: null,
            health: null,
            artPath: null,
            portraitPath: null
        };

        this.showEditor(true);
        this.populateForm();
        this.updatePreview();
    }

    editCard(card) {
        this.currentCard = { ...card };
        this.showEditor(false);
        this.populateForm();
        this.updatePreview();
        this.renderCardsList(); // Update active state
    }

    showEditor(isNew) {
        document.getElementById('empty-state').classList.add('hidden');
        document.getElementById('card-editor').classList.remove('hidden');
        document.getElementById('editor-title').textContent = isNew ? 'Nova Carta' : 'Editar Carta';
        document.getElementById('btn-delete-card').classList.toggle('hidden', isNew);
    }

    hideEditor() {
        document.getElementById('empty-state').classList.remove('hidden');
        document.getElementById('card-editor').classList.add('hidden');
        this.currentCard = null;
        this.renderCardsList();
    }

    populateForm() {
        if (!this.currentCard) return;

        document.getElementById('card-name').value = this.currentCard.name || '';
        document.getElementById('card-cost').value = this.currentCard.cost || 0;
        document.getElementById('card-type').value = this.currentCard.type || '';
        document.getElementById('card-race').value = this.currentCard.race || '';
        document.getElementById('card-rarity').value = this.currentCard.rarity || 'common';
        document.getElementById('card-text').value = this.currentCard.text || '';
        document.getElementById('card-flavor').value = this.currentCard.flavorText || '';
        document.getElementById('card-attack').value = this.currentCard.attack || '';
        document.getElementById('card-defense').value = this.currentCard.defense || '';
        document.getElementById('card-health').value = this.currentCard.health || '';
        document.getElementById('card-art-path').value = this.currentCard.artPath || '';
        document.getElementById('card-portrait-path').value = this.currentCard.portraitPath || '';

        this.toggleStatsSection();
    }

    toggleStatsSection() {
        const type = document.getElementById('card-type').value;
        const statsSection = document.getElementById('stats-section');

        // Stats são relevantes para Generais e Tropas
        if (type === 'general' || type === 'defender') {
            statsSection.style.display = 'block';
        } else {
            statsSection.style.display = 'none';
        }
    }

    getFormData() {
        const attack = document.getElementById('card-attack').value;
        const defense = document.getElementById('card-defense').value;
        const health = document.getElementById('card-health').value;

        return {
            ...this.currentCard,
            name: document.getElementById('card-name').value,
            cost: parseInt(document.getElementById('card-cost').value) || 0,
            type: document.getElementById('card-type').value,
            race: document.getElementById('card-race').value || null,
            rarity: document.getElementById('card-rarity').value,
            text: document.getElementById('card-text').value,
            flavorText: document.getElementById('card-flavor').value,
            attack: attack ? parseInt(attack) : null,
            defense: defense ? parseInt(defense) : null,
            health: health ? parseInt(health) : null,
            artPath: document.getElementById('card-art-path').value || null,
            portraitPath: document.getElementById('card-portrait-path').value || null
        };
    }

    saveCard() {
        const cardData = this.getFormData();

        // Validation
        if (!cardData.name || !cardData.type) {
            this.showToast('❌ Preencha os campos obrigatórios!', 'error');
            return;
        }

        // Find and update or add new
        const index = this.cards.findIndex(c => c.id === cardData.id);
        if (index >= 0) {
            this.cards[index] = cardData;
            this.showToast('✅ Carta atualizada com sucesso!', 'success');
        } else {
            this.cards.push(cardData);
            this.showToast('✅ Nova carta criada com sucesso!', 'success');
        }

        // Update database (this is a simplified version - in real app would save to backend)
        this.saveToDatabase();
        this.loadCards();
        this.hideEditor();
    }

    async deleteCard() {
        const confirmed = await this.showConfirm(
            'Deletar Carta',
            `Tem certeza que deseja deletar "${this.currentCard.name}"?`
        );

        if (confirmed) {
            this.cards = this.cards.filter(c => c.id !== this.currentCard.id);
            this.saveToDatabase();
            this.loadCards();
            this.hideEditor();
            this.showToast('🗑️ Carta deletada!', 'info');
        }
    }

    cancelEdit() {
        this.hideEditor();
    }

    // ===== PREVIEW =====
    updatePreview() {
        const cardData = this.getFormData();
        const container = document.getElementById('card-preview');

        // Aqui você usaria a mesma função createCardElement do jogo
        // Por enquanto, vou criar um placeholder
        container.innerHTML = `
            <div style="
                width: 280px;
                aspect-ratio: 5/7;
                background: linear-gradient(135deg, #2B1810 0%, #1a0f0a 100%);
                border: 3px solid var(--admin-gold);
                border-radius: 12px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                color: white;
            ">
                <div style="text-align: center; font-weight: bold; font-size: 1.2rem; color: var(--admin-gold);">
                    ${cardData.name || 'Nome da Carta'}
                </div>
                <div style="text-align: center;">
                    ${cardData.type || 'Tipo'} ${cardData.race ? `| ${cardData.race}` : ''}
                </div>
                <div style="font-size: 0.85rem; line-height: 1.4;">
                    ${cardData.text || 'Texto da carta...'}
                </div>
                ${cardData.attack !== null ? `
                    <div style="display: flex; justify-content: space-around; font-size: 1.1rem;">
                        <span>⚔️ ${cardData.attack || 0}</span>
                        <span>🛡️ ${cardData.defense || 0}</span>
                        ${cardData.health !== null ? `<span>❤️ ${cardData.health || 0}</span>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ===== IMPORT/EXPORT =====
    exportCards() {
        const dataStr = JSON.stringify(this.cards, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `kardum-cards-${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showToast('📥 Cartas exportadas!', 'success');
    }

    async importCards(file) {
        if (!file) return;

        try {
            const text = await file.text();
            const importedCards = JSON.parse(text);

            if (!Array.isArray(importedCards)) {
                throw new Error('Formato inválido');
            }

            const confirmed = await this.showConfirm(
                'Importar Cartas',
                `Importar ${importedCards.length} cartas? Isso substituirá todas as cartas atuais.`
            );

            if (confirmed) {
                this.cards = importedCards;
                this.saveToDatabase();
                this.loadCards();
                this.showToast(`✅ ${importedCards.length} cartas importadas!`, 'success');
            }
        } catch (error) {
            this.showToast('❌ Erro ao importar arquivo!', 'error');
        }
    }

    // ===== STORAGE =====
    // ===== STORAGE =====
    saveToDatabase() {
        // This is a placeholder - in real app would save to backend
        // For now, just save to localStorage
        localStorage.setItem('kardum_admin_cards', JSON.stringify(this.cards));
        console.log('Cards saved to localStorage');
        this.saveBackup(); // Auto-backup on save
    }

    // ===== UI HELPERS =====
    showToast(message, type = 'info') {
        const container = document.getElementById('admin-toast-container');
        const toast = document.createElement('div');
        toast.className = `admin-toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showConfirm(title, message) {
        return new Promise((resolve) => {
            const modal = document.getElementById('admin-confirm-modal');
            document.getElementById('admin-confirm-title').textContent = title;
            document.getElementById('admin-confirm-message').textContent = message;

            const yesBtn = document.getElementById('admin-confirm-yes');
            const noBtn = document.getElementById('admin-confirm-no');

            const handleYes = () => {
                cleanup();
                resolve(true);
            };

            const handleNo = () => {
                cleanup();
                resolve(false);
            };

            const cleanup = () => {
                modal.classList.remove('active');
                yesBtn.removeEventListener('click', handleYes);
                noBtn.removeEventListener('click', handleNo);
            };

            yesBtn.addEventListener('click', handleYes);
            noBtn.addEventListener('click', handleNo);

            modal.classList.add('active');
        });
    }
}

// Initialize Admin Panel
const adminPanel = new AdminPanel();
