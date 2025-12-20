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
        this.game.currentMode = 'pvp';
        this.game.gameState = new GameState();
        this.game.combatSystem = new CombatSystem(this.game.gameState);
        this.game.gameState.combatSystem = this.game.combatSystem;

        // Preparar decks - se for player1, usar player1Deck, senão player2Deck
        let playerDeck, opponentDeck;
        if (isPlayer1) {
            playerDeck = [data.player1Deck.generalId, ...data.player1Deck.cards];
            opponentDeck = [data.player2Deck.generalId, ...data.player2Deck.cards];
        } else {
            playerDeck = [data.player2Deck.generalId, ...data.player2Deck.cards];
            opponentDeck = [data.player1Deck.generalId, ...data.player1Deck.cards];
        }

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

        // Processar ação do oponente
        // As ações serão processadas pelo gameState
        this.game.renderBattlefield();
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

        socketClient.sendAction(this.currentMatch.matchId, action);
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
}

export default PvpManager;

