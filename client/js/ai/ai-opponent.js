// ai-opponent.js - IA para oponente single-player
import { CARD_TYPES, ABILITIES } from '../data/cards-database.js';

export class AIOpponent {
    constructor(gameState, difficulty = 'medium') {
        this.gameState = gameState;
        this.difficulty = difficulty; // 'easy', 'medium', 'hard'
        this.playerId = null;
    }

    setPlayerId(playerId) {
        this.playerId = playerId;
    }

    takeTurn() {
        if (!this.playerId) return;

        const player = this.gameState.players[this.playerId];

        // Fase de Estratégia: Jogar cartas
        this.strategyPhase(player);

        // Avançar para Fase de Combate
        this.gameState.currentPhase = 'combat';

        // Fase de Combate: Atacar
        this.combatPhase(player);

        // Passar turno
        setTimeout(() => {
            this.gameState.endTurn();
        }, 1000);
    }

    strategyPhase(player) {
        if (this.difficulty === 'easy') {
            this.strategyEasy(player);
        } else if (this.difficulty === 'medium') {
            this.strategyMedium(player);
        } else {
            this.strategyHard(player);
        }
    }

    strategyEasy(player) {
        // Jogar cartas aleatoriamente até acabar recursos
        const playableCards = player.hand.filter(c => c.cost <= player.warResources);

        while (playableCards.length > 0 && player.warResources > 0) {
            const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];

            if (randomCard.cost > player.warResources) {
                playableCards.splice(playableCards.indexOf(randomCard), 1);
                continue;
            }

            this.playCardAI(player, randomCard);
            playableCards.splice(playableCards.indexOf(randomCard), 1);
        }
    }

    strategyMedium(player) {
        // Jogar cartas priorizando curva de mana
        const hand = [...player.hand].sort((a, b) => a.cost - b.cost);

        for (const card of hand) {
            if (card.cost <= player.warResources) {
                this.playCardAI(player, card);
            }
        }
    }

    strategyHard(player) {
        // Estratégia avançada: considerar trades e valor
        const opponent = this.gameState.players[this.playerId === 'player1' ? 'player2' : 'player1'];

        // Priorizar responder a ameaças
        const threats = opponent.field.filter(c => c.currentAttack >= 4);

        if (threats.length > 0) {
            // Tentar jogar criaturas grandes ou remoções
            const bigCreatures = player.hand.filter(c =>
                c.type === CARD_TYPES.DEFENDER && c.currentDefense >= 4
            );

            for (const card of bigCreatures) {
                if (card.cost <= player.warResources) {
                    this.playCardAI(player, card);
                }
            }
        }

        // Jogar cartas eficientemente
        this.strategyMedium(player);
    }

    playCardAI(player, card) {
        const options = {};

        if (card.type === CARD_TYPES.EQUIPMENT) {
            // Equipar no defensor mais forte
            if (player.field.length > 0) {
                const strongest = player.field.reduce((prev, curr) =>
                    curr.currentAttack > prev.currentAttack ? curr : prev
                );
                options.targetId = strongest.instanceId;
            } else {
                options.targetId = 'general';
            }
        } else if (card.type === CARD_TYPES.MOUNT) {
            // Usar como Defensor se não temos muitas criaturas
            options.asDefender = player.field.length < 3;

            if (!options.asDefender && player.field.length > 0) {
                const strongest = player.field[0];
                options.targetId = strongest.instanceId;
            }
        } else if (card.type === CARD_TYPES.CONSUMABLE || card.type === CARD_TYPES.ABILITY) {
            // Usar em alvos apropriados
            const opponent = this.gameState.players[this.playerId === 'player1' ? 'player2' : 'player1'];
            if (opponent.field.length > 0) {
                options.targetId = opponent.field[0].instanceId;
            } else {
                options.targetId = 'opponentGeneral';
            }
        }

        this.gameState.playCard(this.playerId, card.instanceId, options);
    }

    combatPhase(player) {
        if (this.difficulty === 'easy') {
            this.combatEasy(player);
        } else if (this.difficulty === 'medium') {
            this.combatMedium(player);
        } else {
            this.combatHard(player);
        }
    }

    combatEasy(player) {
        // Atacar aleatoriamente
        const attackers = player.field.filter(c => !c.hasAttacked && !c.isSummoned);
        const opponent = this.gameState.players[this.playerId === 'player1' ? 'player2' : 'player1'];

        for (const attacker of attackers) {
            // Atacar General 50% do tempo, senão ataca criatura aleatória
            if (Math.random() > 0.5 || opponent.field.length === 0) {
                this.gameState.combatSystem.declareAttack(attacker.instanceId, 'general');
            } else {
                const randomTarget = opponent.field[Math.floor(Math.random() * opponent.field.length)];
                this.gameState.combatSystem.declareAttack(attacker.instanceId, randomTarget.instanceId);
            }
        }
    }

    combatMedium(player) {
        // Fazer trades favoráveis ou atacar General
        const attackers = player.field.filter(c => !c.hasAttacked && !c.isSummoned);
        const opponent = this.gameState.players[this.playerId === 'player1' ? 'player2' : 'player1'];

        for (const attacker of attackers) {
            // Verificar se pode matar uma criatura inimiga
            const killableTargets = opponent.field.filter(target =>
                target.currentDefense <= attacker.currentAttack
            );

            if (killableTargets.length > 0) {
                // Matar a criatura mais forte que conseguir
                const bestTarget = killableTargets.reduce((prev, curr) =>
                    curr.currentAttack > prev.currentAttack ? curr : prev
                );
                this.gameState.combatSystem.declareAttack(attacker.instanceId, bestTarget.instanceId);
            } else if (opponent.field.length === 0) {
                // Campo vazio: atacar General
                this.gameState.combatSystem.declareAttack(attacker.instanceId, 'general');
            } else {
                // Atacar criatura mais fraca
                const weakest = opponent.field.reduce((prev, curr) =>
                    curr.currentDefense < prev.currentDefense ? curr : prev
                );
                this.gameState.combatSystem.declareAttack(attacker.instanceId, weakest.instanceId);
            }
        }
    }

    combatHard(player) {
        const attackers = player.field.filter(c => !c.hasAttacked && !c.isSummoned);
        const opponent = this.gameState.players[this.playerId === 'player1' ? 'player2' : 'player1'];

        // Calcular lethal (dano total que pode causar)
        const totalDamage = attackers.reduce((sum, a) => sum + a.currentAttack, 0);
        const opponentHealth = opponent.general.currentDefense;

        if (totalDamage >= opponentHealth && opponent.field.length === 0) {
            // LETHAL! Atacar General com tudo
            for (const attacker of attackers) {
                if (this.gameState.combatSystem.canAttack(attacker.instanceId)) {
                    this.gameState.combatSystem.declareAttack(attacker.instanceId, 'general');
                }
            }
        } else {
            // Fazer trades ideais
            for (const attacker of attackers) {
                if (!this.gameState.combatSystem.canAttack(attacker.instanceId)) continue;

                const validTargets = this.gameState.combatSystem.getValidTargets(attacker.instanceId);

                // Se só pode atacar General (ou não tem alvos válidos além dele)
                if (validTargets.length === 1 && validTargets[0] === 'general') {
                    this.gameState.combatSystem.declareAttack(attacker.instanceId, 'general');
                    continue;
                }

                // Filtrar alvos válidos que são criaturas
                const validCreatureTargets = opponent.field.filter(c => validTargets.includes(c.instanceId));

                const favorableTrades = validCreatureTargets.filter(target => {
                    // Trade favorável: mato a criatura e sobrevivo, OU vale a pena trocar
                    const survives = attacker.currentDefense > target.currentAttack;
                    const killsTarget = attacker.currentAttack >= target.currentDefense;
                    const worthTrade = target.currentAttack >= attacker.currentAttack;

                    return (survives && killsTarget) || (killsTarget && worthTrade);
                });

                if (favorableTrades.length > 0) {
                    const bestTrade = favorableTrades.reduce((prev, curr) =>
                        curr.currentAttack > prev.currentAttack ? curr : prev
                    );
                    this.gameState.combatSystem.declareAttack(attacker.instanceId, bestTrade.instanceId);
                } else {
                    // Se não tem trade bom, bate na cara (General) se possível
                    if (validTargets.includes('general')) {
                        this.gameState.combatSystem.declareAttack(attacker.instanceId, 'general');
                    } else if (validTargets.length > 0) {
                        // Se é forçado a atacar algo (Taunt) e não é bom trade, ataca o mais fraco
                        const forcedTargetId = validTargets[0]; // Simplificação: pega o primeiro válido
                        this.gameState.combatSystem.declareAttack(attacker.instanceId, forcedTargetId);
                    }
                }
            }
        }
    }
}

export default AIOpponent;
