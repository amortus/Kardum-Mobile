// game-state.js - Gerenciador central do estado do jogo Kardum
import { CARD_TYPES } from '../data/cards-database.js';

export class GameState {
    constructor() {
        this.reset();
        this.listeners = [];
    }

    reset() {
        this.players = {
            player1: this.createPlayerState('player1'),
            player2: this.createPlayerState('player2')
        };
        this.currentPlayer = 'player1';
        this.currentPhase = 'draw'; // draw, strategy, combat, end
        this.turnNumber = 1;
        this.winner = null;
        this.gameStarted = false;
        this.isFirstTurn = true;
        this.actionHistory = [];
    }

    createPlayerState(playerId) {
        return {
            id: playerId,
            general: null,
            health: 30,
            warResources: 1,
            maxWarResources: 1,
            deck: [],
            hand: [],
            field: [], // Defenders em campo
            graveyard: [],
            equipments: {}, // { defenderId: equipmentCard }
            mounts: [], // Montarias em campo
            abilityUsedThisTurn: false,
            mountUsedThisTurn: false
        };
    }

    // Event system para notificar mudanças
    addEventListener(listener) {
        this.listeners.push(listener);
    }

    emit(event, data) {
        this.listeners.forEach(listener => listener(event, data));
    }

    // Iniciar jogo com decks dos jogadores
    startGame(player1Deck, player2Deck) {
        this.reset();

        // Configurar decks (embaralhar)
        this.players.player1.deck = this.shuffle([...player1Deck]);
        this.players.player2.deck = this.shuffle([...player2Deck]);

        // Extrair Generals
        this.players.player1.general = this.extractGeneral(this.players.player1);
        this.players.player2.general = this.extractGeneral(this.players.player2);

        // Comprar 5 cartas iniciais
        this.drawCards(this.players.player1, 5);
        this.drawCards(this.players.player2, 5);

        this.gameStarted = true;
        this.emit('gameStarted', { state: this.getPublicState() });
    }

    extractGeneral(player) {
        const generalIndex = player.deck.findIndex(cardId => {
            const card = this.getCardData(cardId);
            return card.type === CARD_TYPES.GENERAL;
        });

        if (generalIndex === -1) {
            throw new Error('Deck sem General!');
        }

        const general = player.deck.splice(generalIndex, 1)[0];
        return this.createCardInstance(general);
    }

    shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    createCardInstance(cardId) {
        // Importar dinamicamente para evitar dependência circular
        const cardData = this.getCardData(cardId);
        return {
            instanceId: `${cardId}_${Date.now()}_${Math.random()}`,
            cardId: cardId,
            ...JSON.parse(JSON.stringify(cardData)), // Deep clone
            currentAttack: cardData.attack || 0,
            currentDefense: cardData.defense || 0,
            hasAttacked: false,
            isSummoned: false, // "Posicionando" - não pode atacar no turno que entra
            hasAbilities: [...(cardData.abilities || [])],
            equipped: null // Para equipamentos
        };
    }

    getCardData(cardId) {
        // Isso será importado do cards-database
        // Por agora, vamos retornar um objeto básico
        // Em produção, isso importaria de cards-database.js
        if (typeof window !== 'undefined' && window.cardsDB) {
            return window.cardsDB.getCardById(cardId);
        }
        return { id: cardId, name: 'Unknown', type: 'defender' };
    }

    drawCards(player, count) {
        const drawn = [];
        for (let i = 0; i < count; i++) {
            if (player.deck.length === 0) {
                // Deck vazio: aplicar penalidade
                this.applyEmptyDeckPenalty(player);
                break;
            }
            const cardId = player.deck.pop();
            const cardInstance = this.createCardInstance(cardId);
            player.hand.push(cardInstance);
            drawn.push(cardInstance);
        }
        this.emit('cardsDrawn', { playerId: player.id, cards: drawn });
        return drawn;
    }

