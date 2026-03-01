import Database from 'better-sqlite3';
import { join } from 'path';

// Define the shape of a memory entry
export interface MemoryData {
    id: number;
    text: string;
    timestamp: number;
    type: string;
}

export class MemoryStore {
    private db: Database.Database;

    constructor(dbPath: string = 'agent_memory.db') {
        this.db = new Database(dbPath);
        this.init();
    }

    private init() {
        // Create an FTS5 virtual table for full-text search.
        // FTS5 tables don't need INTEGER PRIMARY KEY as they have an implicit rowid.
        this.db.exec(`
            CREATE VIRTUAL TABLE IF NOT EXISTS memories USING fts5(
                text,
                timestamp UNINDEXED,
                type UNINDEXED
            );
        `);
    }

    public addMemory(text: string, type: string = 'general'): void {
        const stmt = this.db.prepare(`
            INSERT INTO memories (text, timestamp, type)
            VALUES (?, ?, ?)
        `);
        stmt.run(text, Date.now(), type);
    }

    public searchMemories(query: string, limit: number = 5): MemoryData[] {
        // Enclose query in quotes for basic FTS5 syntax safety or use simple MATCH
        const stmt = this.db.prepare(`
            SELECT rowid as id, text, timestamp, type
            FROM memories
            WHERE memories MATCH ?
            ORDER BY rank
            LIMIT ?
        `);

        // Use basic full-text query phrasing
        // The query string can be expanded with wildcard if needed: `query + '*'`
        return stmt.all(query, limit) as MemoryData[];
    }

    public getAllMemories(limit: number = 50): MemoryData[] {
        const stmt = this.db.prepare(`
            SELECT rowid as id, text, timestamp, type
            FROM memories
            ORDER BY timestamp DESC
            LIMIT ?
        `);
        return stmt.all(limit) as MemoryData[];
    }

    public close() {
        this.db.close();
    }
}

// Export a singleton instance by default
export const memoryManager = new MemoryStore();
