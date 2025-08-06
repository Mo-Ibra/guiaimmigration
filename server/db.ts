import dotenv from 'dotenv';
dotenv.config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For development, use a placeholder if DATABASE_URL is not set
const databaseUrl = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set. Using placeholder for development.");
} else {
  console.log("Database URL configured:", databaseUrl.replace(/:[^:@]*@/, ':***@'));
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });

// Test database connection on startup
async function testConnection() {
  try {
    const result = await pool.query('SELECT 1 as test');
    console.log('Database connection successful:', result.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Database connection failed:', error.message);
    } else {
      console.error('Database connection failed:', error);
    }
  }
}

// Only test connection if DATABASE_URL is properly set
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('placeholder')) {
  testConnection();
}