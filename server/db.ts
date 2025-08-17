import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Enhanced connection pool with retry logic and better error handling
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Increased maximum number of connections
  idleTimeoutMillis: 60000, // Close idle connections after 60 seconds (increased)
  connectionTimeoutMillis: 10000, // Connection timeout of 10 seconds (increased for RDS)
  maxUses: 1000, // Reduced to prevent stale connections more frequently
  // Add SSL configuration for RDS
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Add keep-alive settings
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Add connection error handling with reconnection logic
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit process, let it try to reconnect
  if ('code' in err && (err.code === 'EADDRNOTAVAIL' || err.code === 'ECONNRESET')) {
    console.log('Network error detected, will retry connection...');
  }
});

// Add connection retry logic
export const getConnection = async (retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      return client;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export const db = drizzle({ client: pool, schema });
