// server/database.js - Gestão de banco de dados (SQLite ou PostgreSQL)
const path = require('path');

let db;
let dbType = 'sqlite';
let usePostgres = false;

// Detectar qual banco usar
if (process.env.DATABASE_URL) {
    // PostgreSQL (Railway/Produção)
    usePostgres = true;
    dbType = 'postgres';
    const { Pool } = require('pg');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    db = pool;
    console.log('✅ Using PostgreSQL database');
} else {
    // SQLite (Desenvolvimento local)
    const Database = require('better-sqlite3');
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../database.sqlite');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
    console.log('✅ Using SQLite database');
}

// Helper functions para abstrair diferenças entre SQLite e PostgreSQL
const dbHelpers = {
    // Executar query sem retorno (CREATE TABLE, etc)
    async exec(sql) {
        if (usePostgres) {
            // Converter SQLite syntax para PostgreSQL
            const pgSql = convertToPostgresSQL(sql);
            await db.query(pgSql);
        } else {
            // SQLite exec é síncrono
            return new Promise((resolve, reject) => {
                try {
                    db.exec(sql);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        }
    },

    // Query que retorna uma linha
    async query(sql, params = []) {
        if (usePostgres) {
            const pgSql = convertToPostgresSQL(sql);
            const pgParams = convertParams(params);
            const result = await db.query(pgSql, pgParams);
            return result.rows[0] || null;
        } else {
            const stmt = db.prepare(sql);
            return stmt.get(...params) || null;
        }
    },

    // Query que retorna múltiplas linhas
    async queryAll(sql, params = []) {
        if (usePostgres) {
            const pgSql = convertToPostgresSQL(sql);
            const pgParams = convertParams(params);
            const result = await db.query(pgSql, pgParams);
            return result.rows;
        } else {
            const stmt = db.prepare(sql);
            return stmt.all(...params);
        }
    },

    // Executar INSERT/UPDATE/DELETE
    async run(sql, params = []) {
        if (usePostgres) {
            let pgSql = convertToPostgresSQL(sql);
            const pgParams = convertParams(params);
            
            // Para INSERTs, adicionar RETURNING id se não tiver
            if (sql.trim().toUpperCase().startsWith('INSERT') && !pgSql.includes('RETURNING')) {
                // Extrair nome da tabela
                const tableMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
                if (tableMatch) {
                    pgSql = pgSql.replace(/;?\s*$/, '') + ' RETURNING id';
                }
            }
            
            const result = await db.query(pgSql, pgParams);
            
            // Obter ID do INSERT
            let insertId = null;
            if (sql.trim().toUpperCase().startsWith('INSERT')) {
                if (result.rows && result.rows.length > 0 && result.rows[0].id) {
                    insertId = result.rows[0].id;
                }
            }
            
            return {
                lastInsertRowid: insertId,
                changes: result.rowCount || 0
            };
        } else {
            const stmt = db.prepare(sql);
            const info = stmt.run(...params);
            return {
                lastInsertRowid: info.lastInsertRowid,
                changes: info.changes
            };
        }
    }
};

// Converter SQLite SQL para PostgreSQL
function convertToPostgresSQL(sql) {
    let pgSql = sql;
    
    // Primeiro, converter named parameters @param para $1, $2, etc (se houver)
    const namedParams = new Map();
    let namedIndex = 1;
    pgSql = pgSql.replace(/@(\w+)/g, (match, paramName) => {
        if (!namedParams.has(paramName)) {
            namedParams.set(paramName, namedIndex++);
        }
        return `$${namedParams.get(paramName)}`;
    });
    
    // Depois, converter placeholders ? para $1, $2, $3 (apenas se não tiver named params)
    if (namedParams.size === 0) {
        let paramIndex = 1;
        pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);
    }
    
    return pgSql;
}

// Converter parâmetros de array para array (PostgreSQL) ou manter array (SQLite)
function convertParams(params) {
    // Ambos usam arrays, então apenas retornar o array
    return Array.isArray(params) ? params : [params];
}

// Create tables
async function initDatabase() {
    if (usePostgres) {
        // PostgreSQL schema
        await dbHelpers.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email VARCHAR(255) UNIQUE,
                elo_casual INTEGER DEFAULT 1000,
                elo_ranked INTEGER DEFAULT 1000,
                total_matches INTEGER DEFAULT 0,
                wins INTEGER DEFAULT 0,
                losses INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                is_admin INTEGER DEFAULT 0
            )
        `);

        await dbHelpers.exec(`
            CREATE TABLE IF NOT EXISTS cards (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                race VARCHAR(50),
                class VARCHAR(50),
                cost INTEGER NOT NULL,
                attack INTEGER,
                defense INTEGER,
                abilities TEXT,
                text TEXT,
                rarity VARCHAR(50),
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active INTEGER DEFAULT 1
            )
        `);

        await dbHelpers.exec(`
            CREATE TABLE IF NOT EXISTS decks (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                general_id VARCHAR(255) NOT NULL,
                cards TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        await dbHelpers.exec(`
            CREATE TABLE IF NOT EXISTS matches (
                id SERIAL PRIMARY KEY,
                player1_id INTEGER NOT NULL,
                player2_id INTEGER,
                winner_id INTEGER,
                match_type VARCHAR(50) NOT NULL,
                duration_seconds INTEGER,
                player1_deck TEXT,
                player2_deck TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (player1_id) REFERENCES users(id),
                FOREIGN KEY (player2_id) REFERENCES users(id),
                FOREIGN KEY (winner_id) REFERENCES users(id)
            )
        `);

        await dbHelpers.exec(`
            CREATE TABLE IF NOT EXISTS admin_logs (
                id SERIAL PRIMARY KEY,
                admin_id INTEGER NOT NULL,
                action VARCHAR(255) NOT NULL,
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES users(id)
            )
        `);
    } else {
        // SQLite schema (original)
        dbHelpers.exec(`
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

        dbHelpers.exec(`
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

        dbHelpers.exec(`
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

        dbHelpers.exec(`
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

        dbHelpers.exec(`
            CREATE TABLE IF NOT EXISTS admin_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                admin_id INTEGER NOT NULL,
                action TEXT NOT NULL,
                details TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES users(id)
            )
        `);
    }

    console.log('✅ Database initialized');
}

// Seed initial data
async function seedDatabase() {
    const count = await dbHelpers.query('SELECT COUNT(*) as count FROM users');

    if (count.count === 0) {
        // Create default admin user
        const bcrypt = require('bcrypt');
        const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

        await dbHelpers.run(
            `INSERT INTO users (username, password_hash, email, is_admin) VALUES (?, ?, ?, 1)`,
            [process.env.ADMIN_USERNAME || 'admin', adminPassword, 'admin@kardum.com']
        );

        console.log('✅ Admin user created');
    }
}

// Initialize and seed (async)
(async () => {
    try {
        await initDatabase();
        await seedDatabase();
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        process.exit(1);
    }
})();

// Export database and common functions
module.exports = {
    db,
    dbType,
    usePostgres,

    // User functions
    getUserById: async (id) => {
        return await dbHelpers.query('SELECT * FROM users WHERE id = ?', [id]);
    },
    
    getUserByUsername: async (username) => {
        return await dbHelpers.query('SELECT * FROM users WHERE username = ?', [username]);
    },
    
    createUser: async (username, passwordHash, email) => {
        return await dbHelpers.run(
            'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
            [username, passwordHash, email]
        );
    },
    
    updateUserElo: async (userId, type, newElo) => {
        const column = type === 'casual' ? 'elo_casual' : 'elo_ranked';
        return await dbHelpers.run(
            `UPDATE users SET ${column} = ? WHERE id = ?`,
            [newElo, userId]
        );
    },

    // Card functions
    getAllCards: async () => {
        return await dbHelpers.queryAll('SELECT * FROM cards WHERE is_active = 1');
    },
    
    getCardById: async (id) => {
        return await dbHelpers.query('SELECT * FROM cards WHERE id = ?', [id]);
    },
    
    createCard: async (card) => {
        // Usar placeholders ? para compatibilidade com ambos
        return await dbHelpers.run(
            `INSERT INTO cards (id, name, type, race, class, cost, attack, defense, abilities, text, rarity, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [card.id, card.name, card.type, card.race, card.class, card.cost, card.attack, card.defense, 
             card.abilities, card.text, card.rarity, card.image_url]
        );
    },
    
    updateCard: async (id, card) => {
        // Usar placeholders ? para compatibilidade com ambos
        return await dbHelpers.run(
            `UPDATE cards 
             SET name = ?, type = ?, race = ?, class = ?, 
                 cost = ?, attack = ?, defense = ?, 
                 abilities = ?, text = ?, rarity = ?, 
                 image_url = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [card.name, card.type, card.race, card.class, card.cost, card.attack, card.defense,
             card.abilities, card.text, card.rarity, card.image_url, id]
        );
    },
    
    deleteCard: async (id) => {
        return await dbHelpers.run('UPDATE cards SET is_active = 0 WHERE id = ?', [id]);
    },

    // Deck functions
    getUserDecks: async (userId) => {
        const decks = await dbHelpers.queryAll(
            'SELECT * FROM decks WHERE user_id = ? ORDER BY updated_at DESC',
            [userId]
        );
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
    
    getDeckById: async (deckId) => {
        const deck = await dbHelpers.query('SELECT * FROM decks WHERE id = ?', [deckId]);
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
    
    createDeck: async (userId, deckData) => {
        return await dbHelpers.run(
            'INSERT INTO decks (user_id, name, general_id, cards) VALUES (?, ?, ?, ?)',
            [
                userId,
                deckData.name,
                deckData.generalId,
                JSON.stringify(Array.isArray(deckData.cards) ? deckData.cards : [])
            ]
        );
    },
    
    updateDeck: async (deckId, userId, deckData) => {
        return await dbHelpers.run(
            `UPDATE decks 
             SET name = ?, general_id = ?, cards = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND user_id = ?`,
            [
                deckData.name,
                deckData.generalId,
                JSON.stringify(Array.isArray(deckData.cards) ? deckData.cards : JSON.parse(deckData.cards || '[]')),
                deckId,
                userId
            ]
        );
    },
    
    deleteDeck: async (deckId, userId) => {
        return await dbHelpers.run('DELETE FROM decks WHERE id = ? AND user_id = ?', [deckId, userId]);
    },

    // Match functions
    createMatch: async (player1Id, player2Id, matchType) => {
        return await dbHelpers.run(
            `INSERT INTO matches (player1_id, player2_id, match_type) VALUES (?, ?, ?)`,
            [player1Id, player2Id, matchType]
        );
    },
    
    endMatch: async (matchId, winnerId, duration) => {
        return await dbHelpers.run(
            `UPDATE matches SET winner_id = ?, duration_seconds = ? WHERE id = ?`,
            [winnerId, duration, matchId]
        );
    },

    // Admin log
    logAdminAction: async (adminId, action, details) => {
        return await dbHelpers.run(
            `INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)`,
            [adminId, action, JSON.stringify(details)]
        );
    }
};
