import { config } from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as sharedSchema from '../shared/schema';
import * as migrationsSchema from '../migrations/schema';

config(); // Load environment variables first

async function verifySchemaSync() {
  console.log('🔍 Verifying schema synchronization...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle({ client: pool, schema: sharedSchema });

  try {
    // Check if audio_type field exists in recipes table
    console.log('1. Checking recipes table for audio_type field...');
    const recipesResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'recipes' AND column_name = 'audio_type'
    `);
    
    if (recipesResult.rows.length > 0) {
      console.log('✅ audio_type field found in database:', recipesResult.rows[0]);
    } else {
      console.log('❌ audio_type field NOT found in database');
    }

    // Check if created_at field exists in recipes table
    console.log('\n2. Checking recipes table for created_at field...');
    const createdAtResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'recipes' AND column_name = 'created_at'
    `);
    
    if (createdAtResult.rows.length > 0) {
      console.log('✅ created_at field found in database:', createdAtResult.rows[0]);
    } else {
      console.log('❌ created_at field NOT found in database');
    }

    // Check if type_audio table exists
    console.log('\n3. Checking if type_audio table exists...');
    const typeAudioResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'type_audio'
    `);
    
    if (typeAudioResult.rows.length > 0) {
      console.log('✅ type_audio table found in database');
    } else {
      console.log('❌ type_audio table NOT found in database');
    }

    // Check if account_type and access_role fields exist in users table
    console.log('\n4. Checking users table for account_type and access_role fields...');
    const usersFieldsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('account_type', 'access_role')
      ORDER BY column_name
    `);
    
    if (usersFieldsResult.rows.length === 2) {
      console.log('✅ account_type and access_role fields found in database:');
      usersFieldsResult.rows.forEach(row => console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`));
    } else {
      console.log('❌ Missing fields in users table:', usersFieldsResult.rows);
    }

    // Check if type_role table exists
    console.log('\n5. Checking if type_role table exists...');
    const typeRoleResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'type_role'
    `);
    
    if (typeRoleResult.rows.length > 0) {
      console.log('✅ type_role table found in database');
    } else {
      console.log('❌ type_role table NOT found in database');
    }

    // Verify that shared schema has all required fields
    console.log('\n6. Verifying shared schema completeness...');
    
    // Check if shared schema has audioType field
    if ('audioType' in sharedSchema.recipes) {
      console.log('✅ shared/schema.ts has audioType field in recipes table');
    } else {
      console.log('❌ shared/schema.ts missing audioType field in recipes table');
    }

    // Check if shared schema has createdAt field
    if ('createdAt' in sharedSchema.recipes) {
      console.log('✅ shared/schema.ts has createdAt field in recipes table');
    } else {
      console.log('❌ shared/schema.ts missing createdAt field in recipes table');
    }

    // Check if shared schema has typeAudio table
    if ('typeAudio' in sharedSchema) {
      console.log('✅ shared/schema.ts has typeAudio table');
    } else {
      console.log('❌ shared/schema.ts missing typeAudio table');
    }

    // Check if shared schema has accountType and accessRole fields
    if ('accountType' in sharedSchema.users && 'accessRole' in sharedSchema.users) {
      console.log('✅ shared/schema.ts has accountType and accessRole fields in users table');
    } else {
      console.log('❌ shared/schema.ts missing accountType or accessRole fields in users table');
    }

    // Check if shared schema has typeRole table
    if ('typeRole' in sharedSchema) {
      console.log('✅ shared/schema.ts has typeRole table');
    } else {
      console.log('❌ shared/schema.ts missing typeRole table');
    }

    console.log('\n🎉 Schema verification complete!');

  } catch (error) {
    console.error('❌ Error during schema verification:', error);
  } finally {
    await pool.end();
  }
}

verifySchemaSync().catch(console.error); 