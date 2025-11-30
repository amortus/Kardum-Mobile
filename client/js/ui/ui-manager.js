// ui-manager.js - Sistema de UI (Modal + Toast + Confirm)

class UIManager {
    constructor() {
        this.cardModal = null;
        this.toastContainer = null;
        this.confirmModal = null;
        this.currentCard = null;
        this.onAddCallback = null;

        this.init();
    }

    init() {
        // Card Modal
        this.cardModal = document.getElementById('card-modal');
        this.toastContainer = document.getElementById('toast-container');
        this.confirmModal = document.getElementById('confirm-modal');

        // Botões do modal de carta
        document.getElementById('card-modal-close')?.addEventListener('click', () => {
            this.closeCardModal();
        });

        document.getElementById('card-modal-add')?.addEventListener('click', () => {
            if (this.onAddCallback && this.currentCard) {
                this.onAddCallback(this.currentCard);
            }
        });

        // Fechar modal clicando fora
        this.cardModal?.addEventListener('click', (e) => {
            if (e.target === this.cardModal) {
                this.closeCardModal();
            }
        });

        // Confirm modal buttons
        document.getElementById('confirm-btn-no')?.addEventListener('click', () => {
            this.closeConfirm(false);
        });

        this.confirmModal?.addEventListener('click', (e) => {
            if (e.target === this.confirmModal) {
                this.closeConfirm(false);
            }
        });
    }

    /**
     * Abre modal de carta fullscreen
     * @param {Object} card - Dados da carta
     * @param {Function} onAdd - Callback ao clicar em adicionar
     * @param {Object} game - Instância do jogo para criar elemento da carta
     * @param {number} currentCount - Quantidade atual no deck
     */
    showCardModal(card, onAdd, game, currentCount = 0) {
        this.currentCard = card;
        this.onAddCallback = onAdd;

        // Renderizar carta
        const cardContainer = document.getElementById('card-modal-card-container');
        cardContainer.innerHTML = '';
        const cardElement = game.createCardElement(card);
        cardContainer.appendChild(cardElement);

        // Renderizar informações
        const infoContainer = document.getElementById('card-modal-info');
        const maxCopies = 3;
        const canAdd = currentCount < maxCopies;

        infoContainer.innerHTML = `
            <h3>${card.name}</h3>
            <div class="card-modal-meta">
                <span>💎 ${card.cost} Mana</span>
                <span>📦 ${card.type}</span>
                ${card.race ? `<span>⚔️ ${card.race}</span>` : ''}
            </div>
            <div class="card-modal-text">${card.text}</div>
            ${card.attack !== undefined ? `
                <div class="card-modal-stats">
                    <span>⚔️ ATK: ${card.attack}</span>
                    <span>🛡️ DEF: ${card.defense}</span>
                </div>
            ` : ''}
            <div class="card-modal-count">
                ${currentCount > 0 ? `Você tem ${currentCount}x no deck` : 'Não está no deck'}
                ${!canAdd ? '<br><strong>Limite máximo atingido (3 cópias)</strong>' : ''}
            </div>
        `;

        // Habilitar/desabilitar botão adicionar
        const addBtn = document.getElementById('card-modal-add');
        addBtn.disabled = !canAdd;

        // Abrir modal
        this.cardModal.classList.add('active');
    }

    closeCardModal() {
        this.cardModal.classList.remove('active');
        this.currentCard = null;
        this.onAddCallback = null;
    }

    /**
     * Mostra toast de notificação
     * @param {string} message - Mensagem
     * @param {string} type - success|error|warning|info
     * @param {number} duration - Duração em ms (padrão 3000)
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const titles = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Atenção',
            info: 'Informação'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        // Auto remover
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    /**
     * Mostra modal de confirmação customizado
     * @param {string} title - Título
     * @param {string} message - Mensagem
     * @returns {Promise<boolean>}
     */
    showConfirm(title, message) {
        return new Promise((resolve) => {
            document.getElementById('confirm-modal-title').textContent = title;
            document.getElementById('confirm-modal-message').textContent = message;

            const yesBtn = document.getElementById('confirm-btn-yes');

            // Remover listeners antigos
            const newYesBtn = yesBtn.cloneNode(true);
            yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);

            newYesBtn.addEventListener('click', () => {
                this.closeConfirm(true);
                resolve(true);
            });

            this.confirmResolve = resolve;
            this.confirmModal.classList.add('active');
        });
    }

    closeConfirm(result) {
        this.confirmModal.classList.remove('active');
        if (this.confirmResolve) {
            this.confirmResolve(result);
            this.confirmResolve = null;
        }
    }
}

// Exportar instância única
export const uiManager = new UIManager();
