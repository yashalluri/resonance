const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db = null;

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const dbPath = process.env.DATABASE_PATH || './data/resonance.db';
    const dbDir = path.dirname(dbPath);
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        reject(err);
      } else {
        console.log('✅ Connected to SQLite database');
        createTables().then(resolve).catch(reject);
      }
    });
  });
}

async function createTables() {
  return new Promise((resolve, reject) => {
    const tables = [
      `CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        questions TEXT NOT NULL,
        contacts TEXT NOT NULL,
        output_destination TEXT DEFAULT 'database',
        status TEXT DEFAULT 'created',
        total_contacts INTEGER DEFAULT 0,
        completed_calls INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS calls (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        leaping_call_id TEXT,
        staged_call_id TEXT,
        status TEXT DEFAULT 'pending',
        responses TEXT,
        transcript TEXT,
        error_message TEXT,
        created_at TEXT NOT NULL,
        completed_at TEXT,
        FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS call_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        call_id TEXT NOT NULL,
        question_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        response_text TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (call_id) REFERENCES calls (id)
      )`
    ];
    
    let completed = 0;
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Failed to create table ${index + 1}:`, err.message);
          reject(err);
        } else {
          completed++;
          if (completed === tables.length) {
            console.log('✅ Database tables created successfully');
            resolve();
          }
        }
      });
    });
  });
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return {
    run: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, changes: this.changes });
        });
      });
    },
    get: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    },
    all: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
  };
}

module.exports = {
  initializeDatabase,
  getDB
};