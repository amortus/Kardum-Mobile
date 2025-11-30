// cards-database.js - Base de dados COMPLETA de cartas do Kardum
// Cartas inspiradas em Hearthstone e Magic, adaptadas ao Kardum

export const CARD_TYPES = {
  GENERAL: 'general',
  DEFENDER: 'defender',
  EQUIPMENT: 'equipment',
  MOUNT: 'mount',
  CONSUMABLE: 'consumable',
  ABILITY: 'ability'
};

export const RACES = {
  HUMAN: 'human',
  DEVA: 'deva',
  ORC: 'orc',
  DWARF: 'dwarf',
  ELF: 'elf'
};

export const CLASSES = {
  WARRIOR: 'warrior',
  BARBARIAN: 'barbarian',
  DRUID: 'druid',
  ELEMENTALIST: 'elementalist',
  NECROMANCER: 'necromancer',
  ARCHER: 'archer',
  ASSASSIN: 'assassin',
  CHIVALRY: 'chivalry'
};

export const ABILITIES = {
  RUSH: 'rush',
  TAUNT: 'taunt',
  DIVINE_SHIELD: 'divine_shield',
  LIFESTEAL: 'lifesteal',
  CHARGE: 'charge',
  DRAW_CARD: 'draw_card',
  BUFF_ALL: 'buff_all',
  DAMAGE_ALL: 'damage_all',
  STEALTH: 'stealth',
  REGENERATE: 'regenerate'
};