    applyEmptyDeckPenalty(player) {
        player.health -= 2;
        this.emit('emptyDeckPenalty', { playerId: player.id, damage: 2 });

        if (player.health <= 0) {
            this.endGame(player.id === 'player1' ? 'player2' : 'player1');
        }
    }

    // Fases do turno
    startTurn() {
        const player = this.players[this.currentPlayer];

        // Fase de Compra
        this.currentPhase = 'draw';

        // Jogador que começa não compra no primeiro turno
        if (!this.isFirstTurn) {
            this.drawCards(player, 1);

            // Incrementar recursos de guerra
            if (player.maxWarResources < 10) {
                player.maxWarResources++;
            }
            player.warResources = player.maxWarResources;
        } else {
            // Resetar recursos mesmo no primeiro turno
            player.warResources = player.maxWarResources;
        }

        this.isFirstTurn = false;

        // Resetar flags de turno
        player.abilityUsedThisTurn = false;
        player.mountUsedThisTurn = false;

        // Resetar status de cartas em campo
        player.field.forEach(card => {
            card.hasAttacked = false;
            if (card.isSummoned) {
                card.isSummoned = false; // Agora pode atacar
            }
        });

        // Avançar para fase de estratégia
        this.currentPhase = 'strategy';
        this.emit('turnStarted', { playerId: player.id, phase: this.currentPhase });
    }

    // Avançar para próxima fase
    nextPhase() {
        const phases = ['draw', 'strategy', 'combat', 'end'];
        const currentIndex = phases.indexOf(this.currentPhase);

        if (currentIndex < phases.length - 1) {
            this.currentPhase = phases[currentIndex + 1];
            this.emit('phaseChanged', { phase: this.currentPhase, player: this.currentPlayer });

            // Executar ações automáticas da fase
            if (this.currentPhase === 'combat') {
                this.processCombatPhase();
            } else if (this.currentPhase === 'end') {
                this.processEndPhase();
            }
        }
    }

    // Processar fase de combate automaticamente
    processCombatPhase() {
        const attacker = this.players[this.currentPlayer];
        const defender = this.players[this.currentPlayer === 'player1' ? 'player2' : 'player1'];

        // Todas as criaturas que podem atacar, atacam
        attacker.field.forEach(creature => {
            if (this.canAttack(creature)) {
                // Escolher alvo (prioriza Taunt, senão ataca General)
                const target = this.selectCombatTarget(defender);
                if (target) {
                    this.declareAttack(creature.instanceId, target.instanceId || 'general', this.currentPlayer);
                }
            }
        });

        this.emit('combatPhaseComplete', { playerId: this.currentPlayer });
    }

    // Verificar se criatura pode atacar
    canAttack(creature) {
        if (creature.hasAttacked) return false;
        if (creature.isSummoned && !creature.keywords?.includes('rush')) return false;
        return true;
    }

    // Selecionar alvo para combate
    selectCombatTarget(defender) {
        // Prioridade 1: Criaturas com Taunt
        const tauntCreatures = defender.field.filter(c =>
            c.keywords?.includes('taunt')
        );
        if (tauntCreatures.length > 0) {
            return tauntCreatures[0];
        }

        // Prioridade 2: Atacar o General
        return defender.general;
    }

    // Processar fim de turno
    processEndPhase() {
        setTimeout(() => {
            this.endTurn();
        }, 500);
    }

    // Wrapper para declareAttack do combatSystem
    declareAttack(attackerId, targetId, playerId) {
        if (this.combatSystem) {
            return this.combatSystem.declareAttack(attackerId, targetId);
        }
        return { success: false, error: 'Combat system not initialized' };
    }

    endTurn() {
        this.turnNumber++;
        this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1';
        this.startTurn();
    }

