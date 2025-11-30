// deck-builder.js - Lógica do construtor de decks
import * as CardsDB from '../data/cards-database.js';
import { uiManager } from './ui-manager.js';

export class DeckBuilder {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.currentDeck = {
            name: 'Novo Deck',
            general: null,
            cards: [] // Array of card IDs
        };
        this.filters = {
            mana: 'all',
            type: 'all',
            race: 'all',
            search: ''
        };
        this.currentPage = 1;
        this.itemsPerPage = 10;

        this.setupListeners();
    }

    setupListeners() {
        // Botão do Menu Principal
        document.getElementById('btn-deck-builder')?.addEventListener('click', () => {
            this.showGeneralSelection();
        });

        // Botão Voltar da Seleção
        document.getElementById('btn-back-from-deck-select')?.addEventListener('click', () => {
            this.game.showScreen('main-menu');
        });

        // Filtros de Mana
        document.getElementById('mana-filters')?.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('#mana-filters button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.mana = e.target.dataset.cost;
                this.renderCollection();
            }
        });

        // Filtros de Tipo
        document.querySelectorAll('.type-filters button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-filters button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.type = e.target.dataset.type;
                this.renderCollection();
            });
        });

        // Filtros de Raça
        document.querySelectorAll('.race-filters button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.race-filters button').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.race = e.target.dataset.race;
                this.renderCollection();
            });
        });

        // Busca
        document.getElementById('card-search')?.addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.renderCollection();
        });

        document.getElementById('btn-save-deck')?.addEventListener('click', () => {
            this.saveDeck();
        });

        document.getElementById('btn-clear-deck')?.addEventListener('click', async () => {
            const confirmed = await uiManager.showConfirm(
                'Limpar Deck',
                'Tem certeza que deseja remover todas as cartas do deck?'
            );
            if (confirmed) {
                this.currentDeck.cards = [];
                uiManager.showToast('Deck limpo!', 'info');
                this.renderDeck();
                this.renderCollection();
            }
        });

        document.getElementById('btn-exit-builder')?.addEventListener('click', () => {
            this.game.showScreen('main-menu');
        });

        // Configurar gestos mobile para o bottom sheet
        this.setupMobileGestures();
    }

    setupMobileGestures() {
        const deckPane = document.querySelector('.deck-pane');
        const deckHeader = document.querySelector('.deck-header');

        if (!deckPane || !deckHeader) return;

        // Toggle simples no click do header
        deckHeader.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                deckPane.classList.toggle('expanded');
            }
        });

        // Touch gestures para arrastar
        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        deckHeader.addEventListener('touchstart', (e) => {
            if (window.innerWidth > 768) return;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        deckHeader.addEventListener('touchmove', (e) => {
            if (!isDragging || window.innerWidth > 768) return;
            currentY = e.touches[0].clientY;
        }, { passive: true });

        deckHeader.addEventListener('touchend', () => {
            if (!isDragging || window.innerWidth > 768) return;

            const deltaY = currentY - startY;
            const threshold = 50;

            if (Math.abs(deltaY) > threshold) {
                if (deltaY > 0) {
                    // Swipe para baixo - fechar
                    deckPane.classList.remove('expanded');
                } else {
                    // Swipe para cima - abrir
                    deckPane.classList.add('expanded');
                }
            }

            isDragging = false;
        });
    }

    showGeneralSelection() {
        this.game.showScreen('deck-builder-select');
        const container = document.getElementById('generals-selection-grid');
        container.innerHTML = '';

        const generals = CardsDB.CARDS_DATABASE.filter(c => c.type === CardsDB.CARD_TYPES.GENERAL);

        generals.forEach(general => {
            const cardEl = this.game.createCardElement(general);
            cardEl.classList.add('general-select-card');

            cardEl.addEventListener('click', () => {
                this.startBuilding(general);
            });
            container.appendChild(cardEl);
        });
    }

    startBuilding(general) {
        this.currentDeck = {
            name: `Deck de ${general.name.split(',')[0]}`,
            general: general,
            cards: []
        };

        this.game.showScreen('deck-builder-main');
        this.renderDeck();
        this.renderCollection();
    }

    getAvailableCards() {
        if (!this.currentDeck.general) return [];

        const race = this.currentDeck.general.race;

        return CardsDB.CARDS_DATABASE.filter(card => {
            // Filtrar Generals
            if (card.type === CardsDB.CARD_TYPES.GENERAL) return false;

            // Filtrar por Raça
            if (card.race !== null && card.race !== race) return false;

            // Filtros de UI
            if (this.filters.mana !== 'all') {
                const cost = card.cost;
                if (this.filters.mana === '6+') {
                    if (cost < 6) return false;
                } else {
                    if (cost !== parseInt(this.filters.mana)) return false;
                }
            }

            if (this.filters.type !== 'all') {
                if (card.type !== this.filters.type) return false;
            }

            if (this.filters.race !== 'all') {
                if (card.race !== this.filters.race) return false;
            }

            if (this.filters.search) {
                if (!card.name.toLowerCase().includes(this.filters.search) &&
                    !card.text.toLowerCase().includes(this.filters.search)) return false;
            }

            return true;
        });
    }

    renderCollection() {
        const container = document.getElementById('collection-grid');
        container.innerHTML = '';

        const cards = this.getAvailableCards();
        cards.sort((a, b) => a.cost - b.cost);

        cards.forEach(card => {
            const cardEl = this.game.createCardElement(card);

            const countInDeck = this.currentDeck.cards.filter(id => id === card.id).length;

            // SEMPRE abre modal ao clicar (não adiciona card direto)
            cardEl.addEventListener('click', () => {
                uiManager.showCardModal(
                    card,
                    (selectedCard) => this.addCard(selectedCard),
                    this.game,
                    countInDeck
                );
            });

            if (countInDeck > 0) {
                const badge = document.createElement('div');
                badge.className = 'card-count-badge';
                badge.textContent = countInDeck;
                cardEl.appendChild(badge);
            }

            container.appendChild(cardEl);
        });
    }

    renderDeck() {
        const listContainer = document.getElementById('deck-list');
        listContainer.innerHTML = '';

        document.getElementById('deck-name').textContent = this.currentDeck.name;
        document.getElementById('general-name').textContent = this.currentDeck.general.name;

        const count = this.currentDeck.cards.length;
        const countEl = document.getElementById('card-count');
        countEl.textContent = `${count}/40`;
        countEl.style.color = count >= 30 && count <= 40 ? 'var(--color-success)' : 'var(--color-danger)';

        const uniqueCards = [...new Set(this.currentDeck.cards)];
        const sortedCards = uniqueCards
            .map(id => CardsDB.getCardById(id))
            .sort((a, b) => a.cost - b.cost);

        sortedCards.forEach(card => {
            const quantity = this.currentDeck.cards.filter(id => id === card.id).length;

            const item = document.createElement('div');
            item.className = 'deck-card-item';
            item.innerHTML = `
                <div class="deck-card-cost">${card.cost}</div>
                <div class="deck-card-name">${card.name}</div>
                <div class="deck-card-count">x${quantity}</div>
            `;

            item.addEventListener('click', () => this.removeCard(card.id));
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.game.showCardDetails(card);
            });

            listContainer.appendChild(item);
        });

        this.renderManaCurve();
    }

    renderManaCurve() {
        const container = document.getElementById('mana-curve');
        container.innerHTML = '';

        const costs = [0, 0, 0, 0, 0, 0, 0];

        this.currentDeck.cards.forEach(id => {
            const card = CardsDB.getCardById(id);
            const index = Math.min(card.cost, 6);
            costs[index]++;
        });

        const max = Math.max(...costs, 1);

        costs.forEach((count, i) => {
            const bar = document.createElement('div');
            bar.className = 'curve-bar';
            const height = (count / max) * 100;
            bar.style.height = `${height}%`;
            bar.dataset.count = count;
            bar.title = `Custo ${i}${i === 6 ? '+' : ''}: ${count} cartas`;
            container.appendChild(bar);
        });
    }

    addCard(card) {
        if (this.currentDeck.cards.length >= 40) {
            uiManager.showToast('Deck cheio! Máximo 40 cartas.', 'warning');
            return;
        }

        const count = this.currentDeck.cards.filter(id => id === card.id).length;
        if (count >= 3) {
            uiManager.showToast('Máximo 3 cópias por carta!', 'warning');
            return;
        }

        this.currentDeck.cards.push(card.id);
        uiManager.showToast(`${card.name} adicionada ao deck!`, 'success');

        // Atualizar UI sem fechar modal
        this.renderDeck();
        this.renderCollection();

        // Atualizar o modal com novo contador
        const newCount = count + 1;
        uiManager.showCardModal(card, (selectedCard) => this.addCard(selectedCard), this.game, newCount);
    }

    removeCard(cardId) {
        const index = this.currentDeck.cards.indexOf(cardId);
        if (index > -1) {
            const card = CardsDB.getCardById(cardId);
            this.currentDeck.cards.splice(index, 1);
            uiManager.showToast(`${card.name} removida do deck`, 'info');
            this.renderDeck();
            this.renderCollection();
        }
    }

    saveDeck() {
        const count = this.currentDeck.cards.length;
        if (count < 30) {
            uiManager.showToast(`Deck incompleto! Mínimo 30 cartas (Atual: ${count})`, 'error');
            return;
        }

        const deckData = {
            id: `deck_${Date.now()}`,
            name: this.currentDeck.name,
            generalId: this.currentDeck.general.id,
            cards: this.currentDeck.cards,
            createdAt: new Date().toISOString()
        };

        const savedDecks = JSON.parse(localStorage.getItem('kardum_decks') || '[]');
        savedDecks.push(deckData);
        localStorage.setItem('kardum_decks', JSON.stringify(savedDecks));

        uiManager.showToast('Deck salvo com sucesso!', 'success', 2000);
        setTimeout(() => this.game.showScreen('main-menu'), 2200);
    }
}
