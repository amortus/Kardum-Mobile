// combat-system.js - Sistema de combate do Kardum
import { ABILITIES } from '../data/cards-database.js';

export class CombatSystem {
    constructor(gameState) {
        this.gameState = gameState;
    }

    // Declarar ataque de um Defensor a um alvo
    declareAttack(attackerId, targetId) {
        const attacker = this.findCardById(attackerId);
        const target = this.findCardById(targetId);
        const currentPlayer = this.gameState.players[this.gameState.currentPlayer];
        const opponent = this.gameState.players[
            this.gameState.currentPlayer === 'player1' ? 'player2' : 'player1'
        ];

        // Validações
        if (!attacker) {
            return { success: false, error: 'Atacante não encontrado' };
        }

        if (!target) {
            return { success: false, error: 'Alvo não encontrado' };
        }

        if (this.gameState.currentPhase !== 'combat') {
            return { success: false, error: 'Não está na fase de combate' };
        }

        if (attacker.hasAttacked) {
            return { success: false, error: 'Atacante já atacou neste turno' };
        }

        if (attacker.isSummoned && !attacker.hasAbilities.includes(ABILITIES.RUSH)) {
            return { success: false, error: 'Criatura posicionando não pode atacar' };
        }

        // Verificar se há Taunt no campo inimigo
        const tauntDefenders = opponent.field.filter(c =>
            c.hasAbilities.includes(ABILITIES.TAUNT)
        );

        if (tauntDefenders.length > 0 && targetId !== 'general') {
            const isTauntTarget = tauntDefenders.some(c => c.instanceId === targetId);
            if (!isTauntTarget) {
                return { success: false, error: 'Deve atacar criatura com Taunt primeiro' };
            }
        }

        // Executar combate
        const result = this.resolveCombat(attacker, target, currentPlayer, opponent);

        // Marcar atacante como tendo atacado
        attacker.hasAttacked = true;

        this.gameState.emit('attackDeclared', {
            attacker: attacker.name,
            target: target === opponent.general ? 'General' : target.name,
            result
        });

        this.gameState.logAction('attack', {
            attacker: attacker.name,
            target: target === opponent.general ? 'General' : target.name,
            damage: result.damage
        });

        return { success: true, result };
    }

    resolveCombat(attacker, target, attackingPlayer, defendingPlayer) {
        let damage = attacker.currentAttack;
        const result = {
            damage: 0,
            counterDamage: 0,
            attackerDied: false,
            targetDied: false,
            effects: []
        };

        // Aplicar dano ao alvo
        if (target === defendingPlayer.general) {
            // Atacando General
            target.currentDefense -= damage;
            result.damage = damage;

            if (target.currentDefense <= 0) {
                this.gameState.endGame(attackingPlayer.id);
                result.targetDied = true;
            }
        } else {
            // Atacando Defensor
            const shieldActive = target.hasAbilities.includes(ABILITIES.DIVINE_SHIELD);

            if (shieldActive) {
                // Divine Shield bloqueia o dano
                target.hasAbilities = target.hasAbilities.filter(a => a !== ABILITIES.DIVINE_SHIELD);
                result.effects.push('Divine Shield bloqueou o dano');
                damage = 0;
            } else {
                target.currentDefense -= damage;
                result.damage = damage;
            }

            // Contra-ataque (se Defensor ainda vivo)
            if (target.currentDefense > 0 && target.currentAttack > 0) {
                attacker.currentDefense -= target.currentAttack;
                result.counterDamage = target.currentAttack;
            }

            // Verificar mortes
            if (target.currentDefense <= 0) {
                this.destroyCreature(target, defendingPlayer);
                result.targetDied = true;
            }

            if (attacker.currentDefense <= 0) {
                this.destroyCreature(attacker, attackingPlayer);
                result.attackerDied = true;
            }
        }

        // Lifesteal
        if (attacker.hasAbilities.includes(ABILITIES.LIFESTEAL) && damage > 0) {
            attackingPlayer.general.currentDefense = Math.min(
                attackingPlayer.general.currentDefense + damage,
                30 // Max health
            );
            result.effects.push(`Lifesteal curou ${damage} de vida`);
        }

        return result;
    }

