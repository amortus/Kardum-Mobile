// main.js - Controlador principal do jogo Kardum
import { GameState } from './core/game-state.js';
import { CombatSystem } from './core/combat-system.js';
import { AIOpponent } from './ai/ai-opponent.js';
import { DeckBuilder } from './ui/deck-builder.js';
import * as CardsDB from './data/cards-database.js';
import authManager from './auth/auth-manager.js';
import socketClient from './network/socket-client.js';
import PvpManager from './pvp/pvp-manager.js';

class KardumGame {
    constructor() {
        this.gameState = null;
        this.combatSystem = null;
        this.aiOpponent = null;
        this.deckBuilder = null;
        this.pvpManager = null;
        this.currentMode = 'menu';
        this.selectedCard = null;
        this.attackingCard = null;
        this.targetMode = null;

        this.init();
    }

    async init() {
        window.cardsDB = CardsDB;
        window.authManager = authManager;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }

        setTimeout(() => {
            this.hideScreen('loading-screen');
            this.checkAuth();
        }, 1500);
    }

    checkAuth() {
        // Verificar se está autenticado
        if (authManager.isAuthenticated()) {
            // Verificar se token ainda é válido
            authManager.refreshUser().then(result => {
                if (result.success) {
                    this.showScreen('main-menu');
                } else {
                    // Token inválido, mostrar login
                    this.showScreen('auth-screen');
                }
            });
        } else {
            // Não autenticado, mostrar login
            this.showScreen('auth-screen');
        }
    }

    setupUI() {
        this.deckBuilder = new DeckBuilder(this);
        this.pvpManager = new PvpManager(this);
        this.setupAuthUI();
        
        // Conectar socket após autenticação (apenas se Socket.IO estiver disponível)
        if (authManager.isAuthenticated() && socketClient.isSocketIOAvailable()) {
            socketClient.connect();
        }

        document.getElementById('btn-single-player')?.addEventListener('click', () => {
            this.showScreen('difficulty-screen');
        });

        document.getElementById('btn-deck-builder')?.addEventListener('click', () => {
            this.deckBuilder.showGeneralSelection();
        });

        document.getElementById('btn-multiplayer-casual')?.addEventListener('click', () => {
            if (socketClient.isSocketIOAvailable()) {
                this.startPvpMatchmaking('casual');
            } else {
                this.showNotification('Multiplayer não disponível. Socket.IO não carregado.');
            }
        });

        document.getElementById('btn-multiplayer-ranked')?.addEventListener('click', () => {
            if (socketClient.isSocketIOAvailable()) {
                this.startPvpMatchmaking('ranked');
            } else {
                this.showNotification('Multiplayer não disponível. Socket.IO não carregado.');
            }
        });

        document.querySelectorAll('[data-difficulty]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.currentTarget.getAttribute('data-difficulty');
                this.startSinglePlayer(difficulty);
            });
        });

        document.getElementById('btn-back-from-difficulty')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });

        document.getElementById('btn-end-turn')?.addEventListener('click', () => {
            if (this.gameState) {
                // Se for PvP, enviar ação de passar turno
                if (this.currentMode === 'pvp' && this.pvpManager && this.pvpManager.currentMatch) {
                    this.pvpManager.sendPlayerAction({
                        type: 'endTurn'
                    });
                }
                this.gameState.nextPhase();
            }
        });

        document.getElementById('btn-menu')?.addEventListener('click', () => {
            this.showConfirm(
                'Sair da Partida',
                'Deseja sair da partida atual?',
                () => {
                    this.showScreen('main-menu');
                    this.gameState = null;
                }
            );
        });

        document.getElementById('btn-play-again')?.addEventListener('click', () => {
            if (this.currentMode === 'singleplayer' && this.aiOpponent) {
                this.startSinglePlayer(this.aiOpponent.difficulty);
            }
        });

        document.getElementById('btn-main-menu')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });

        document.getElementById('btn-cancel-deck-selection')?.addEventListener('click', () => {
            document.getElementById('deck-selection-modal').classList.add('hidden');
        });
    }

    setupAuthUI() {
        // Switch entre login e register
        document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').classList.remove('active');
            document.getElementById('register-form').classList.add('active');
            this.clearAuthErrors();
        });

        document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-form').classList.remove('active');
            document.getElementById('login-form').classList.add('active');
            this.clearAuthErrors();
        });

        // Login form
        document.getElementById('login-form-element')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            this.clearAuthErrors();
            const result = await authManager.login(username, password);

            if (result.success) {
                this.showScreen('main-menu');
                // Conectar socket após login (apenas se Socket.IO estiver disponível)
                if (socketClient.isSocketIOAvailable()) {
                    socketClient.connect();
                }
            } else {
                this.showAuthError('login-error', result.error);
            }
        });

        // Register form
        document.getElementById('register-form-element')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;

            this.clearAuthErrors();

            // Validação
            if (password !== passwordConfirm) {
                this.showAuthError('register-error', 'As senhas não coincidem');
                return;
            }

            const result = await authManager.register(username, email, password);

            if (result.success) {
                this.showScreen('main-menu');
                // Conectar socket após registro (apenas se Socket.IO estiver disponível)
                if (socketClient.isSocketIOAvailable()) {
                    socketClient.connect();
                }
            } else {
                this.showAuthError('register-error', result.error);
            }
        });
    }

    /**
     * Iniciar matchmaking PvP
     */
    async startPvpMatchmaking(matchType) {
        // Carregar decks do usuário
        const decks = await this.deckBuilder.loadUserDecks();

        if (decks.length === 0) {
            this.showConfirm(
                'Deck Necessário',
                'Você precisa criar um deck para jogar PvP! Deseja ir para a Coleção agora?',
                () => {
                    this.showScreen('main-menu');
                    this.deckBuilder.showGeneralSelection();
                }
            );
            return;
        }

        // Se tiver apenas um deck, usar ele. Senão, mostrar seleção
        if (decks.length === 1) {
            this.pvpManager.joinQueue(decks[0].id, matchType);
        } else {
            // Mostrar seleção de deck
            this.showDeckSelection(decks, (deck) => {
                this.pvpManager.joinQueue(deck.id, matchType);
            });
        }
    }

    showAuthError(errorId, message) {
        const errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    clearAuthErrors() {
        document.getElementById('login-error')?.classList.add('hidden');
        document.getElementById('register-error')?.classList.add('hidden');
    }

    async startSinglePlayer(difficulty) {
        // Carregar decks do servidor
        const savedDecks = await this.deckBuilder.loadUserDecks();

        if (savedDecks.length === 0) {
            this.showConfirm(
                'Deck Necessário',
                'Você precisa criar um deck para jogar! Deseja ir para a Coleção agora?',
                () => {
                    this.showScreen('main-menu');
                    this.deckBuilder.showGeneralSelection();
                }
            );
            return;
        }

        this.selectedDifficulty = difficulty;
        this.showDeckSelection(savedDecks);
    }

    showDeckSelection(decks, onSelect = null) {
        const modal = document.getElementById('deck-selection-modal');
        const list = document.getElementById('deck-selection-list');
        list.innerHTML = '';

        if (decks.length === 0) {
            list.innerHTML = '<p style="color: #aaa; text-align: center; padding: 20px;">Nenhum deck encontrado</p>';
            modal.classList.remove('hidden');
            return;
        }

        decks.forEach(deck => {
            const item = document.createElement('div');
            item.className = 'deck-selection-item';
            
            // Garantir que cards seja sempre um array de IDs válidos
            let cards = [];
            if (Array.isArray(deck.cards)) {
                cards = deck.cards;
            } else if (typeof deck.cards === 'string') {
                try {
                    cards = JSON.parse(deck.cards || '[]');
                } catch (e) {
                    console.error('Erro ao parsear cards do deck:', e);
                    cards = [];
                }
            }
            
            // Garantir que generalId seja válido
            const generalId = deck.generalId || deck.general_id || (cards.length > 0 ? cards[0] : null);
            const general = generalId && window.cardsDB ? window.cardsDB.getCardById(generalId) : null;
            
            item.innerHTML = `
                <div class="deck-name">${deck.name}</div>
                <div class="deck-info">General: ${general?.name || 'Desconhecido'}</div>
                <div class="deck-info">Cartas: ${cards.length}</div>
            `;
            item.onclick = () => {
                modal.classList.add('hidden');
                // Garantir que o deck tenha a estrutura correta
                const normalizedDeck = {
                    ...deck,
                    generalId: generalId,
                    cards: cards
                };
                if (onSelect) {
                    onSelect(normalizedDeck);
                } else {
                    this.startGameWithDeck(normalizedDeck);
                }
            };
            list.appendChild(item);
        });

        modal.classList.remove('hidden');
    }

    startGameWithDeck(playerDeckData) {
        document.getElementById('deck-selection-modal').classList.add('hidden');
        this.currentMode = 'singleplayer';

        // Garantir que cardsDB está disponível
        if (!window.cardsDB || !window.cardsDB.getCardById) {
            console.error('CardsDB não está disponível!');
            this.showNotification('Erro ao carregar banco de cartas. Recarregue a página.');
            return;
        }

        this.gameState = new GameState();
        this.combatSystem = new CombatSystem(this.gameState);
        this.gameState.combatSystem = this.combatSystem;

        this.aiOpponent = new AIOpponent(this.gameState, this.selectedDifficulty);
        this.aiOpponent.setPlayerId('player2');

        this.setupGameListeners();

        // Extrair general e cartas do deck
        let generalId = playerDeckData.generalId || playerDeckData.general_id;
        let cards = Array.isArray(playerDeckData.cards) 
            ? playerDeckData.cards 
            : (typeof playerDeckData.cards === 'string' ? JSON.parse(playerDeckData.cards || '[]') : []);
        
        // Se não tem generalId separado, assumir que o primeiro é o general
        if (!generalId && cards.length > 0) {
            generalId = cards[0];
            cards = cards.slice(1);
        }

        // Validar que o general existe
        const generalCard = window.cardsDB.getCardById(generalId);
        if (!generalCard) {
            console.error(`General não encontrado: ${generalId}`);
            this.showNotification(`Erro: General não encontrado (${generalId})`);
            return;
        }

        // Validar que todas as cartas existem no database
        const invalidCards = [];
        cards.forEach(cardId => {
            const card = window.cardsDB.getCardById(cardId);
            if (!card) {
                invalidCards.push(cardId);
            }
        });

        if (invalidCards.length > 0) {
            console.warn('Cartas inválidas encontradas:', invalidCards);
            // Filtrar cartas inválidas
            cards = cards.filter(cardId => window.cardsDB.getCardById(cardId) !== undefined);
        }

        const fullPlayerDeck = [generalId, ...cards];
        const aiDeck = CardsDB.createStarterDeck('gen_ivin');

        this.gameState.startGame(fullPlayerDeck, aiDeck);

        this.showScreen('battlefield');
        this.renderBattlefield();
        this.gameState.startTurn();
    }

    setupGameListeners() {
        this.gameState.addEventListener((event, data) => {
            switch (event) {
                case 'gameStarted':
                    console.log('Game started!', data);
                    break;

                case 'turnStarted':
                    console.log('Turn started:', data);
                    this.renderBattlefield();
                    // Em singleplayer, AI joga no turno do player2
                    if (this.currentMode === 'singleplayer' && data.playerId === 'player2') {
                        setTimeout(() => {
                            this.aiOpponent.takeTurn();
                        }, 1000);
                    }
                    // Em PvP, o turno é sincronizado via endTurn do oponente
                    break;

                case 'cardsDrawn':
                    this.renderBattlefield();
                    this.showNotification(`${data.cards.length} carta(s) comprada(s)!`);
                    break;

                case 'cardPlayed':
                    this.renderBattlefield();
                    this.showNotification(`${data.card.name} jogado!`);
                    // Em PvP, a sincronização já foi feita via sendPlayerAction
                    break;

                case 'attackDeclared':
                    this.renderBattlefield();
                    this.showNotification(`${data.attacker} atacou ${data.target}!`);
                    // Em PvP, a sincronização já foi feita via sendPlayerAction
                    break;

                case 'creatureDestroyed':
                    this.renderBattlefield();
                    this.showNotification(`${data.creature.name} foi destruído!`);
                    break;

                case 'gameEnded':
                    // Se for PvP, finalizar partida no servidor
                    if (this.currentMode === 'pvp' && this.pvpManager && this.pvpManager.currentMatch) {
                        this.pvpManager.endMatch(data.winner);
                    }
                    this.showGameOver(data.winner);
                    break;

                case 'phaseChanged':
                    this.renderBattlefield();
                    this.updatePhaseIndicator(data.phase);
                    // Em PvP, sincronizar mudança de fase (se necessário)
                    if (this.currentMode === 'pvp' && this.pvpManager && this.pvpManager.currentMatch) {
                        // Fase é sincronizada automaticamente via endTurn
                    }
                    break;

                case 'combatPhaseComplete':
                    this.showNotification('Fase de combate concluída!');
                    setTimeout(() => {
                        this.gameState.nextPhase();
                    }, 1500);
                    break;
            }
        });
    }

    renderBattlefield() {
        if (!this.gameState) return;

        const state = this.gameState.getPublicState();

        document.getElementById('turn-indicator').textContent = `Turno ${state.turnNumber}`;
        document.getElementById('phase-indicator').textContent = this.getPhaseName(state.currentPhase);

        this.renderPlayer('player1', this.gameState.players.player1, true);
        this.renderPlayer('player2', this.gameState.players.player2, false);

        const isPlayerTurn = state.currentPlayer === 'player1';
        document.getElementById('btn-end-turn').disabled = !isPlayerTurn;
    }

    renderPlayer(playerId, player, isControlled) {
        const prefix = playerId === 'player1' ? 'player' : 'opponent';

        const health = player.general ? player.general.currentDefense : 0;
        const maxHealth = 30;
        const healthPercent = (health / maxHealth) * 100;

        document.getElementById(`${prefix}-health`).textContent = health;
        document.getElementById(`${prefix}-health-fill`).style.width = `${healthPercent}%`;

        document.querySelector(`#${prefix}-resources .resource-current`).textContent = player.warResources;
        document.querySelector(`#${prefix}-resources .resource-max`).textContent = player.maxWarResources;

        document.getElementById(`${prefix}-deck-count`).textContent = player.deck.length;
        document.getElementById(`${prefix}-hand-count`).textContent = player.hand.length;

        const handElement = document.getElementById(`${prefix}-hand`);
        handElement.innerHTML = '';

        if (isControlled) {
            player.hand.forEach(card => {
                const cardEl = this.createCardElement(card, true);
                cardEl.addEventListener('click', () => this.onCardClick(card, playerId));

                cardEl.draggable = true;
                cardEl.addEventListener('dragstart', (e) => this.onDragStart(e, card));

                if (card.cost > player.warResources) {
                    cardEl.classList.add('disabled');
                    cardEl.style.opacity = '0.5';
                }

                handElement.appendChild(cardEl);
            });
        } else {
            for (let i = 0; i < player.hand.length; i++) {
                const cardBack = this.createCardBack();
                handElement.appendChild(cardBack);
            }
        }

        const fieldElement = document.getElementById(`${prefix}-field`);
        fieldElement.innerHTML = '';

        if (isControlled && this.gameState.currentPhase === 'strategy') {
            fieldElement.addEventListener('dragover', (e) => {
                e.preventDefault();
                fieldElement.classList.add('drop-zone');
            });
            fieldElement.addEventListener('dragleave', () => {
                fieldElement.classList.remove('drop-zone');
            });
            fieldElement.addEventListener('drop', (e) => {
                e.preventDefault();
                fieldElement.classList.remove('drop-zone');
                this.onDropCard(e, player);
            });
        }

        player.field.forEach(card => {
            const cardEl = this.createCardElement(card, isControlled);

            if (isControlled && this.gameState.currentPhase === 'combat' &&
                this.combatSystem.canAttack(card.instanceId)) {
                cardEl.classList.add('can-attack');
                cardEl.addEventListener('click', () => this.onFieldCardClick(card, playerId));
            }

            if (this.attackingCard === card) {
                cardEl.classList.add('selected');
            }
            fieldElement.appendChild(cardEl);
        });
    }

    updatePhaseIndicator(phase) {
        const indicatorEl = document.getElementById('phase-indicator');
        if (!indicatorEl) return;

        const phaseNames = {
            'draw': 'Fase de Compra',
            'strategy': 'Fase de Estratégia',
            'combat': 'Fase de Combate',
            'end': 'Fim do Turno'
        };

        indicatorEl.textContent = phaseNames[phase] || phase;

        indicatorEl.style.color = phase === 'combat' ? '#ff4444' :
            phase === 'strategy' ? '#44ff44' :
                '#D4AF37';
    }

    createCardElement(card, showFull = true) {
        const el = document.createElement('div');
        el.className = `card card-${card.rarity || 'common'}`;
        el.dataset.id = card.id;
        if (card.instanceId) el.dataset.cardId = card.instanceId;

        if (card.isSummoned) el.classList.add('summoned');
        if (this.selectedCard === card) el.classList.add('selected');

        if (card.keywords && card.keywords.includes('taunt')) {
            el.classList.add('effect-taunt');
        }
        if (card.keywords && card.keywords.includes('divine_shield')) {
            el.classList.add('effect-divine-shield');
        }
        if (card.isSummoned && !card.keywords?.includes('rush')) {
            el.classList.add('effect-sleep');
        }

        let cardImage = 'assets/images/placeholder_card.png';

        if (card.type === 'general') {
            const imgMap = {
                'human': 'gen_human.png',
                'elf': 'gen_elf.png',
                'orc': 'gen_orc.png',
                'dwarf': 'gen_dwarf.png',
                'deva': 'gen_deva.png'
            };
            cardImage = `assets/images/${imgMap[card.race] || 'gen_human.png'}`;
        } else if (card.image) {
            cardImage = `assets/images/${card.image}`;
        }

        const showStats = (card.type === 'defender' || card.type === 'general' || (card.attack !== undefined && card.attack > 0));
        const att = card.currentAttack !== undefined ? card.currentAttack : card.attack;
        const def = card.currentDefense !== undefined ? card.currentDefense : card.defense;

        el.innerHTML = `
            <div class="card-frame">
                <img src="assets/images/Card-Base.png" class="card-template-bg" alt="frame">
                
                <div class="card-cost">${card.cost}</div>
                
                <div class="card-art-container">
                    <div class="card-art-placeholder" style="background-color: ${this.getRaceColor(card.race)}; background-image: url('${cardImage}'); background-size: cover;"></div>
                </div>

                <div class="card-name">${card.name}</div>
                
                <div class="card-text-box">
                    <div class="card-text">${card.text || ''}</div>
                </div>

                ${showStats ? `
                <div class="card-stats-container">
                    <div class="stat-box stat-attack">${att}</div>
                    <div class="stat-box stat-defense">${def}</div>
                </div>
                ` : ''}
                
                ${card.rarity === 'legendary' ? '<div class="card-gem-legendary"></div>' : ''}
            </div>
        `;

        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showCardDetails(card);
        });

        return el;
    }

    getRaceColor(race) {
        const colors = {
            'human': '#2c3e50',
            'orc': '#c0392b',
            'elf': '#27ae60',
            'dwarf': '#d35400',
            'deva': '#f1c40f',
            'neutral': '#7f8c8d'
        };
        return colors[race] || '#7f8c8d';
    }

    createCardBack() {
        const div = document.createElement('div');
        div.className = 'card card-back';
        return div;
    }

    getPhaseName(phase) {
        const names = {
            'draw': 'Fase de Compra',
            'strategy': 'Fase de Estratégia',
            'combat': 'Fase de Combate',
            'end': 'Fim do Turno'
        };
        return names[phase] || phase;
    }

    onDragStart(e, card) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('cardId', card.instanceId);
        this.selectedCard = card;
    }

    onDropCard(e, player) {
        const cardId = e.dataTransfer.getData('cardId');
        if (!cardId) return;

        const card = player.hand.find(c => c.instanceId === cardId);
        if (!card) return;

        this.playCardAction(card, 'player1');
    }

    onCardClick(card, playerId) {
        if (this.gameState.currentPlayer !== playerId) return;
        if (this.gameState.currentPhase !== 'strategy') {
            this.showNotification('Não está na fase de estratégia!');
            return;
        }

        this.playCardAction(card, playerId);
    }

    playCardAction(card, playerId) {
        const player = this.gameState.players[playerId];

        if (card.cost > player.warResources) {
            this.showNotification('Recursos insuficientes!');
            return;
        }

        if (card.type === 'mount') {
            this.showConfirm(
                'Usar Montaria',
                'Usar como Defensor ou Equipamento?',
                () => this.playCardAsDefender(card),
                () => this.playCardAsEquipment(card),
                'Defensor',
                'Equipamento'
            );
            return;
        }

        if (card.type === CardsDB.CARD_TYPES.EQUIPMENT) {
            this.targetMode = 'equip';
            this.selectedCard = card;
            this.showNotification('Selecione onde equipar');
            return;
        }

        // Se for PvP, enviar ação para o servidor
        if (this.currentMode === 'pvp' && this.pvpManager && this.pvpManager.currentMatch) {
            const action = {
                type: 'playCard',
                instanceId: card.instanceId,
                cardId: card.cardId || card.id
            };
            
            // Aplicar ação localmente primeiro (otimistic update)
            const result = this.gameState.playCard(playerId, card.instanceId, {});
            
            if (result.success) {
                // Enviar para o servidor
                this.pvpManager.sendPlayerAction(action);
            } else {
                this.showNotification(result.error);
                return;
            }
        } else {
            // Singleplayer - aplicar diretamente
            const result = this.gameState.playCard(playerId, card.instanceId, {});
            if (!result.success) {
                this.showNotification(result.error);
            }
        }

        this.selectedCard = null;
        this.renderBattlefield();
    }

    playCardAsDefender(cardData) {
        const playerId = 'player1';
        
        // Se for PvP, enviar ação para o servidor
        if (this.currentMode === 'pvp' && this.pvpManager && this.pvpManager.currentMatch) {
            const result = this.gameState.playCard(playerId, cardData.instanceId, { asDefender: true });
            if (result.success) {
                this.pvpManager.sendPlayerAction({
                    type: 'playCard',
                    instanceId: cardData.instanceId,
                    cardId: cardData.cardId || cardData.id,
                    asDefender: true
                });
            } else {
                this.showNotification(result.error);
            }
        } else {
            const result = this.gameState.playCard(playerId, cardData.instanceId, { asDefender: true });
            if (!result.success) {
                this.showNotification(result.error);
            }
        }
    }

    playCardAsEquipment(cardData) {
        this.targetMode = 'equip';
        this.selectedCard = cardData;
        this.showNotification('Selecione onde equipar');
    }

    onFieldCardClick(card, playerId) {
        const currentPhase = this.gameState.currentPhase;
        const player = this.gameState.players[playerId];

        if (this.targetMode === 'equip' && this.selectedCard) {
            const targetId = card.instanceId === player.general.instanceId ? 'general' : card.instanceId;
            
            // Se for PvP, enviar ação para o servidor
            if (this.currentMode === 'pvp' && this.pvpManager && this.pvpManager.currentMatch) {
                const result = this.gameState.playCard(playerId, this.selectedCard.instanceId, { targetId });
                if (result.success) {
                    this.pvpManager.sendPlayerAction({
                        type: 'playCard',
                        instanceId: this.selectedCard.instanceId,
                        cardId: this.selectedCard.cardId || this.selectedCard.id,
                        targetId: targetId
                    });
                } else {
                    this.showNotification(result.error);
                }
            } else {
                const result = this.gameState.playCard(playerId, this.selectedCard.instanceId, { targetId });
                if (!result.success) {
                    this.showNotification(result.error);
                }
            }

            this.targetMode = null;
            this.selectedCard = null;
            this.renderBattlefield();
            return;
        }

        if (currentPhase === 'combat') {
            if (playerId === this.gameState.currentPlayer) {
                if (!this.attackingCard) {
                    if (this.combatSystem.canAttack(card.instanceId)) {
                        this.attackingCard = card;
                        this.showNotification('Selecione o alvo do ataque');
                        this.renderBattlefield();
                    } else {
                        this.showNotification('Esta criatura não pode atacar!');
                    }
                }
            } else {
                if (this.attackingCard) {
                    this.executeAttack(this.attackingCard, card);
                }
            }
        }
    }

    executeAttack(attacker, target) {
        const targetId = target.instanceId;
        
        // Se for PvP, validar antes de aplicar
        if (this.currentMode === 'pvp' && this.pvpManager && this.pvpManager.currentMatch) {
            // Validar ataque localmente
            if (!this.combatSystem.canAttack(attacker.instanceId)) {
                this.showNotification('Esta criatura não pode atacar!');
                this.attackingCard = null;
                return;
            }
            
            // Aplicar ataque localmente (otimistic update)
            const result = this.combatSystem.declareAttack(attacker.instanceId, targetId);
            
            if (result.success) {
                // Enviar para o servidor
                this.pvpManager.sendPlayerAction({
                    type: 'attack',
                    attackerId: attacker.instanceId,
                    targetId: targetId
                });
                this.attackingCard = null;
                this.renderBattlefield();
            } else {
                this.showNotification(result.error);
                this.attackingCard = null;
            }
        } else {
            // Singleplayer - aplicar diretamente
            const result = this.combatSystem.declareAttack(attacker.instanceId, targetId);
            if (result.success) {
                this.attackingCard = null;
                this.renderBattlefield();
            } else {
                this.showNotification(result.error);
                this.attackingCard = null;
            }
        }
    }

    showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    }

    showCardDetails(card) {
        const modal = document.getElementById('card-detail-modal');
        const detail = document.getElementById('card-detail-view');

        detail.innerHTML = '';
        const cardEl = this.createCardElement(card, true);
        cardEl.style.width = '320px';
        cardEl.style.height = '450px';
        detail.appendChild(cardEl);

        modal.classList.remove('hidden');
    }

    showGameOver(winnerId) {
        const isPlayer1Win = winnerId === 'player1';
        document.getElementById('game-over-title').textContent = isPlayer1Win ? 'VITÓRIA!' : 'DERROTA';
        document.getElementById('game-over-message').textContent = isPlayer1Win
            ? 'Você derrotou o oponente!'
            : 'Você foi derrotado...';

        setTimeout(() => {
            this.showScreen('game-over');
        }, 2000);
    }

    showConfirm(title, message, onYes, onNo = null, yesText = 'Sim', noText = 'Não') {
        const modal = document.getElementById('confirm-modal');
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;

        const yesBtn = document.getElementById('confirm-btn-yes');
        const noBtn = document.getElementById('confirm-btn-no');

        yesBtn.textContent = yesText;
        noBtn.textContent = noText;

        const newYesBtn = yesBtn.cloneNode(true);
        const newNoBtn = noBtn.cloneNode(true);
        yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
        noBtn.parentNode.replaceChild(newNoBtn, noBtn);

        newYesBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            if (onYes) onYes();
        });

        newNoBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            if (onNo) onNo();
        });

        modal.style.display = 'flex';
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
        }
    }

    hideScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('hidden');
        }
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
    .card.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

const game = new KardumGame();
window.kardumGame = game;
