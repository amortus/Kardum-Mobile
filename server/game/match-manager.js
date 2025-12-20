// server/game/match-manager.js - Gerenciador de partidas PvP
const { createMatch, endMatch, getDeckById } = require('../database');
const { updateEloAfterMatch } = require('../services/elo');

// Estado das partidas em memória: Map<matchId, matchState>
const activeMatches = new Map();
let nextMatchId = 1;

/**
 * Criar nova partida
 */
function createPvpMatch(player1Id, player2Id, player1DeckId, player2DeckId, matchType) {
    const matchId = nextMatchId++;
    
    // Criar registro no banco
    const dbResult = createMatch(player1Id, player2Id, matchType);
    const dbMatchId = dbResult.lastInsertRowid;

    // Carregar decks
    const player1Deck = getDeckById(player1DeckId);
    const player2Deck = getDeckById(player2DeckId);

    if (!player1Deck || !player2Deck) {
        throw new Error('Deck not found');
    }

    // Estado da partida
    const matchState = {
        matchId: dbMatchId,
        player1Id,
        player2Id,
        player1DeckId,
        player2DeckId,
        player1Deck: {
            generalId: player1Deck.general_id,
            cards: Array.isArray(player1Deck.cards) ? player1Deck.cards : JSON.parse(player1Deck.cards || '[]')
        },
        player2Deck: {
            generalId: player2Deck.general_id,
            cards: Array.isArray(player2Deck.cards) ? player2Deck.cards : JSON.parse(player2Deck.cards || '[]')
        },
        matchType,
        gameState: null, // Será inicializado pelo cliente
        currentPlayer: 'player1',
        turnNumber: 1,
        startedAt: Date.now(),
        lastActionAt: Date.now(),
        player1Ready: false,
        player2Ready: false,
        winner: null,
        ended: false
    };

    activeMatches.set(dbMatchId, matchState);

    console.log(`[MatchManager] Match ${dbMatchId} created: ${player1Id} vs ${player2Id} (${matchType})`);

    return matchState;
}

/**
 * Obter estado da partida
 */
function getMatch(matchId) {
    return activeMatches.get(matchId);
}

/**
 * Marcar jogador como pronto
 */
function setPlayerReady(matchId, playerId) {
    const match = activeMatches.get(matchId);
    if (!match) {
        throw new Error('Match not found');
    }

    if (match.player1Id === playerId) {
        match.player1Ready = true;
    } else if (match.player2Id === playerId) {
        match.player2Ready = true;
    } else {
        throw new Error('Player not in match');
    }

    console.log(`[MatchManager] Player ${playerId} ready for match ${matchId}`);

    return match;
}

/**
 * Verificar se ambos os jogadores estão prontos
 */
function areBothPlayersReady(matchId) {
    const match = activeMatches.get(matchId);
    if (!match) return false;
    return match.player1Ready && match.player2Ready;
}

/**
 * Processar ação do jogador
 */
function processAction(matchId, playerId, action) {
    const match = activeMatches.get(matchId);
    if (!match) {
        throw new Error('Match not found');
    }

    if (match.ended) {
        throw new Error('Match already ended');
    }

    // Validar que é o turno do jogador
    const expectedPlayer = match.currentPlayer === 'player1' ? match.player1Id : match.player2Id;
    if (playerId !== expectedPlayer) {
        throw new Error('Not your turn');
    }

    // Atualizar último tempo de ação
    match.lastActionAt = Date.now();

    // A ação será validada e processada pelo cliente
    // O servidor apenas registra e sincroniza
    console.log(`[MatchManager] Action from player ${playerId} in match ${matchId}:`, action.type);

    return match;
}

/**
 * Finalizar partida
 */
function endPvpMatch(matchId, winnerId) {
    const match = activeMatches.get(matchId);
    if (!match) {
        throw new Error('Match not found');
    }

    if (match.ended) {
        return match;
    }

    match.ended = true;
    match.winner = winnerId;
    const duration = Math.floor((Date.now() - match.startedAt) / 1000);

    // Atualizar ELO
    const eloUpdate = updateEloAfterMatch(
        match.player1Id,
        match.player2Id,
        winnerId,
        match.matchType
    );

    // Atualizar estatísticas no banco
    const { db } = require('../database');
    db.prepare('UPDATE users SET total_matches = total_matches + 1 WHERE id IN (?, ?)').run(match.player1Id, match.player2Id);
    
    if (winnerId === match.player1Id) {
        db.prepare('UPDATE users SET wins = wins + 1 WHERE id = ?').run(match.player1Id);
        db.prepare('UPDATE users SET losses = losses + 1 WHERE id = ?').run(match.player2Id);
    } else if (winnerId === match.player2Id) {
        db.prepare('UPDATE users SET wins = wins + 1 WHERE id = ?').run(match.player2Id);
        db.prepare('UPDATE users SET losses = losses + 1 WHERE id = ?').run(match.player1Id);
    }

    // Salvar no banco
    endMatch(matchId, winnerId, duration);

    console.log(`[MatchManager] Match ${matchId} ended. Winner: ${winnerId}`);

    // Remover da memória após 5 minutos (para permitir reconexão)
    setTimeout(() => {
        activeMatches.delete(matchId);
    }, 5 * 60 * 1000);

    return {
        ...match,
        duration,
        eloUpdate
    };
}

/**
 * Limpar partidas antigas
 */
function cleanupOldMatches() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutos

    for (const [matchId, match] of activeMatches.entries()) {
        if (match.ended && (now - match.startedAt) > maxAge) {
            activeMatches.delete(matchId);
        }
    }
}

// Limpar partidas antigas a cada 10 minutos
setInterval(cleanupOldMatches, 10 * 60 * 1000);

module.exports = {
    createPvpMatch,
    getMatch,
    setPlayerReady,
    areBothPlayersReady,
    processAction,
    endPvpMatch
};

