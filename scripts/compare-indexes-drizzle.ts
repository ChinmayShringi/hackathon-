import { config } from 'dotenv';
import { Pool } from 'pg';
import * as schema from '../shared/schema';

config();

async function compareIndexesWithDrizzle() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🔍 Comparing indexes between shared schema and database...\n');
    
    // Get all indexes from the database
    const dbIndexesResult = await pool.query(`
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `);

    const dbIndexes: Record<string, string[]> = {};
    dbIndexesResult.rows.forEach(row => {
      if (!dbIndexes[row.tablename]) {
        dbIndexes[row.tablename] = [];
      }
      dbIndexes[row.tablename].push(row.indexname);
    });

    console.log('📊 DATABASE INDEXES:');
    console.log('==================');
    for (const [tableName, indexes] of Object.entries(dbIndexes)) {
      console.log(`${tableName}:`);
      indexes.forEach(idx => console.log(`  - ${idx}`));
    }
    
    console.log('\n📋 SHARED SCHEMA INDEXES:');
    console.log('========================');
    
    const sharedIndexes: Record<string, string[]> = {};
    
    // Extract indexes from our shared schema
    for (const [tableName, tableDef] of Object.entries(schema)) {
      if (tableDef && typeof tableDef === 'object' && 'indexes' in tableDef) {
        const indexes = (tableDef as any).indexes;
        if (Array.isArray(indexes)) {
          const indexNames = indexes.map((idx: any) => {
            if (typeof idx === 'string') return idx;
            if (idx && typeof idx === 'object' && 'name' in idx) return idx.name;
            return 'unnamed_index';
          });
          sharedIndexes[tableName] = indexNames;
          console.log(`${tableName}:`);
          indexNames.forEach(idx => console.log(`  - ${idx}`));
        }
      }
    }
    
    console.log('\n🔍 COMPARISON:');
    console.log('=============');
    
    // Find mismatches
    const allTableNames = new Set([...Object.keys(dbIndexes), ...Object.keys(sharedIndexes)]);
    
    for (const tableName of allTableNames) {
      const dbTableIndexes = dbIndexes[tableName] || [];
      const sharedTableIndexes = sharedIndexes[tableName] || [];
      
      const dbSet = new Set(dbTableIndexes);
      const sharedSet = new Set(sharedTableIndexes);
      
      const onlyInDb = dbTableIndexes.filter(idx => !sharedSet.has(idx));
      const onlyInShared = sharedTableIndexes.filter(idx => !dbSet.has(idx));
      
      if (onlyInDb.length > 0 || onlyInShared.length > 0) {
        console.log(`\n${tableName}:`);
        if (onlyInDb.length > 0) {
          console.log(`  ❌ Only in database: ${onlyInDb.join(', ')}`);
        }
        if (onlyInShared.length > 0) {
          console.log(`  ❌ Only in shared schema: ${onlyInShared.join(', ')}`);
        }
      } else if (dbTableIndexes.length > 0 || sharedTableIndexes.length > 0) {
        console.log(`\n✅ ${tableName}: Indexes match`);
      }
    }
    
    console.log('\n📈 SUMMARY:');
    console.log('===========');
    console.log(`Database tables with indexes: ${Object.keys(dbIndexes).length}`);
    console.log(`Shared schema tables with indexes: ${Object.keys(sharedIndexes).length}`);
    
    const totalDbIndexes = Object.values(dbIndexes).flat().length;
    const totalSharedIndexes = Object.values(sharedIndexes).flat().length;
    console.log(`Total database indexes: ${totalDbIndexes}`);
    console.log(`Total shared schema indexes: ${totalSharedIndexes}`);
    
  } catch (error) {
    console.error('Error comparing indexes:', error);
  } finally {
    await pool.end();
  }
}

compareIndexesWithDrizzle().catch(console.error); 