// ==================== BASE DE CARTAS COMPLETA ====================
export const CARDS_DATABASE = [

  // ========================================
  // GENERALS (5 raças)
  // ========================================
  {
    id: 'gen_absalon',
    name: 'Absalon, Rei Guerreiro',
    type: CARD_TYPES.GENERAL,
    race: RACES.HUMAN,
    class: CLASSES.WARRIOR,
    cost: 0,
    attack: 0,
    defense: 30,
    abilities: [],
    text: 'General Humano. Líder indomável das forças humanas.',
    rarity: 'legendary',
    artPath: 'assets/images/cards/gen_absalon_art.png'
  },
  {
    id: 'gen_griven',
    name: 'Griven Belafonte',
    type: CARD_TYPES.GENERAL,
    race: RACES.HUMAN,
    class: CLASSES.CHIVALRY,
    cost: 0,
    attack: 0,
    defense: 30,
    abilities: [],
    text: 'General Humano. Cavaleiro da ordem sagrada.',
    rarity: 'legendary',
    artPath: 'assets/images/cards/gen_griven_art.png'
  },
  {
    id: 'gen_ivin',
    name: 'Ivin Melfor',
    type: CARD_TYPES.GENERAL,
    race: RACES.ELF,
    class: CLASSES.ARCHER,
    cost: 0,
    attack: 0,
    defense: 30,
    abilities: [],
    text: 'General Élfico. Mestre arqueiro das florestas antigas.',
    rarity: 'legendary',
    artPath: 'assets/images/cards/gen_ivin_art.png'
  },
  {
    id: 'gen_lysandra',
    name: 'Lysandra, Luz Celestial',
    type: CARD_TYPES.GENERAL,
    race: RACES.DEVA,
    class: CLASSES.CHIVALRY,
    cost: 0,
    attack: 0,
    defense: 30,
    abilities: [ABILITIES.DIVINE_SHIELD],
    text: 'General Deva. Anjo guerreiro com escudo divino.',
    rarity: 'legendary',
    artPath: 'assets/images/cards/gen_lysandra_art.png'
  },
  {
    id: 'gen_grommash',
    name: 'Grommash Grito Infernal',
    type: CARD_TYPES.GENERAL,
    race: RACES.ORC,
    class: CLASSES.BARBARIAN,
    cost: 0,
    attack: 0,
    defense: 30,
    abilities: [],
    text: 'General Orc. Senhor da guerra brutal e implacável.',
    rarity: 'legendary',
    artPath: 'assets/images/cards/gen_grommash_art.png'
  },
  {
    id: 'gen_thorin',
    name: 'Thorin Martelo de Pedra',
    type: CARD_TYPES.GENERAL,
    race: RACES.DWARF,
    class: CLASSES.WARRIOR,
    cost: 0,
    attack: 0,
    defense: 30,
    abilities: [],
    text: 'General Anão. Mestre ferreiro e guardião das montanhas.',
    rarity: 'legendary',
    artPath: 'assets/images/cards/gen_thorin_art.png'
  },

  // ========================================
  // DEFENDERS - HUMANOS
  // ========================================
  {
    id: 'def_h001',
    name: 'Recruta da Guarda',
    type: CARD_TYPES.DEFENDER,
    race: RACES.HUMAN,
    cost: 1,
    attack: 1,
    defense: 2,
    abilities: [],
    text: 'Soldado básico. Jovem e determinado.',
    rarity: 'common',
    artPath: 'assets/images/cards/def_h001_art.png'
  },
  {
    id: 'def_h002',
    name: 'Lanceiro Veterano',
    type: CARD_TYPES.DEFENDER,
    race: RACES.HUMAN,
    cost: 2,
    attack: 2,
    defense: 3,
    abilities: [],
    text: 'Guerreiro experiente com lança longa.',
    rarity: 'common'
  },
  {
    id: 'def_h003',
    name: 'Cavaleiro Real',
    type: CARD_TYPES.DEFENDER,
    race: RACES.HUMAN,
    cost: 3,
    attack: 3,
    defense: 3,
    abilities: [],
    text: 'Cavaleiro montado da ordem real.',
    rarity: 'common'
  },
  {
    id: 'def_h004',
    name: 'Paladino Sagrado',
    type: CARD_TYPES.DEFENDER,
    race: RACES.HUMAN,
    cost: 4,
    attack: 3,
    defense: 5,
    abilities: [ABILITIES.DIVINE_SHIELD],
    text: 'Guerreiro santo. Imune ao primeiro dano.',
    rarity: 'rare'
  },
  {
    id: 'def_h005',
    name: 'Campeão do Reino',
    type: CARD_TYPES.DEFENDER,
    race: RACES.HUMAN,
    cost: 5,
    attack: 5,
    defense: 5,
    abilities: [],
    text: 'Elite do exército. Temido em batalha.',
    rarity: 'epic'
  },
  {
    id: 'def_h006',
    name: 'Clérigo Curador',
    type: CARD_TYPES.DEFENDER,
    race: RACES.HUMAN,
    cost: 3,
    attack: 1,
    defense: 4,
    abilities: [ABILITIES.LIFESTEAL],
    text: 'Cura ao causar dano.',
    rarity: 'rare'
  },
  {
    id: 'def_h007',
    name: 'Guardião da Muralha',
    type: CARD_TYPES.DEFENDER,
    race: RACES.HUMAN,
    cost: 4,
    attack: 2,
    defense: 7,
    abilities: [ABILITIES.TAUNT],
    text: 'Deve ser alvo de ataques. Defesa impenetrável.',
    rarity: 'rare'
  },

  // ========================================
  // DEFENDERS - ELFOS
  // ========================================
  {
    id: 'def_e001',
    name: 'Sentinela Élfico',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 1,
    attack: 2,
    defense: 1,
    abilities: [],
    text: 'Guardião ágil. Ataque rápido.',
    rarity: 'common'
  },
  {
    id: 'def_e002',
    name: 'Arqueiro Florestal',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 2,
    attack: 3,
    defense: 2,
    abilities: [],
    text: 'Arqueiro preciso das florestas.',
    rarity: 'common'
  },
  {
    id: 'def_e003',
    name: 'Guardião da Natureza',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 3,
    attack: 2,
    defense: 5,
    abilities: [ABILITIES.TAUNT],
    text: 'Protetor das árvores antigas. Taunt.',
    rarity: 'rare'
  },
  {
    id: 'def_e004',
    name: 'Mestre Arqueiro',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 4,
    attack: 5,
    defense: 3,
    abilities: [],
    text: 'Lendário com o arco. Precisão mortal.',
    rarity: 'epic'
  },
  {
    id: 'def_e005',
    name: 'Ancião Druida',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 5,
    attack: 2,
    defense: 6,
    abilities: [ABILITIES.LIFESTEAL],
    text: 'Sabedoria ancestral. Cura ao atacar.',
    rarity: 'epic'
  },
  {
    id: 'def_e006',
    name: 'Caçador das Sombras',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 3,
    attack: 4,
    defense: 2,
    abilities: [ABILITIES.STEALTH],
    text: 'Furtivo. Primeira vez que ataca causa dano dobrado.',
    rarity: 'rare'
  },
  {
    id: 'def_e007',
    name: 'Curador da Floresta',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 4,
    attack: 1,
    defense: 5,
    abilities: [ABILITIES.REGENERATE],
    text: 'Regenera 1 de vida no início do seu turno.',
    rarity: 'rare'
  },
  {
    id: 'def_e008',
    name: 'Espírito do Bosque',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 6,
    attack: 4,
    defense: 6,
    abilities: [ABILITIES.DIVINE_SHIELD, ABILITIES.LIFESTEAL],
    text: 'Espírito ancestral com múltiplas proteções.',
    rarity: 'legendary'
  },

  // ========================================
  // DEFENDERS - DEVAS
  // ========================================
  {
    id: 'def_d001',
    name: 'Anjo Guardião',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DEVA,
    cost: 2,
    attack: 1,
    defense: 4,
    abilities: [ABILITIES.DIVINE_SHIELD],
    text: 'Protetor celestial com escudo divino.',
    rarity: 'common'
  },
  {
    id: 'def_d002',
    name: 'Guerreiro Alado',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DEVA,
    cost: 3,
    attack: 3,
    defense: 3,
    abilities: [ABILITIES.RUSH],
    text: 'Pode atacar no turno que entra.',
    rarity: 'common'
  },
  {
    id: 'def_d003',
    name: 'Arauto Divino',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DEVA,
    cost: 4,
    attack: 2,
    defense: 5,
    abilities: [ABILITIES.TAUNT, ABILITIES.DIVINE_SHIELD],
    text: 'Deve ser alvo. Escudo divino.',
    rarity: 'rare'
  },
  {
    id: 'def_d004',
    name: 'Serafim de Batalha',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DEVA,
    cost: 5,
    attack: 4,
    defense: 4,
    abilities: [ABILITIES.LIFESTEAL],
    text: 'Anjo guerreiro. Cura ao causar dano.',
    rarity: 'epic'
  },
  {
    id: 'def_d005',
    name: 'Arcanjo Vingador',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DEVA,
    cost: 6,
    attack: 5,
    defense: 5,
    abilities: [ABILITIES.DIVINE_SHIELD, ABILITIES.RUSH],
    text: 'Poder celestial supremo.',
    rarity: 'legendary'
  },
  {
    id: 'def_d006',
    name: 'Luz Curadora',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DEVA,
    cost: 3,
    attack: 1,
    defense: 3,
    abilities: [],
    text: 'Ao entrar: Cure 3 de vida em seu General.',
    rarity: 'rare',
    effect: { type: 'heal', target: 'self_general', amount: 3, onPlay: true }
  },

  // ========================================
  // DEFENDERS - ORCS
  // ========================================
  {
    id: 'def_o001',
    name: 'Guerreiro Orc',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ORC,
    cost: 1,
    attack: 2,
    defense: 1,
    abilities: [],
    text: 'Agressivo e direto. Alto ataque.',
    rarity: 'common'
  },
  {
    id: 'def_o002',
    name: 'Saqueador Brutal',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ORC,
    cost: 2,
    attack: 3,
    defense: 2,
    abilities: [],
    text: 'Saqueia e destrói tudo no caminho.',
    rarity: 'common'
  },
  {
    id: 'def_o003',
    name: 'Berserker',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ORC,
    cost: 3,
    attack: 5,
    defense: 2,
    abilities: [],
    text: 'Fúria absoluta. Ataque devastador.',
    rarity: 'rare'
  },
  {
    id: 'def_o004',
    name: 'Chefe de Guerra',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ORC,
    cost: 4,
    attack: 4,
    defense: 4,
    abilities: [],
    text: 'Líder do clã. Forte e resistente.',
    rarity: 'epic'
  },
  {
    id: 'def_o005',
    name: 'Lobo das Sombras',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ORC,
    cost: 3,
    attack: 4,
    defense: 3,
    abilities: [ABILITIES.RUSH],
    text: 'Montaria orc. Ataca imediatamente.',
    rarity: 'rare'
  },
  {
    id: 'def_o006',
    name: 'Xamã Orc',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ORC,
    cost: 4,
    attack: 2,
    defense: 5,
    abilities: [ABILITIES.LIFESTEAL],
    text: 'Magia sombria. Drena vida.',
    rarity: 'rare'
  },
  {
    id: 'def_o007',
    name: 'Titã de Ferro',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ORC,
    cost: 6,
    attack: 6,
    defense: 6,
    abilities: [ABILITIES.TAUNT],
    text: 'Colosso orc. Deve ser alvo de ataques.',
    rarity: 'legendary'
  },

  // ========================================
  // DEFENDERS - ANÕES
  // ========================================
  {
    id: 'def_dw001',
    name: 'Mineiro Anão',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DWARF,
    cost: 1,
    attack: 1,
    defense: 3,
    abilities: [],
    text: 'Robusto e resistente.',
    rarity: 'common'
  },
  {
    id: 'def_dw002',
    name: 'Guardião das Minas',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DWARF,
    cost: 2,
    attack: 2,
    defense: 4,
    abilities: [],
    text: 'Defensor das profundezas.',
    rarity: 'common'
  },
  {
    id: 'def_dw003',
    name: 'Quebra-Pedras',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DWARF,
    cost: 3,
    attack: 3,
    defense: 5,
    abilities: [ABILITIES.TAUNT],
    text: 'Muralha viva. Deve ser alvo.',
    rarity: 'rare'
  },
  {
    id: 'def_dw004',
    name: 'Mestre Ferreiro',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DWARF,
    cost: 4,
    attack: 2,
    defense: 6,
    abilities: [],
    text: 'Ao entrar: Equipe um equipamento aleatório.',
    rarity: 'epic'
  },
  {
    id: 'def_dw005',
    name: 'Rei da Montanha',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DWARF,
    cost: 5,
    attack: 4,
    defense: 7,
    abilities: [ABILITIES.TAUNT],
    text: 'Soberano inabalável das montanhas.',
    rarity: 'epic'
  },
  {
    id: 'def_dw006',
    name: 'Atirador de Elite',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DWARF,
    cost: 3,
    attack: 4,
    defense: 3,
    abilities: [],
    text: 'Precisão anã com rifles.',
    rarity: 'rare'
  },
  {
    id: 'def_dw007',
    name: 'Golem de Pedra',
    type: CARD_TYPES.DEFENDER,
    race: RACES.DWARF,
    cost: 6,
    attack: 5,
    defense: 8,
    abilities: [ABILITIES.TAUNT, ABILITIES.DIVINE_SHIELD],
    text: 'Construção anã indestrutível.',
    rarity: 'legendary'
  },

  // ========================================
  // EQUIPAMENTOS POR RAÇA
  // ========================================

  // Humanos
  {
    id: 'eq_h001',
    name: 'Espada Longa',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.HUMAN,
    cost: 2,
    attack: 2,
    defense: 0,
    abilities: [],
    text: '+2 Ataque.',
    rarity: 'common'
  },
  {
    id: 'eq_h002',
    name: 'Escudo Real',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.HUMAN,
    cost: 2,
    attack: 0,
    defense: 3,
    abilities: [],
    text: '+3 Defesa.',
    rarity: 'common'
  },
  {
    id: 'eq_h003',
    name: 'Excalibur',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.HUMAN,
    cost: 5,
    attack: 5,
    defense: 0,
    abilities: [],
    text: 'Espada lendária. +5 Ataque.',
    rarity: 'legendary'
  },

  // Elfos
  {
    id: 'eq_e001',
    name: 'Arco Élfico',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.ELF,
    cost: 3,
    attack: 3,
    defense: 0,
    abilities: [],
    text: 'Arco mágico. +3 Ataque.',
    rarity: 'rare'
  },
  {
    id: 'eq_e002',
    name: 'Manto da Floresta',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.ELF,
    cost: 2,
    attack: 0,
    defense: 2,
    abilities: [ABILITIES.STEALTH],
    text: '+2 Defesa. Stealth na primeira vez.',
    rarity: 'rare'
  },
  {
    id: 'eq_e003',
    name: 'Lâmina das Folhas',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.ELF,
    cost: 3,
    attack: 3,
    defense: 1,
    abilities: [],
    text: 'Espada élfica mágica.',
    rarity: 'epic'
  },

  // Devas
  {
    id: 'eq_d001',
    name: 'Lança Sagrada',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.DEVA,
    cost: 3,
    attack: 3,
    defense: 0,
    abilities: [],
    text: 'Lança divina. +3 Ataque.',
    rarity: 'rare'
  },
  {
    id: 'eq_d002',
    name: 'Armadura Celestial',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.DEVA,
    cost: 4,
    attack: 0,
    defense: 4,
    abilities: [ABILITIES.DIVINE_SHIELD],
    text: '+4 Defesa. Concede Divine Shield.',
    rarity: 'epic'
  },

  // Orcs
  {
    id: 'eq_o001',
    name: 'Machado de Guerra',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.ORC,
    cost: 3,
    attack: 4,
    defense: 0,
    abilities: [],
    text: 'Machado brutal. +4 Ataque.',
    rarity: 'rare'
  },
  {
    id: 'eq_o002',
    name: 'Armadura de Couro',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.ORC,
    cost: 2,
    attack: 0,
    defense: 3,
    abilities: [],
    text: 'Proteção rústica. +3 Defesa.',
    rarity: 'common'
  },

  // Anões
  {
    id: 'eq_dw001',
    name: 'Martelo Rúnico',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.DWARF,
    cost: 4,
    attack: 4,
    defense: 0,
    abilities: [],
    text: 'Martelo mágico anão. +4 Ataque.',
    rarity: 'epic'
  },
  {
    id: 'eq_dw002',
    name: 'Armadura de Mithril',
    type: CARD_TYPES.EQUIPMENT,
    race: RACES.DWARF,
    cost: 4,
    attack: 0,
    defense: 5,
    abilities: [],
    text: 'Metal lendário. +5 Defesa.',
    rarity: 'epic'
  },

  // ========================================
  // MONTARIAS
  // ========================================
  {
    id: 'mnt_h001',
    name: 'Cavalo de Guerra',
    type: CARD_TYPES.MOUNT,
    race: RACES.HUMAN,
    cost: 3,
    attack: 2,
    defense: 2,
    abilities: [],
    text: 'Defensor ou +2/+2 se equipado.',
    rarity: 'rare'
  },
  {
    id: 'mnt_e001',
    name: 'Corcel Élfico',
    type: CARD_TYPES.MOUNT,
    race: RACES.ELF,
    cost: 3,
    attack: 3,
    defense: 2,
    abilities: [ABILITIES.RUSH],
    text: 'Rush. Pode ser equipado.',
    rarity: 'rare'
  },
  {
    id: 'mnt_d001',
    name: 'Pégaso Celestial',
    type: CARD_TYPES.MOUNT,
    race: RACES.DEVA,
    cost: 4,
    attack: 3,
    defense: 3,
    abilities: [ABILITIES.DIVINE_SHIELD],
    text: 'Montaria voadora com proteção divina.',
    rarity: 'epic'
  },
  {
    id: 'mnt_o001',
    name: 'Lobo Gigante',
    type: CARD_TYPES.MOUNT,
    race: RACES.ORC,
    cost: 3,
    attack: 4,
    defense: 2,
    abilities: [ABILITIES.RUSH],
    text: 'Besta selvagem. Rush.',
    rarity: 'rare'
  },
  {
    id: 'mnt_dw001',
    name: 'Carneiro de Batalha',
    type: CARD_TYPES.MOUNT,
    race: RACES.DWARF,
    cost: 4,
    attack: 2,
    defense: 4,
    abilities: [ABILITIES.TAUNT],
    text: 'Montaria anã resistente.',
    rarity: 'rare'
  },

  // ========================================
  // CONSUMÍVEIS
  // ========================================
  {
    id: 'con_001',
    name: 'Poção de Cura Menor',
    type: CARD_TYPES.CONSUMABLE,
    race: null,
    cost: 1,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Restaura 3 de vida ao General.',
    rarity: 'common',
    effect: { type: 'heal', target: 'self_general', amount: 3 }
  },
  {
    id: 'con_002',
    name: 'Poção de Cura',
    type: CARD_TYPES.CONSUMABLE,
    race: null,
    cost: 2,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Restaura 5 de vida ao General.',
    rarity: 'common',
    effect: { type: 'heal', target: 'self_general', amount: 5 }
  },
  {
    id: 'con_003',
    name: 'Bênção Divina',
    type: CARD_TYPES.CONSUMABLE,
    race: RACES.DEVA,
    cost: 2,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Compre 2 cartas.',
    rarity: 'rare',
    effect: { type: 'draw', amount: 2 }
  },
  {
    id: 'con_004',
    name: 'Fúria de Batalha',
    type: CARD_TYPES.CONSUMABLE,
    race: RACES.ORC,
    cost: 2,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Ganhe +2 Recursos de Guerra neste turno.',
    rarity: 'common',
    effect: { type: 'add_resources', amount: 2 }
  },
  {
    id: 'con_005',
    name: 'Chuva de Flechas',
    type: CARD_TYPES.CONSUMABLE,
    race: RACES.ELF,
    cost: 3,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Causa 2 de dano a TODOS os Defensores inimigos.',
    rarity: 'rare',
    effect: { type: 'damage_all_enemy', amount: 2 }
  },
  {
    id: 'con_006',
    name: 'Elixir de Força',
    type: CARD_TYPES.CONSUMABLE,
    race: null,
    cost: 3,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Todas suas criaturas ganham +2 Ataque neste turno.',
    rarity: 'rare',
    effect: { type: 'buff_all_attack', amount: 2 }
  },
  {
    id: 'con_007',
    name: 'Escudo Místico',
    type: CARD_TYPES.CONSUMABLE,
    race: null,
    cost: 2,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Todas suas criaturas ganham Divine Shield.',
    rarity: 'epic',
    effect: { type: 'give_divine_shield' }
  },

  // ========================================
  // HABILIDADES POR CLASSE
  // ========================================

  // Warrior
  {
    id: 'ab_w001',
    name: 'Golpe Heroico',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.WARRIOR,
    cost: 3,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Causa 4 de dano a um alvo.',
    rarity: 'common',
    effect: { type: 'damage', amount: 4 }
  },
  {
    id: 'ab_w002',
    name: 'Grito de Guerra',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.WARRIOR,
    cost: 4,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Todas suas criaturas ganham +2/+1.',
    rarity: 'rare',
    effect: { type: 'buff_all', attack: 2, defense: 1 }
  },

  // Chivalry
  {
    id: 'ab_c001',
    name: 'Inspirar Tropas',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.CHIVALRY,
    cost: 3,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Todos seus Defensores ganham +1/+1.',
    rarity: 'rare',
    effect: { type: 'buff_all', attack: 1, defense: 1 }
  },
  {
    id: 'ab_c002',
    name: 'Luz Curativa',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.CHIVALRY,
    cost: 2,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Cure 4 de vida em seu General.',
    rarity: 'common',
    effect: { type: 'heal', target: 'self_general', amount: 4 }
  },

  // Archer
  {
    id: 'ab_a001',
    name: 'Flecha Perfurante',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.ARCHER,
    cost: 2,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Causa 3 de dano ignorando Divine Shield.',
    rarity: 'common',
    effect: { type: 'damage', amount: 3, piercing: true }
  },
  {
    id: 'ab_a002',
    name: 'Rajada de Flechas',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.ARCHER,
    cost: 4,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Causa 1 de dano a TODAS as criaturas inimigas.',
    rarity: 'rare',
    effect: { type: 'damage_all_enemy', amount: 1 }
  },

  // Druid
  {
    id: 'ab_dr001',
    name: 'Chamado da Floresta',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.DRUID,
    cost: 4,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Invoque uma criatura 2/2 Sentinela.',
    rarity: 'rare',
    effect: { type: 'summon', creatureId: 'token_sentinela' }
  },
  {
    id: 'ab_dr002',
    name: 'Regeneração Natural',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.DRUID,
    cost: 3,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Cure 3 de vida em todas suas criaturas.',
    rarity: 'rare',
    effect: { type: 'heal_all_friendly', amount: 3 }
  },

  // Barbarian
  {
    id: 'ab_b001',
    name: 'Fúria Incontrolável',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.BARBARIAN,
    cost: 3,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Todas suas criaturas ganham +3 Ataque mas perdem 1 Defesa.',
    rarity: 'rare',
    effect: { type: 'buff_all', attack: 3, defense: -1 }
  },
  {
    id: 'ab_b002',
    name: 'Massacre',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.BARBARIAN,
    cost: 5,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Causa 6 de dano a um alvo.',
    rarity: 'epic',
    effect: { type: 'damage', amount: 6 }
  },

  // Elementalist
  {
    id: 'ab_el001',
    name: 'Bola de Fogo',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.ELEMENTALIST,
    cost: 5,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Causa 6 de dano a um alvo.',
    rarity: 'epic',
    effect: { type: 'damage', amount: 6 }
  },
  {
    id: 'ab_el002',
    name: 'Explosão de Gelo',
    type: CARD_TYPES.ABILITY,
    race: null,
    class: CLASSES.ELEMENTALIST,
    cost: 4,
    attack: 0,
    defense: 0,
    abilities: [],
    text: 'Causa 2 de dano em área a todos inimigos.',
    rarity: 'rare',
    effect: { type: 'damage_all_enemy', amount: 2 }
  },

  // Tokens (criaturas invocadas)
  {
    id: 'token_sentinela',
    name: 'Sentinela Invocado',
    type: CARD_TYPES.DEFENDER,
    race: RACES.ELF,
    cost: 0,
    attack: 2,
    defense: 2,
    abilities: [],
    text: 'Token. Invocado por habilidades.',
    rarity: 'common'
  }
];

