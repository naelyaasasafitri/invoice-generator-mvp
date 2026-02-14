import { drizzle } from 'drizzle-orm/d1';

// Initialize D1 database
// This will be bound to Cloudflare Workers Pages
let db: ReturnType<typeof drizzle> | null = null;

export function initDB(d1: D1Database) {
  if (!db) {
    db = drizzle(d1);
  }
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}
