// client/js/pvp/pvp-manager.js - Gerenciador de partidas PvP
import socketClient from '../network/socket-client.js';
import apiClient from '../network/api-client.js';
import { GameState } from '../core/game-state.js';
import { CombatSystem } from '../core/combat-system.js';

class PvpManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.currentMatch = null;
        this.inQueue = false;
        this.queueType = null;
        this.selectedDeckId = null;

        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        socketClient.onMatchFound((data) => {
            console.log('[PVP] Match found:', data);
            this.handleMatchFound(data);
        });

        socketClient.onMatchStart((data) => {
            console.log('[PVP] Match started:', data);
            this.handleMatchStart(data);
        });

        socketClient.onMatchAction((data) => {
            console.log('[PVP] Opponent action:', data);
            this.handleOpponentAction(data);
        });

        socketClient.onMatchEnd((data) => {
            console.log('[PVP] Match ended:', data);
            this.handleMatchEnd(data);
        });

        socketClient.onMatchState((data) => {
            console.log('[PVP] Match state received:', data);
            this.handleMatchState(data);
        });

        socketClient.onMatchmakingJoined((data) => {
            console.log('[PVP] Joined queue:', data);
            this.inQueue = true;
            this.queueType = data.matchType;
        });

        socketClient.onMatchmakingLeft(() => {
            console.log('[PVP] Left queue');
            this.inQueue = false;
            this.queueType = null;
        });

        socketClient.onError((data) => {
            console.error('[PVP] Error:', data);
            this.game.showNotification(data.message || 'Erro no PvP');
        });
    }

    /**
     * Entrar na fila de matchmaking
     */
    async joinQueue(deckId, matchType) {
        if (this.inQueue) {
            this.game.showNotification('Você já está na fila!');
            return;
        }

        if (!socketClient.isConnected()) {
            // Verificar se Socket.IO está disponível antes de conectar
            if (!socketClient.isSocketIOAvailable()) {
                this.game.showNotification('Multiplayer não disponível. Socket.IO não carregado.');
                return;
            }
            
            socketClient.connect();
            // Aguardar conexão
            await new Promise((resolve) => {
                const checkConnection = setInterval(() => {
                    if (socketClient.isConnected()) {
                        clearInterval(checkConnection);
                        resolve();
                    }
                }, 100);
                setTimeout(() => {
                    clearInterval(checkConnection);
                    resolve();
                }, 5000);
            });
        }

        this.selectedDeckId = deckId;
        socketClient.joinMatchmaking(deckId, matchType);
        this.game.showNotification(`Procurando oponente (${matchType})...`);
    }

    /**
     * Sair da fila
     */
    leaveQueue() {
        if (!this.inQueue) return;

        socketClient.leaveMatchmaking();
        this.inQueue = false;
        this.queueType = null;
        this.game.showNotification('Saiu da fila');
    }

    /**
     * Handler quando match é encontrado
     */
    async handleMatchFound(data) {
        this.inQueue = false;
        this.currentMatch = {
            matchId: data.matchId,
            opponent: data.opponent,
            matchType: data.matchType
        };

        this.game.showNotification(`Oponente encontrado: ${data.opponent.username}`);
        
        // Aguardar um pouco e marcar como pronto
        setTimeout(() => {
            socketClient.sendReady(data.matchId);
        }, 1000);
    }

    /**
     * Handler quando partida inicia
     */
    handleMatchStart(data) {
        const currentUser = window.authManager.getCurrentUser();
        if (!currentUser) return;

        // Determinar qual jogador é qual
        const isPlayer1 = data.isPlayer1 !== undefined ? data.isPlayer1 : (data.player1Id === currentUser.id);
        
        this.currentMatch = {
            ...this.currentMatch,
            player1Deck: data.player1Deck,
            player2Deck: data.player2Deck,
            matchType: data.matchType,
            player1Id: data.player1Id,
            player2Id: data.player2Id,
            isPlayer1
        };

        // Iniciar jogo
        this.startPvpGame(data, isPlayer1);
    }

    /**
     * Iniciar jogo PvP
     */
    startPvpGame(data, isPlayer1) {
        // Garantir que cardsDB está disponível
        if (!window.cardsDB || !window.cardsDB.getCardById) {
            console.error('CardsDB não está disponível!');
            this.game.showNotification('Erro ao carregar banco de cartas. Recarregue a página.');
            return;
        }

        this.game.currentMode = 'pvp';
        this.game.gameState = new GameState();
        this.game.combatSystem = new CombatSystem(this.game.gameState);
        this.game.gameState.combatSystem = this.game.combatSystem;

        // Preparar decks - se for player1, usar player1Deck, senão player2Deck
        let playerDeckData, opponentDeckData;
        if (isPlayer1) {
            playerDeckData = data.player1Deck;
            opponentDeckData = data.player2Deck;
        } else {
            playerDeckData = data.player2Deck;
            opponentDeckData = data.player1Deck;
        }

        // Normalizar e validar deck do jogador
        const playerGeneralId = playerDeckData.generalId || playerDeckData.general_id;
        let playerCards = Array.isArray(playerDeckData.cards) 
            ? playerDeckData.cards 
            : (typeof playerDeckData.cards === 'string' ? JSON.parse(playerDeckData.cards || '[]') : []);

        // Validar general do jogador
        const playerGeneral = window.cardsDB.getCardById(playerGeneralId);
        if (!playerGeneral) {
            console.error(`General do jogador não encontrado: ${playerGeneralId}`);
            this.game.showNotification(`Erro: General não encontrado`);
            return;
        }

        // Validar cartas do jogador
        const invalidPlayerCards = [];
        playerCards = playerCards.filter(cardId => {
            const card = window.cardsDB.getCardById(cardId);
            if (!card) {
                invalidPlayerCards.push(cardId);
                return false;
            }
            return true;
        });

        if (invalidPlayerCards.length > 0) {
            console.warn('Cartas inválidas no deck do jogador:', invalidPlayerCards);
        }

        // Normalizar e validar deck do oponente
        const opponentGeneralId = opponentDeckData.generalId || opponentDeckData.general_id;
        let opponentCards = Array.isArray(opponentDeckData.cards) 
            ? opponentDeckData.cards 
            : (typeof opponentDeckData.cards === 'string' ? JSON.parse(opponentDeckData.cards || '[]') : []);

        // Validar general do oponente
        const opponentGeneral = window.cardsDB.getCardById(opponentGeneralId);
        if (!opponentGeneral) {
            console.error(`General do oponente não encontrado: ${opponentGeneralId}`);
            this.game.showNotification(`Erro: General do oponente não encontrado`);
            return;
        }

        // Validar cartas do oponente
        const invalidOpponentCards = [];
        opponentCards = opponentCards.filter(cardId => {
            const card = window.cardsDB.getCardById(cardId);
            if (!card) {
                invalidOpponentCards.push(cardId);
                return false;
            }
            return true;
        });

        if (invalidOpponentCards.length > 0) {
            console.warn('Cartas inválidas no deck do oponente:', invalidOpponentCards);
        }

        // Criar arrays de IDs para passar ao GameState
        const playerDeck = [playerGeneralId, ...playerCards];
        const opponentDeck = [opponentGeneralId, ...opponentCards];

        this.game.gameState.startGame(playerDeck, opponentDeck);
        this.game.setupGameListeners();
        this.game.showScreen('battlefield');
        this.game.renderBattlefield();
        
        // Se for player1, começa o turno
        if (isPlayer1) {
            this.game.gameState.startTurn();
        }
    }

    /**
     * Handler de ação do oponente
     */
    handleOpponentAction(data) {
        if (!this.game.gameState || this.game.currentMode !== 'pvp') {
            return;
        }

        const { action, fromPlayer } = data;
        if (!action || !action.type) {
            console.error('[PVP] Invalid action received:', data);
            return;
        }

        // Determinar qual é o ID do oponente
        const opponentId = this.currentMatch.isPlayer1 ? 'player2' : 'player1';

        try {
            switch (action.type) {
                case 'playCard':
                    this.handleOpponentPlayCard(action, opponentId);
                    break;

                case 'attack':
                    this.handleOpponentAttack(action, opponentId);
                    break;

                case 'endTurn':
                    this.handleOpponentEndTurn(opponentId);
                    break;

                case 'useAbility':
                    this.handleOpponentUseAbility(action, opponentId);
                    break;

                default:
                    console.warn('[PVP] Unknown action type:', action.type);
            }

            this.game.renderBattlefield();
        } catch (error) {
            console.error('[PVP] Error processing opponent action:', error);
            this.game.showNotification('Erro ao processar ação do oponente');
        }
    }

    /**
     * Processar jogada de carta do oponente
     */
    handleOpponentPlayCard(action, opponentId) {
        const { instanceId, targetId, asDefender } = action;
        
        // Encontrar a carta na mão do oponente pelo instanceId
        const opponent = this.game.gameState.players[opponentId];
        const card = opponent.hand.find(c => c.instanceId === instanceId);
        
        if (!card) {
            console.error('[PVP] Card not found in opponent hand:', instanceId);
            return;
        }

        const options = {};
        if (targetId) options.targetId = targetId;
        if (asDefender) options.asDefender = true;

        const result = this.game.gameState.playCard(opponentId, instanceId, options);
        if (!result.success) {
            console.error('[PVP] Failed to play opponent card:', result.error);
        }
    }

    /**
     * Processar ataque do oponente
     */
    handleOpponentAttack(action, opponentId) {
        const { attackerId, targetId } = action;
        
        const result = this.game.combatSystem.declareAttack(attackerId, targetId);
        if (!result.success) {
            console.error('[PVP] Failed to process opponent attack:', result.error);
        }
    }

    /**
     * Processar fim de turno do oponente
     */
    handleOpponentEndTurn(opponentId) {
        // O oponente passou o turno, avançar para o próximo turno
        if (this.game.gameState.currentPlayer === opponentId) {
            this.game.gameState.nextPhase();
        }
    }

    /**
     * Processar uso de habilidade do oponente
     */
    handleOpponentUseAbility(action, opponentId) {
        const { sourceId, targetId } = action;
        // Implementar quando habilidades forem adicionadas
        console.log('[PVP] Opponent used ability:', action);
    }

    /**
     * Handler de fim de partida
     */
    handleMatchEnd(data) {
        if (!this.game.gameState) return;

        const isWinner = data.winner === window.authManager.getCurrentUser()?.id;
        this.game.showGameOver(isWinner ? 'player1' : 'player2');
        
        if (data.eloUpdate) {
            const userElo = data.eloUpdate.player1;
            const message = `ELO: ${userElo.oldElo} → ${userElo.newElo} (${userElo.change > 0 ? '+' : ''}${userElo.change})`;
            this.game.showNotification(message);
        }

        this.currentMatch = null;
    }

    /**
     * Enviar ação do jogador
     */
    sendPlayerAction(action) {
        if (!this.currentMatch) {
            console.error('[PVP] No active match');
            return;
        }

        // Validar ação localmente antes de enviar
        if (!this.validateAction(action)) {
            console.error('[PVP] Invalid action:', action);
            return;
        }

        // Enviar ação para o servidor
        socketClient.sendAction(this.currentMatch.matchId, action);
    }

    /**
     * Validar ação antes de enviar
     */
    validateAction(action) {
        if (!action || !action.type) {
            return false;
        }

        const playerId = this.currentMatch.isPlayer1 ? 'player1' : 'player2';
        const player = this.game.gameState.players[playerId];

        // Verificar se é o turno do jogador
        if (this.game.gameState.currentPlayer !== playerId) {
            console.warn('[PVP] Not your turn');
            return false;
        }

        switch (action.type) {
            case 'playCard':
                // Verificar se a carta existe na mão
                const card = player.hand.find(c => c.instanceId === action.instanceId);
                if (!card) {
                    console.warn('[PVP] Card not in hand');
                    return false;
                }
                // Verificar recursos
                if (card.cost > player.warResources) {
                    console.warn('[PVP] Insufficient resources');
                    return false;
                }
                break;

            case 'attack':
                // Verificar se o atacante pode atacar
                if (!this.game.combatSystem.canAttack(action.attackerId)) {
                    console.warn('[PVP] Cannot attack with this card');
                    return false;
                }
                break;

            case 'endTurn':
                // Sempre válido
                break;

            default:
                return true; // Outras ações são válidas por padrão
        }

        return true;
    }

    /**
     * Sincronizar estado do jogo
     */
    async syncGameState() {
        if (!this.currentMatch) {
            return;
        }

        // Solicitar estado do servidor
        socketClient.sendSyncRequest(this.currentMatch.matchId);
    }

    /**
     * Finalizar partida
     */
    endMatch(winnerId) {
        if (!this.currentMatch) return;

        const userId = window.authManager.getCurrentUser()?.id;
        if (!userId) return;

        // winnerId é 'player1' ou 'player2', precisamos converter para userId
        const isPlayer1 = this.currentMatch.isPlayer1;
        let winnerUserId;
        
        if (winnerId === 'player1') {
            winnerUserId = isPlayer1 ? userId : this.currentMatch.player2Id;
        } else {
            winnerUserId = isPlayer1 ? this.currentMatch.player2Id : userId;
        }
        
        socketClient.endMatch(this.currentMatch.matchId, winnerUserId);
    }

    /**
     * Handler de sincronização de estado
     */
    handleMatchState(data) {
        if (!this.currentMatch || data.matchId !== this.currentMatch.matchId) {
            return;
        }

        const { state } = data;
        
        // Sincronizar turno atual
        if (state.currentPlayer) {
            const expectedPlayer = state.currentPlayer === 'player1' 
                ? (this.currentMatch.isPlayer1 ? 'player1' : 'player2')
                : (this.currentMatch.isPlayer1 ? 'player2' : 'player1');
            
            // Se o turno estiver desincronizado, corrigir
            if (this.game.gameState && this.game.gameState.currentPlayer !== expectedPlayer) {
                console.warn('[PVP] Turn desync detected, correcting...');
                // Não forçar mudança de turno, apenas logar
            }
        }

        console.log('[PVP] State synced');
    }
}

export default PvpManager;

