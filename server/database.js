// server/database.js - Gestão de banco de dados SQLite
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
function initDatabase() {
    // Users table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT UNIQUE,
      elo_casual INTEGER DEFAULT 1000,
      elo_ranked INTEGER DEFAULT 1000,
      total_matches INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      is_admin INTEGER DEFAULT 0
    )
  `);

    // Cards table
    db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      race TEXT,
      class TEXT,
      cost INTEGER NOT NULL,
      attack INTEGER,
      defense INTEGER,
      abilities TEXT,
      text TEXT,
      rarity TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1
    )
  `);

    // Decks table
    db.exec(`
    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      general_id TEXT NOT NULL,
      cards TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

    // Matches table
    db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player1_id INTEGER NOT NULL,
      player2_id INTEGER,
      winner_id INTEGER,
      match_type TEXT NOT NULL,
      duration_seconds INTEGER,
      player1_deck TEXT,
      player2_deck TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (player1_id) REFERENCES users(id),
      FOREIGN KEY (player2_id) REFERENCES users(id),
      FOREIGN KEY (winner_id) REFERENCES users(id)
    )
  `);

    // Admin logs table
    db.exec(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users(id)
    )
  `);

    console.log('✅ Database initialized');
}

// Seed initial data
function seedDatabase() {
    const count = db.prepare('SELECT COUNT(*) as count FROM users').get();

    if (count.count === 0) {
        // Create default admin user
        const bcrypt = require('bcrypt');
        const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

        db.prepare(`
      INSERT INTO users (username, password_hash, email, is_admin)
      VALUES (?, ?, ?, 1)
    `).run(process.env.ADMIN_USERNAME || 'admin', adminPassword, 'admin@kardum.com');

        console.log('✅ Admin user created');
    }
}

// Initialize and seed
initDatabase();
seedDatabase();

// Export database and common functions
module.exports = {
    db,

    // User functions
    getUserById: (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id),
    getUserByUsername: (username) => db.prepare('SELECT * FROM users WHERE username = ?').get(username),
    createUser: (username, passwordHash, email) => {
        return db.prepare('INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)').run(username, passwordHash, email);
    },
    updateUserElo: (userId, type, newElo) => {
        const column = type === 'casual' ? 'elo_casual' : 'elo_ranked';
        return db.prepare(`UPDATE users SET ${column} = ? WHERE id = ?`).run(newElo, userId);
    },

    // Card functions
    getAllCards: () => db.prepare('SELECT * FROM cards WHERE is_active = 1').all(),
    getCardById: (id) => db.prepare('SELECT * FROM cards WHERE id = ?').get(id),
    createCard: (card) => {
        return db.prepare(`
      INSERT INTO cards (id, name, type, race, class, cost, attack, defense, abilities, text, rarity, image_url)
      VALUES (@id, @name, @type, @race, @class, @cost, @attack, @defense, @abilities, @text, @rarity, @image_url)
    `).run(card);
    },
    updateCard: (id, card) => {
        return db.prepare(`
      UPDATE cards 
      SET name = @name, type = @type, race = @race, class = @class, 
          cost = @cost, attack = @attack, defense = @defense, 
          abilities = @abilities, text = @text, rarity = @rarity, 
          image_url = @image_url, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `).run({ ...card, id });
    },
    deleteCard: (id) => {
        return db.prepare('UPDATE cards SET is_active = 0 WHERE id = ?').run(id);
    },

    // Deck functions
    getUserDecks: (userId) => {
        const decks = db.prepare('SELECT * FROM decks WHERE user_id = ? ORDER BY updated_at DESC').all(userId);
        return decks.map(deck => {
            let cards = [];
            try {
                cards = JSON.parse(deck.cards);
            } catch (e) {
                cards = [];
            }
            return {
                id: deck.id,
                user_id: deck.user_id,
                name: deck.name,
                generalId: deck.general_id || null,
                cards: cards,
                created_at: deck.created_at,
                updated_at: deck.updated_at
            };
        });
    },
    getDeckById: (deckId) => {
        const deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(deckId);
        if (!deck) return null;
        let cards = [];
        try {
            cards = JSON.parse(deck.cards);
        } catch (e) {
            cards = [];
        }
        return {
            id: deck.id,
            user_id: deck.user_id,
            name: deck.name,
            general_id: deck.general_id || null,
            cards: deck.cards, // Mantém como string para compatibilidade
            created_at: deck.created_at,
            updated_at: deck.updated_at
        };
    },
    createDeck: (userId, deckData) => {
        return db.prepare('INSERT INTO decks (user_id, name, general_id, cards) VALUES (?, ?, ?, ?)').run(
            userId,
            deckData.name,
            deckData.generalId,
            JSON.stringify(Array.isArray(deckData.cards) ? deckData.cards : [])
        );
    },
    updateDeck: (deckId, userId, deckData) => {
        return db.prepare(`
            UPDATE decks 
            SET name = ?, general_id = ?, cards = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        `).run(
            deckData.name,
            deckData.generalId,
            JSON.stringify(Array.isArray(deckData.cards) ? deckData.cards : JSON.parse(deckData.cards || '[]')),
            deckId,
            userId
        );
    },
    deleteDeck: (deckId, userId) => {
        return db.prepare('DELETE FROM decks WHERE id = ? AND user_id = ?').run(deckId, userId);
    },

    // Match functions
    createMatch: (player1Id, player2Id, matchType) => {
        return db.prepare(`
      INSERT INTO matches (player1_id, player2_id, match_type)
      VALUES (?, ?, ?)
    `).run(player1Id, player2Id, matchType);
    },
    endMatch: (matchId, winnerId, duration) => {
        return db.prepare(`
      UPDATE matches 
      SET winner_id = ?, duration_seconds = ?
      WHERE id = ?
    `).run(winnerId, duration, matchId);
    },

    // Admin log
    logAdminAction: (adminId, action, details) => {
        return db.prepare(`
      INSERT INTO admin_logs (admin_id, action, details)
      VALUES (?, ?, ?)
    `).run(adminId, action, JSON.stringify(details));
    }
};
