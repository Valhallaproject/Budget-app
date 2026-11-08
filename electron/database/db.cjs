const Database = require("better-sqlite3");

const db = new Database("budget.db");

db.exec(`
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    balance REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recurring_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    amount REAL NOT NULL,
    day_of_month INTEGER NOT NULL,
    active INTEGER DEFAULT 1
);
`);
const account = db
  .prepare("SELECT * FROM accounts LIMIT 1")
  .get();

if (!account) {
  db.prepare(`
    INSERT INTO accounts(name, balance)
    VALUES (?, ?)
  `).run(
    "Compte principal",
    0
  );
}

module.exports = db;