    // Jogar carta da mão
    playCard(playerId, cardInstanceId, options = {}) {
        const player = this.players[playerId];
        const cardIndex = player.hand.findIndex(c => c.instanceId === cardInstanceId);

        if (cardIndex === -1) {
            return { success: false, error: 'Carta não está na mão' };
        }

        const card = player.hand[cardIndex];

        // Verificar recursos
        if (player.warResources < card.cost) {
            return { success: false, error: 'Recursos insuficientes' };
        }

        // Verificar fase
        if (this.currentPhase !== 'strategy') {
            return { success: false, error: 'Não está na fase de estratégia' };
        }

        // Verificar limites de cartas por turno
        if (card.type === CARD_TYPES.ABILITY && player.abilityUsedThisTurn) {
            return { success: false, error: 'Apenas 1 habilidade por turno' };
        }

        if (card.type === CARD_TYPES.MOUNT && player.mountUsedThisTurn) {
            return { success: false, error: 'Apenas 1 montaria por turno' };
        }

        // Consumir recursos
        player.warResources -= card.cost;

        // Remover da mão
        player.hand.splice(cardIndex, 1);

        // Processar baseado no tipo
        let result = { success: true };

        switch (card.type) {
            case CARD_TYPES.DEFENDER:
                card.isSummoned = true;
                player.field.push(card);
                break;

            case CARD_TYPES.EQUIPMENT:
                if (options.targetId) {
                    result = this.equipCard(player, card, options.targetId);
                } else {
                    return { success: false, error: 'Equipamento requer alvo' };
                }
                break;

            case CARD_TYPES.MOUNT:
                player.mountUsedThisTurn = true;
                if (options.asDefender) {
                    card.isSummoned = true;
                    player.field.push(card);
                } else if (options.targetId) {
                    result = this.equipCard(player, card, options.targetId);
                } else {
                    return { success: false, error: 'Montaria requer escolha' };
                }
                break;

            case CARD_TYPES.CONSUMABLE:
                result = this.activateConsumable(player, card, options);
                player.graveyard.push(card);
                break;

            case CARD_TYPES.ABILITY:
                player.abilityUsedThisTurn = true;
                result = this.activateAbility(player, card, options);
                player.graveyard.push(card);
                break;
        }

        this.emit('cardPlayed', { playerId, card, result });
        this.logAction('playCard', { playerId, card: card.name });

        return result;
    }

    equipCard(player, equipment, targetInstanceId) {
        const target = player.field.find(c => c.instanceId === targetInstanceId) ||
            (targetInstanceId === 'general' ? player.general : null);

        if (!target) {
            return { success: false, error: 'Alvo não encontrado' };
        }

        // Verificar se já tem equipamento
        if (target.equipped) {
            player.graveyard.push(target.equipped);
        }

        // Equipar
        target.equipped = equipment;
        target.currentAttack += equipment.attack || 0;
        target.currentDefense += equipment.defense || 0;

        return { success: true };
    }

    activateConsumable(player, card, options) {
        // Processar efeito da carta consumível
        if (!card.effect) {
            return { success: true, message: `${card.name} usado` };
        }

        const effect = card.effect;
        let result = { success: true, message: '' };

        switch (effect.type) {
            case 'heal':
                // Curar General
                const healTarget = effect.target === 'self_general' ? player.general : options.target;
                if (healTarget) {
                    const cardData = this.getCardData(healTarget.cardId);
                    const maxDefense = cardData.defense || 30;
                    const oldDefense = healTarget.currentDefense;
                    healTarget.currentDefense = Math.min(healTarget.currentDefense + effect.amount, maxDefense);
                    const healed = healTarget.currentDefense - oldDefense;
                    result.message = `Curou ${healed} de vida`;
                    this.emit('heal', { playerId: player.id, target: healTarget, amount: healed });
                }
                break;

            case 'draw':
                // Comprar cartas
                this.drawCards(player, effect.amount);
                result.message = `Comprou ${effect.amount} carta(s)`;
                break;

            case 'add_resources':
                // Adicionar recursos temporários
                player.warResources += effect.amount;
                result.message = `Ganhou +${effect.amount} Recursos de Guerra`;
                break;

            case 'damage_all_enemy':
                // Dano em área
                const opponent = this.players[player.id === 'player1' ? 'player2' : 'player1'];
                opponent.field.forEach(creature => {
                    creature.currentDefense -= effect.amount;
                    if (creature.currentDefense <= 0) {
                        const index = opponent.field.indexOf(creature);
                        opponent.field.splice(index, 1);
                        opponent.graveyard.push(creature);
                        this.emit('creatureDestroyed', { playerId: opponent.id, creature });
                    }
                });
                result.message = `Causou ${effect.amount} de dano em área`;
                break;

            default:
                result.message = `${card.name} ativado`;
        }

        return result;
    }

