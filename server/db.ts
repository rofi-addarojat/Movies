import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: any;

try {
  const dbPath = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  db = new Database(path.join(dbPath, 'ads.db'));

  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS ads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      imageUrl TEXT,
      targetUrl TEXT,
      position TEXT,
      isActive INTEGER DEFAULT 1,
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    db.exec(`ALTER TABLE ads ADD COLUMN customCode TEXT`);
  } catch (e) {
    // Column might already exist, ignore
  }
} catch (error) {
  console.error("Failed to initialize database:", error);
  // Provide a mock db object so the server can still start
  db = {
    prepare: () => ({ all: () => [], run: () => ({ lastInsertRowid: 0 }) }),
    exec: () => {},
    pragma: () => {}
  };
}

export default db;
