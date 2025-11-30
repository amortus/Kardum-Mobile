// main.js - Controlador principal com mecânicas INTERATIVAS completas
import { GameState } from './core/game-state.js';
import { CombatSystem } from './core/combat-system.js';
import { AIOpponent } from './ai/ai-opponent.js';
import { DeckBuilder } from './ui/deck-builder.js';
import * as CardsDB from './data/cards-database.js';

class KardumGame {
    constructor() {
        this.gameState = null;
        this.combatSystem = null;
        this.aiOpponent = null;
        this.deckBuilder = null;
        this.currentMode = 'menu';
        this.selectedCard = null;
        this.attackingCard = null;
        this.targetMode = null; // 'attack', 'equip', 'target_ability'

        this.init();
    }

    async init() {
        window.cardsDB = CardsDB;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }

        setTimeout(() => {
            this.hideScreen('loading-screen');
            this.showScreen('main-menu');
        }, 1500);
    }

    setupUI() {
        // Inicializar Deck Builder
        this.deckBuilder = new DeckBuilder(this);

        document.getElementById('btn-single-player')?.addEventListener('click', () => {
            this.showScreen('difficulty-screen');
        });

        document.getElementById('btn-multiplayer-casual')?.addEventListener('click', () => {
            alert('Multiplayer será implementado em breve!');
        });

        document.getElementById('btn-multiplayer-ranked')?.addEventListener('click', () => {
            alert('Ranked será implementado em breve!');
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
            // Passar para próxima fase (Strategy → Combat → End → Próximo turno)
            if (this.gameState) {
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

        document.getElementById('btn-close-modal')?.addEventListener('click', () => {
            document.getElementById('card-detail-modal')?.classList.add('hidden');
        });

        document.querySelector('.modal-backdrop')?.addEventListener('click', () => {
            document.getElementById('card-detail-modal')?.classList.add('hidden');
        });

        document.getElementById('btn-cancel-deck-selection')?.addEventListener('click', () => {
            document.getElementById('deck-selection-modal').classList.add('hidden');
        });
    }

    startSinglePlayer(difficulty) {
        // Verificar se existem decks salvos
        const savedDecks = JSON.parse(localStorage.getItem('kardum_decks') || '[]');

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

    showDeckSelection(decks) {
        const modal = document.getElementById('deck-selection-modal');
        const list = document.getElementById('deck-selection-list');
        list.innerHTML = '';

        decks.forEach(deck => {
            const item = document.createElement('div');
            item.className = 'deck-selection-item';
            item.innerHTML = `
                <div class="deck-name">${deck.name}</div>
                <div class="deck-info">General: ${CardsDB.getCardById(deck.generalId)?.name || 'Desconhecido'}</div>
            `;
            item.onclick = () => this.startGameWithDeck(deck);
            list.appendChild(item);
        });

        modal.classList.remove('hidden');
    }

    startGameWithDeck(playerDeckData) {
        document.getElementById('deck-selection-modal').classList.add('hidden');
        this.currentMode = 'singleplayer';

        this.gameState = new GameState();
        this.combatSystem = new CombatSystem(this.gameState);
        this.gameState.combatSystem = this.combatSystem;

        this.aiOpponent = new AIOpponent(this.gameState, this.selectedDifficulty);
        this.aiOpponent.setPlayerId('player2');

        this.setupGameListeners();

        // Carregar deck do jogador
        const player1Deck = playerDeckData.cards;
        // Adicionar General ao deck se não estiver (embora deva estar salvo separado ou junto, vamos garantir)
        // No saveDeck, salvamos cards (IDs) e generalId. O GameState espera um array de IDs onde um é o General.
        // Vamos reconstruir o deck completo para o jogo
        const fullPlayerDeck = [playerDeckData.generalId, ...playerDeckData.cards];

        // Deck da IA (Starter Deck por enquanto, pode ser melhorado depois)
        const aiDeck = CardsDB.createStarterDeck('gen_ivin');

        this.gameState.startGame(fullPlayerDeck, aiDeck);

        this.showScreen('battlefield');
        this.renderBattlefield();
        this.gameState.startTurn();
    }

    setupGameListeners() {
        this.gameState.addEventListener('gameStarted', (event, data) => {
            console.log('Game started!', data);
        });

        // Single event listener for all game events
        this.gameState.addEventListener((event, data) => {
            switch (event) {
                case 'turnStarted':
                    console.log('Turn started:', data);
                    this.renderBattlefield();
                    if (data.playerId === 'player2') {
                        setTimeout(() => {
                            this.aiOpponent.takeTurn();
                        }, 1000);
                    }
                    break;

                case 'cardsDrawn':
                    this.renderBattlefield();
                    this.showNotification(`${data.cards.length} carta(s) comprada(s)!`);
                    break;

                case 'cardPlayed':
                    this.renderBattlefield();
                    this.showNotification(`${data.card.name} jogado!`);
                    break;

                case 'attackDeclared':
                    this.renderBattlefield();
                    this.showNotification(`${data.attacker} atacou ${data.target}!`);
                    this.showDamageNumber(data.result.damage, 'damage');
                    break;

                case 'creatureDestroyed':
                    this.renderBattlefield();
                    this.showNotification(`${data.creature.name} foi destruído!`);
                    break;

                case 'gameEnded':
                    this.showGameOver(data.winner);
                    break;

                case 'phaseChanged':
                    this.renderBattlefield();
                    this.updatePhaseIndicator(data.phase);
                    break;

                case 'combatPhaseComplete':
                    this.showNotification('Fase de combate concluída!');
                    // Auto-avançar para fase de fim
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

        // Update button state
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

        // Render hand
        const handElement = document.getElementById(`${prefix}-hand`);
        handElement.innerHTML = '';

        if (isControlled) {
            player.hand.forEach(card => {
                const cardEl = this.createCardElement(card, true);
                cardEl.addEventListener('click', () => this.onCardClick(card, playerId));

                // Drag & Drop
                cardEl.draggable = true;
                cardEl.addEventListener('dragstart', (e) => this.onDragStart(e, card));

                // Disable if not enough resources
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

        // Render field
        const fieldElement = document.getElementById(`${prefix}-field`);
        fieldElement.innerHTML = '';

        // Drop zone para equipar (para jogador controlado)
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

            // Indicador de "pode atacar"
            if (isControlled && this.gameState.currentPhase === 'combat' &&
                this.combatSystem.canAttack(card.instanceId)) {
                cardEl.classList.add('can-attack');
                cardEl.addEventListener('click', () => this.onFieldCardClick(card, playerId));
            }

            // Indicador se está atacando
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
    if(card.isSummoned) el.classList.add('summoned');
            if(this.selectedCard === card) el.classList.add('selected');

            // === VISUAL EFFECTS ===
            // Taunt
            if(card.keywords && card.keywords.includes('taunt')) {
                el.classList.add('effect-taunt');
    }
    // Divine Shield
    if(card.keywords && card.keywords.includes('divine_shield')) {
    el.classList.add('effect-divine-shield');
}
// Stealth
if (card.keywords && card.keywords.includes('stealth')) {
    el.classList.add('effect-stealth');
}
// Frozen
if (card.isFrozen) {
    el.classList.add('effect-frozen');
}
// Summoning Sickness (Sleep)
// Only show Zzz if it's a creature, on the field, and cannot attack yet
if (card.isSummoned && !card.canAttack && !card.keywords?.includes('rush')) {
    el.classList.add('effect-sleep');
}

// Determinar imagem da carta
let cardImage = 'assets/images/placeholder_card.png'; // Fallback

// Se for General, usar imagem específica
if (card.type === 'general') {
    const imgMap = {
        'human': 'gen_human.png',
        'elf': 'gen_elf.png',
        'orc': 'gen_orc.png',
        'dwarf': 'gen_dwarf.png',
        'deva': 'gen_deva.png'
    };
    cardImage = `assets/images/${imgMap[card.race] || 'gen_human.png'}`;
}
// Se tiver imagem definida no objeto card (futuro)
else if (card.image) {
    cardImage = `assets/images/${card.image}`;
}

// Lógica de Stats
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

// Click direito
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

getCardEmoji(card) {
    const emojiMap = {
        'human': '👤',
        'deva': '👼',
        'orc': '😈',
        'dwarf': '🧔',
        'elf': '🧝',
    };

    if (card.type === 'general') return '👑';
    if (card.type === 'equipment') return '⚔️';
    if (card.type === 'mount') return '🐴';
    if (card.type === 'consumable') return '🧪';
    if (card.type === 'ability') return '✨';

    return emojiMap[card.race] || '🃏';
}

getAbilityIcon(ability) {
    const icons = {
        'rush': '⚡',
        'taunt': '🛡️',
        'divine_shield': '✨',
        'lifesteal': '❤️'
    };
    return icons[ability] || '⭐';
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

// === DRAG & DROP ===
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

    // Play card
    this.playCardAction(card, 'player1');
}

// === CARD INTERACTIONS ===
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

    // Verificar recursos
    if (card.cost > player.warResources) {
        this.showNotification('Recursos insuficientes!');
        return;
    }

    // Tipos que precisam de alvo
    if (card.type === CardsDB.CARD_TYPES.EQUIPMENT) {
        this.targetMode = 'equip';
        this.selectedCard = card;
    }

    // Jogar carta normalmente
    const result = this.gameState.playCard(playerId, card.instanceId, {});

    if (!result.success) {
        this.showNotification(result.error);
    }

    this.selectedCard = null;
    this.renderBattlefield();
}

onFieldCardClick(card, playerId) {
    const currentPhase = this.gameState.currentPhase;
    const player = this.gameState.players[playerId];

    // Modo equipar
    if (this.targetMode === 'equip' && this.selectedCard) {
        const targetId = card.instanceId === player.general.instanceId ? 'general' : card.instanceId;
        const result = this.gameState.playCard(playerId, this.selectedCard.instanceId, { targetId });

        if (!result.success) {
            this.showNotification(result.error);
        }

        this.targetMode = null;
        this.selectedCard = null;
        this.renderBattlefield();
        return;
    }

    // Fase de combate
    if (currentPhase === 'combat') {
        if (playerId === this.gameState.currentPlayer) {
            // Selecionar atacante
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
            // Atacar alvo inimigo
            if (this.attackingCard) {
                this.executeAttack(this.attackingCard, card);
            }
        }
    }
}

executeAttack(attacker, target) {
    const targetId = target.instanceId;
    const result = this.combatSystem.declareAttack(attacker.instanceId, targetId);

    if (result.success) {
        this.attackingCard = null;
        this.renderBattlefield();
    } else {
        this.showNotification(result.error);
    }
}

endTurn() {
    if (!this.gameState) return;
    if (this.gameState.currentPlayer !== 'player1') return;

    this.attackingCard = null;
    this.selectedCard = null;
    this.targetMode = null;

    this.gameState.endTurn();
}

// === UI FEEDBACK ===
showNotification(message) {
    // Simple notification at top
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

showDamageNumber(damage, type = 'damage') {
    const battlefield = document.getElementById('battlefield');
    const num = document.createElement('div');
    num.className = type === 'damage' ? 'damage-number' : 'heal-number';
    num.textContent = `-${damage}`;
    num.style.left = '50%';
    num.style.top = '50%';
    battlefield.appendChild(num);

    setTimeout(() => num.remove(), 1000);
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
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;

    const yesBtn = document.getElementById('confirm-btn-yes');
    const noBtn = document.getElementById('confirm-btn-no');

    // Update button texts
    yesBtn.textContent = yesText;
    noBtn.textContent = noText;

    // Remove previous listeners
    const newYesBtn = yesBtn.cloneNode(true);
    const newNoBtn = noBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
    noBtn.parentNode.replaceChild(newNoBtn, noBtn);

    // Add new listeners
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

playCardAsDefender(cardData) {
    const result = this.gameState.playCard('player1', cardData.instanceId, { asDefender: true });
    if (!result.success) {
        this.showNotification(result.error);
    }
}

playCardAsEquipment(cardData) {
    this.targetMode = 'equip';
    this.selectedCard = cardData;
    this.showNotification('Selecione onde equipar');
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

// CSS Animations for notifications
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

// Initialize game
const game = new KardumGame();
window.kardumGame = game;
