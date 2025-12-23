// client/js/network/socket-client.js - Cliente Socket.IO para PvP
// Socket.IO será carregado via CDN no HTML
import authManager from '../auth/auth-manager.js';

const SOCKET_URL = window.location.origin;

class SocketClient {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.callbacks = {
            matchFound: [],
            matchStart: [],
            matchAction: [],
            matchState: [],
            matchEnd: [],
            matchmakingJoined: [],
            matchmakingLeft: [],
            error: []
        };
    }

    /**
     * Verificar se Socket.IO está disponível
     */
    isSocketIOAvailable() {
        return typeof window !== 'undefined' && typeof window.io !== 'undefined';
    }

    /**
     * Conectar ao servidor
     */
    connect() {
        if (this.socket?.connected) {
            console.warn('[Socket] Already connected');
            return;
        }

        // Verificar se Socket.IO está disponível
        if (!this.isSocketIOAvailable()) {
            console.error('[Socket] Socket.IO não está disponível. Certifique-se de que o script foi carregado.');
            return;
        }

        const token = authManager.getToken();
        if (!token) {
            console.error('[Socket] No token available');
            return;
        }

        const io = window.io;
        this.socket = io(SOCKET_URL, {
            auth: {
                token
            },
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            this.connected = true;
            console.log('[Socket] Connected');
            this.reregisterListeners();
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
            console.log('[Socket] Disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error);
            this.connected = false;
        });

        // Registrar listeners padrão
        this.reregisterListeners();
    }

    /**
     * Desconectar
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
        }
    }

    /**
     * Verificar se está conectado
     */
    isConnected() {
        return this.connected && this.socket?.connected === true;
    }

    /**
     * Entrar na fila de matchmaking
     */
    joinMatchmaking(deckId, matchType) {
        if (!this.socket || !this.isConnected()) {
            throw new Error('Not connected to server');
        }

        this.socket.emit('pvp:matchmaking:join', {
            deckId,
            matchType
        });
    }

    /**
     * Sair da fila de matchmaking
     */
    leaveMatchmaking() {
        if (!this.socket) return;

        this.socket.emit('pvp:matchmaking:leave');
    }

    /**
     * Marcar como pronto para partida
     */
    sendReady(matchId) {
        if (!this.socket || !this.isConnected()) {
            throw new Error('Not connected to server');
        }

        this.socket.emit('pvp:match:ready', { matchId });
    }

    /**
     * Enviar ação na partida
     */
    sendAction(matchId, action) {
        if (!this.socket || !this.isConnected()) {
            throw new Error('Not connected to server');
        }

        this.socket.emit('pvp:match:action', {
            matchId,
            action
        });
    }

    /**
     * Finalizar partida
     */
    endMatch(matchId, winnerId) {
        if (!this.socket || !this.isConnected()) {
            throw new Error('Not connected to server');
        }

        this.socket.emit('pvp:match:end', {
            matchId,
            winnerId
        });
    }

    /**
     * Solicitar sincronização de estado
     */
    sendSyncRequest(matchId) {
        if (!this.socket || !this.isConnected()) {
            throw new Error('Not connected to server');
        }

        this.socket.emit('pvp:match:sync', { matchId });
    }

    /**
     * Listener para sincronização de estado
     */
    onMatchState(callback) {
        this.callbacks.matchState.push(callback);
        if (this.socket) {
            this.socket.on('pvp:match:state', callback);
        }
    }

    /**
     * Event listeners
     */
    onMatchFound(callback) {
        this.callbacks.matchFound.push(callback);
        if (this.socket) {
            this.socket.on('pvp:matchmaking:found', callback);
        }
    }

    onMatchStart(callback) {
        this.callbacks.matchStart.push(callback);
        if (this.socket) {
            this.socket.on('pvp:match:start', callback);
        }
    }

    onMatchAction(callback) {
        this.callbacks.matchAction.push(callback);
        if (this.socket) {
            this.socket.on('pvp:match:action', callback);
        }
    }

    onMatchEnd(callback) {
        this.callbacks.matchEnd.push(callback);
        if (this.socket) {
            this.socket.on('pvp:match:end', callback);
        }
    }

    onMatchmakingJoined(callback) {
        this.callbacks.matchmakingJoined.push(callback);
        if (this.socket) {
            this.socket.on('pvp:matchmaking:joined', callback);
        }
    }

    onMatchmakingLeft(callback) {
        this.callbacks.matchmakingLeft.push(callback);
        if (this.socket) {
            this.socket.on('pvp:matchmaking:left', callback);
        }
    }

    onError(callback) {
        this.callbacks.error.push(callback);
        if (this.socket) {
            this.socket.on('pvp:error', callback);
        }
    }

    /**
     * Re-registrar todos os listeners após reconexão
     */
    reregisterListeners() {
        if (!this.socket) return;

        // Remover listeners antigos
        this.socket.removeAllListeners('pvp:matchmaking:found');
        this.socket.removeAllListeners('pvp:match:start');
        this.socket.removeAllListeners('pvp:match:action');
        this.socket.removeAllListeners('pvp:match:end');
        this.socket.removeAllListeners('pvp:match:state');
        this.socket.removeAllListeners('pvp:matchmaking:joined');
        this.socket.removeAllListeners('pvp:matchmaking:left');
        this.socket.removeAllListeners('pvp:error');

        // Registrar callbacks
        this.callbacks.matchFound.forEach(cb => {
            this.socket.on('pvp:matchmaking:found', cb);
        });
        this.callbacks.matchStart.forEach(cb => {
            this.socket.on('pvp:match:start', cb);
        });
        this.callbacks.matchAction.forEach(cb => {
            this.socket.on('pvp:match:action', cb);
        });
        this.callbacks.matchEnd.forEach(cb => {
            this.socket.on('pvp:match:end', cb);
        });
        this.callbacks.matchState.forEach(cb => {
            this.socket.on('pvp:match:state', cb);
        });
        this.callbacks.matchmakingJoined.forEach(cb => {
            this.socket.on('pvp:matchmaking:joined', cb);
        });
        this.callbacks.matchmakingLeft.forEach(cb => {
            this.socket.on('pvp:matchmaking:left', cb);
        });
        this.callbacks.error.forEach(cb => {
            this.socket.on('pvp:error', cb);
        });
    }
}

// Singleton instance
const socketClient = new SocketClient();

export default socketClient;

