const Database = require("better-sqlite3");

const db = new Database("data.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age TEXT,
    favorite_color TEXT,
    favorite_food TEXT,
    favorite_dessert TEXT,
    date_type TEXT,
    favorite_activity TEXT,
    free_activity TEXT,
    ideal_time TEXT,
    accepted TEXT,
    date TEXT,
    time TEXT,
    place TEXT,
    location TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

console.log("✅ Database connected.");

module.exports = db;