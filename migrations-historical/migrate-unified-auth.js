#!/usr/bin/env node

import 'dotenv/config';
// Simple migration script for unified auth
// Run with: node migrate-unified-auth.js

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

function sqlBool(val) { return val ? 'true' : 'false'; }
function sqlStr(val) { return `'${String(val).replace(/'/g, "''")}'`; }

async function migrate() {
  console.log('🚀 Starting Unified Auth Migration...');
  
  try {
    // Step 1: Add new columns
    console.log('📝 Adding new columns...');
    
    const columns = [
      { name: 'account_type', type: 'varchar(20)', default: "'Guest'" },
      { name: 'access_role', type: 'varchar(20)', default: "'User'" },
      { name: 'session_token', type: 'varchar', default: 'NULL' },
      { name: 'last_seen_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
      { name: 'password_hash', type: 'varchar', default: 'NULL' },
      { name: 'oauth_provider', type: 'varchar(20)', default: 'NULL' },
      { name: 'is_ephemeral', type: 'boolean', default: 'false' },
      { name: 'can_upgrade_to_registered', type: 'boolean', default: 'true' }
    ];

    for (const column of columns) {
      try {
        await db.execute(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${column.name} ${column.type} DEFAULT ${column.default}`);
        console.log(`  ✅ Added column: ${column.name}`);
      } catch (error) {
        console.log(`  ⚠️  Column ${column.name} might already exist:`, error.message);
      }
    }

    // Step 2: Update existing users
    console.log('👥 Updating existing users...');
    
    const users = await db.execute('SELECT id, email FROM users');
    
    for (const user of users.rows) {
      const accountType = user.email ? 'Registered' : 'Guest';
      const accessRole = user.id === 'admin_debug' ? 'Admin' : 
                        user.id === 'test_debug' ? 'Test' : 'User';
      const isEphemeral = !user.email;
      const canUpgrade = !user.email;
      
      try {
        await db.execute(`
          UPDATE users 
          SET account_type = ${sqlStr(accountType)}, 
              access_role = ${sqlStr(accessRole)}, 
              is_ephemeral = ${sqlBool(isEphemeral)}, 
              can_upgrade_to_registered = ${sqlBool(canUpgrade)},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${sqlStr(user.id)}
        `);
        
        console.log(`  ✅ Updated user: ${user.id} (${accountType}/${accessRole})`);
      } catch (error) {
        console.error(`  ❌ Failed to update user ${user.id}:`, error.message);
      }
    }

    // Step 3: Handle guest user
    console.log('👤 Handling guest user...');
    
    const guestUser = await db.execute("SELECT id FROM users WHERE id = 'guest_user'");
    
    if (guestUser.rows.length === 0) {
      await db.execute(`
        INSERT INTO users (id, account_type, access_role, is_ephemeral, can_upgrade_to_registered, credits, created_at, last_seen_at)
        VALUES ('guest_user', 'Guest', 'User', true, true, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      console.log('  ✅ Created guest_user');
    } else {
      await db.execute(`
        UPDATE users 
        SET account_type = 'Guest', 
            access_role = 'User', 
            is_ephemeral = true, 
            can_upgrade_to_registered = true,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 'guest_user'
      `);
      console.log('  ✅ Updated guest_user');
    }

    // Step 4: Create debug users
    console.log('🐛 Creating debug users...');
    
    const debugUsers = [
      { id: 'admin_debug', accountType: 'Registered', accessRole: 'Admin', credits: 1000 },
      { id: 'test_debug', accountType: 'Registered', accessRole: 'Test', credits: 100 },
      { id: 'premium_debug', accountType: 'Registered', accessRole: 'User', credits: 500 }
    ];

    for (const debugUser of debugUsers) {
      const existing = await db.execute(`SELECT id FROM users WHERE id = '${debugUser.id}'`);
      
      if (existing.rows.length === 0) {
        await db.execute(`
          INSERT INTO users (id, account_type, access_role, credits, created_at, last_seen_at)
          VALUES (${sqlStr(debugUser.id)}, ${sqlStr(debugUser.accountType)}, ${sqlStr(debugUser.accessRole)}, ${debugUser.credits}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        console.log(`  ✅ Created ${debugUser.id}`);
      } else {
        await db.execute(`
          UPDATE users 
          SET account_type = ${sqlStr(debugUser.accountType)}, 
              access_role = ${sqlStr(debugUser.accessRole)}, 
              credits = ${debugUser.credits},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${sqlStr(debugUser.id)}
        `);
        console.log(`  ✅ Updated ${debugUser.id}`);
      }
    }

    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
migrate(); 