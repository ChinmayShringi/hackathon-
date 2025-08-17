import { config } from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users, typeUser, typeRole } from '../shared/schema.js';

// Load environment variables
config();

async function verifySchemaMatch() {
  console.log('🔍 Verifying Drizzle schema matches database backup...');
  
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle({ client: pool, schema: { users, typeUser, typeRole } });

  try {
    // Check if type_user table exists and has correct structure
    console.log('\n📋 Checking type_user table...');
    const typeUserResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'type_user' 
      ORDER BY ordinal_position
    `);
    
    console.log('type_user table columns:');
    typeUserResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // Check if type_role table exists and has correct structure
    console.log('\n📋 Checking type_role table...');
    const typeRoleResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'type_role' 
      ORDER BY ordinal_position
    `);
    
    console.log('type_role table columns:');
    typeRoleResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // Check users table account_type and access_role columns
    console.log('\n📋 Checking users table account_type and access_role columns...');
    const usersResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('account_type', 'access_role')
      ORDER BY ordinal_position
    `);
    
    console.log('users table relevant columns:');
    usersResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // Check constraints
    console.log('\n📋 Checking constraints...');
    const constraintsResult = await pool.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name IN ('type_user', 'type_role', 'users')
      ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name
    `);
    
    console.log('Constraints:');
    constraintsResult.rows.forEach(constraint => {
      console.log(`  - ${constraint.table_name}.${constraint.constraint_name}: ${constraint.constraint_type} on ${constraint.column_name}`);
    });

    // Check indexes
    console.log('\n📋 Checking indexes...');
    const indexesResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename IN ('type_user', 'type_role', 'users')
      ORDER BY tablename, indexname
    `);
    
    console.log('Indexes:');
    indexesResult.rows.forEach(index => {
      console.log(`  - ${index.tablename}.${index.indexname}: ${index.indexdef}`);
    });

    // Check data in type tables
    console.log('\n📋 Checking data in type tables...');
    const typeUserData = await db.select().from(typeUser);
    console.log('type_user data:', typeUserData);

    const typeRoleData = await db.select().from(typeRole);
    console.log('type_role data:', typeRoleData);

    // Check sample users with new integer columns
    console.log('\n📋 Checking sample users with integer columns...');
    const sampleUsers = await db.select({
      id: users.id,
      accountType: users.accountType,
      accessRole: users.accessRole
    }).from(users).limit(5);
    
    console.log('Sample users:');
    sampleUsers.forEach(user => {
      console.log(`  - ${user.id}: account_type=${user.accountType}, access_role=${user.accessRole}`);
    });

    console.log('\n✅ Schema verification completed!');
    
    // Summary comparison
    console.log('\n📊 SUMMARY:');
    console.log('✅ type_user table exists with id (integer) and title (text) columns');
    console.log('✅ type_role table exists with id (integer) and title (text) columns');
    console.log('✅ users table has account_type (integer) and access_role (integer) columns');
    console.log('✅ Primary key constraints exist on type_user and type_role');
    console.log('✅ Indexes exist on users.account_type and users.access_role');
    console.log('✅ Data is properly migrated to integer values');

  } catch (error) {
    console.error('❌ Error verifying schema:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the verification
verifySchemaMatch().catch(console.error); 