    destroyCreature(creature, owner) {
        // Remover do campo
        const fieldIndex = owner.field.findIndex(c => c.instanceId === creature.instanceId);
        if (fieldIndex !== -1) {
            owner.field.splice(fieldIndex, 1);
            owner.graveyard.push(creature);
        }

        // Se tinha equipamento, destruir também
        if (creature.equipped) {
            owner.graveyard.push(creature.equipped);
        }

        // Destruir montarias atreladas
        const mountsToDestroy = owner.mounts.filter(m => m.attachedTo === creature.instanceId);
        mountsToDestroy.forEach(mount => {
            const mountIndex = owner.mounts.findIndex(m => m.instanceId === mount.instanceId);
            if (mountIndex !== -1) {
                owner.mounts.splice(mountIndex, 1);
                owner.graveyard.push(mount);
            }
        });

        this.gameState.emit('creatureDestroyed', { creature: creature.name, owner: owner.id });
    }

    findCardById(instanceId) {
        // Procurar em ambos os jogadores
        for (const playerId of ['player1', 'player2']) {
            const player = this.gameState.players[playerId];

            // Verificar General
            if (instanceId === 'general' || (player.general && player.general.instanceId === instanceId)) {
                return player.general;
            }

            // Verificar campo
            const fieldCard = player.field.find(c => c.instanceId === instanceId);
            if (fieldCard) return fieldCard;
        }

        return null;
    }

    // Aplicar dano direto (usado por habilidades)
    dealDamage(targetId, damage, source) {
        const target = this.findCardById(targetId);
        if (!target) {
            return { success: false, error: 'Alvo não encontrado' };
        }

        target.currentDefense -= damage;

        const isGeneral = targetId === 'general' || target.type === 'general';

        if (target.currentDefense <= 0) {
            if (isGeneral) {
                const playerId = this.gameState.players.player1.general === target ? 'player1' : 'player2';
                const winnerId = playerId === 'player1' ? 'player2' : 'player1';
                this.gameState.endGame(winnerId);
            } else {
                // Destruir criatura
                const owner = this.gameState.players.player1.field.includes(target)
                    ? this.gameState.players.player1
                    : this.gameState.players.player2;
                this.destroyCreature(target, owner);
            }
        }

        return { success: true, damage, targetDied: target.currentDefense <= 0 };
    }

    // Curar alvo
    heal(targetId, amount) {
        const target = this.findCardById(targetId);
        if (!target) {
            return { success: false, error: 'Alvo não encontrado' };
        }

        const maxHealth = target.type === 'general' ? 30 :
            (target.defense + (target.equipped?.defense || 0));

        target.currentDefense = Math.min(target.currentDefense + amount, maxHealth);

        return { success: true, healed: amount };
    }

    // Verificar se pode atacar
    canAttack(attackerId) {
        const attacker = this.findCardById(attackerId);
        if (!attacker) return false;
        if (attacker.hasAttacked) return false;
        if (attacker.isFrozen) return false; // Frozen check
        if (attacker.isSummoned && !attacker.hasAbilities.includes(ABILITIES.RUSH)) return false;
        return true;
    }

    // Obter alvos válidos para ataque
    getValidTargets(attackerId) {
        const opponent = this.gameState.currentPlayer === 'player1'
            ? this.gameState.players.player2
            : this.gameState.players.player1;

        // Filtrar criaturas com Stealth (não podem ser alvo)
        const visibleCreatures = opponent.field.filter(c =>
            !c.keywords?.includes('stealth') && !c.hasAbilities?.includes('stealth')
        );

        const tauntCreatures = visibleCreatures.filter(c =>
            c.hasAbilities.includes(ABILITIES.TAUNT)
        );

        if (tauntCreatures.length > 0) {
            return tauntCreatures.map(c => c.instanceId);
        }

        // Todos os Defensores visíveis + General
        return [...visibleCreatures.map(c => c.instanceId), 'general'];
    }
}

export default CombatSystem;