    activateAbility(player, card, options) {
        // Processar efeito da habilidade
        if (!card.effect) {
            return { success: true, message: `${card.name} ativada` };
        }

        const effect = card.effect;
        let result = { success: true, message: '' };

        switch (effect.type) {
            case 'damage':
                // Dano direto a um alvo
                const target = options.target;
                if (!target) {
                    return { success: false, error: 'Habilidade requer alvo' };
                }

                const damage = effect.amount;

                // Ignora Divine Shield se for piercing
                if (effect.piercing && target.hasAbilities?.includes('divine_shield')) {
                    const index = target.hasAbilities.indexOf('divine_shield');
                    target.hasAbilities.splice(index, 1);
                }

                // Aplicar dano
                if (!target.hasAbilities || !target.hasAbilities.includes('divine_shield')) {
                    target.currentDefense -= damage;
                } else {
                    // Bloquear com Divine Shield
                    const index = target.hasAbilities.indexOf('divine_shield');
                    target.hasAbilities.splice(index, 1);
                }

                result.message = `Causou ${damage} de dano`;
                this.emit('abilityDamage', { playerId: player.id, target, damage });

                // Verificar se morreu
                if (target.currentDefense <= 0) {
                    const opponent = this.players[player.id === 'player1' ? 'player2' : 'player1'];
                    const index = opponent.field.indexOf(target);
                    if (index !== -1) {
                        opponent.field.splice(index, 1);
                        opponent.graveyard.push(target);
                        this.emit('creatureDestroyed', { playerId: opponent.id, creature: target });
                    } else if (target === opponent.general) {
                        this.endGame(player.id);
                    }
                }
                break;

            case 'buff_all':
                // Buff em todas as criaturas
                player.field.forEach(creature => {
                    creature.currentAttack += effect.attack || 0;
                    creature.currentDefense += effect.defense || 0;
                });
                result.message = `Todas criaturas ganharam +${effect.attack}/+${effect.defense}`;
                break;

            case 'summon':
                // Invocar um token
                const tokenId = effect.creatureId || 'token_sentinela';
                const token = this.createCardInstance(tokenId);
                token.isSummoned = true;
                player.field.push(token);
                result.message = `Invocou ${token.name}`;
                break;

            default:
                result.message = `${card.name} ativada`;
        }

        return result;
    }

    // Sistema de combate (será implementado em combat-system.js)
    declareAttack(attackerId, targetId) {
        // Placeholder - será implementado no combat-system.js
        return { success: true };
    }

    endGame(winnerId) {
        this.winner = winnerId;
        this.emit('gameEnded', { winner: winnerId });
    }

    logAction(action, data) {
        this.actionHistory.push({
            turn: this.turnNumber,
            player: this.currentPlayer,
            action,
            data,
            timestamp: Date.now()
        });
    }

    getPublicState() {
        return {
            currentPlayer: this.currentPlayer,
            currentPhase: this.currentPhase,
            turnNumber: this.turnNumber,
            winner: this.winner,
            players: {
                player1: this.getPlayerPublicState('player1'),
                player2: this.getPlayerPublicState('player2')
            }
        };
    }

    getPlayerPublicState(playerId) {
        const player = this.players[playerId];
        return {
            id: playerId,
            health: player.general ? player.general.currentDefense : 0,
            warResources: player.warResources,
            maxWarResources: player.maxWarResources,
            handSize: player.hand.length,
            deckSize: player.deck.length,
            fieldSize: player.field.length,
            general: player.general
        };
    }
}

export default GameState;