// ==================== FUNÇÕES UTILITÁRIAS ====================

export function getCardById(id) {
  return CARDS_DATABASE.find(card => card.id === id);
}

export function getCardsByType(type) {
  return CARDS_DATABASE.filter(card => card.type === type);
}

export function getCardsByRace(race) {
  return CARDS_DATABASE.filter(card => card.race === race);
}

export function getGeneralsByRace(race) {
  return CARDS_DATABASE.filter(card =>
    card.type === CARD_TYPES.GENERAL && card.race === race
  );
}

export function getGeneralsByClass(className) {
  return CARDS_DATABASE.filter(card =>
    card.type === CARD_TYPES.GENERAL && card.class === className
  );
}

// Criar deck balanceado por General/Raça
export function createStarterDeck(generalId) {
  const general = getCardById(generalId);
  if (!general || general.type !== CARD_TYPES.GENERAL) {
    throw new Error('General inválido');
  }

  const deck = [generalId];
  const race = general.race;

  // Pegar cartas da mesma raça
  const raceDefenders = getCardsByRace(race).filter(c => c.type === CARD_TYPES.DEFENDER && c.cost <= 5);
  const raceEquipments = getCardsByRace(race).filter(c => c.type === CARD_TYPES.EQUIPMENT);
  const raceMounts = getCardsByRace(race).filter(c => c.type === CARD_TYPES.MOUNT);
  const raceConsumables = getCardsByRace(race).filter(c => c.type === CARD_TYPES.CONSUMABLE);

  // Consumíveis neutros
  const neutralConsumables = CARDS_DATABASE.filter(c =>
    c.type === CARD_TYPES.CONSUMABLE && c.race === null
  );

  // Habilidades da classe do General
  const classAbilities = CARDS_DATABASE.filter(c =>
    c.type === CARD_TYPES.ABILITY && c.class === general.class
  );

  // Montar deck (30-40 cartas)
  // 18 Defensores
  for (let i = 0; i < 18 && raceDefenders.length > 0; i++) {
    const card = raceDefenders[i % raceDefenders.length];
    deck.push(card.id);
  }

  // 6 Equipamentos
  for (let i = 0; i < 6 && raceEquipments.length > 0; i++) {
    const card = raceEquipments[i % raceEquipments.length];
    deck.push(card.id);
  }

  // 2 Montarias
  for (let i = 0; i < 2 && raceMounts.length > 0; i++) {
    const card = raceMounts[i % raceMounts.length];
    deck.push(card.id);
  }

  // 6 Consumíveis (mix raça + neutro)
  const allConsumables = [...raceConsumables, ...neutralConsumables];
  for (let i = 0; i < 6 && allConsumables.length > 0; i++) {
    const card = allConsumables[i % allConsumables.length];
    deck.push(card.id);
  }

  // 2 Habilidades
  for (let i = 0; i < 2 && classAbilities.length > 0; i++) {
    const card = classAbilities[i % classAbilities.length];
    deck.push(card.id);
  }

  return deck;
}

// Validar deck
export function validateDeck(deck) {
  if (deck.length < 30 || deck.length > 40) {
    return { valid: false, error: 'Deck deve ter entre 30 e 40 cartas' };
  }

  const generals = deck.filter(id => {
    const card = getCardById(id);
    return card && card.type === CARD_TYPES.GENERAL;
  });

  if (generals.length !== 1) {
    return { valid: false, error: 'Deck deve ter exatamente 1 General' };
  }

  return { valid: true };
}

export default {
  CARD_TYPES,
  RACES,
  CLASSES,
  ABILITIES,
  CARDS_DATABASE,
  getCardById,
  getCardsByType,
  getCardsByRace,
  getGeneralsByRace,
  getGeneralsByClass,
  createStarterDeck,
  validateDeck
};
