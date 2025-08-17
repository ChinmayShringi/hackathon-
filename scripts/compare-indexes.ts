import { config } from 'dotenv';
import { Pool } from 'pg';
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

config(); // Load environment variables first

function extractIndexesFromSchema(schemaPath: string): string[] {
  const fileContent = fs.readFileSync(schemaPath, 'utf8');
  const sourceFile = ts.createSourceFile(schemaPath, fileContent, ts.ScriptTarget.Latest, true);
  const indexes: string[] = [];

  function visit(node: ts.Node) {
    // Look for: export const <table> = pgTable(..., (table) => [ ... ]);
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.declarations.length === 1 &&
      ts.isVariableDeclaration(node.declarationList.declarations[0])
    ) {
      const decl = node.declarationList.declarations[0];
      if (
        decl.initializer &&
        ts.isCallExpression(decl.initializer) &&
        decl.initializer.expression.getText() === 'pgTable'
      ) {
        const tableVar = decl.name.getText();
        const tableNameArg = decl.initializer.arguments[0];
        const tableName = tableNameArg && ts.isStringLiteral(tableNameArg) ? tableNameArg.text : tableVar;
        
        // Find the index array (the 3rd argument: (table) => [ ... ])
        const args = decl.initializer.arguments;
        if (args.length >= 3) {
          const indexFunction = args[2];
          if (ts.isArrowFunction(indexFunction) && ts.isArrayLiteralExpression(indexFunction.body)) {
            const indexArray = indexFunction.body;
            for (const element of indexArray.elements) {
              if (ts.isCallExpression(element)) {
                const callExpr = element;
                const callName = callExpr.expression.getText();
                if (callName === 'index' || callName === 'unique') {
                  const indexNameArg = callExpr.arguments[0];
                  if (indexNameArg && ts.isStringLiteral(indexNameArg)) {
                    indexes.push(`${tableName}.${indexNameArg.text}`);
                  }
                }
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return indexes;
}

async function compareIndexes() {
  console.log('🔍 Comparing indexes between shared schema and database...\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Get all indexes from the database
    const dbIndexesResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `);

    const dbIndexes = dbIndexesResult.rows.map(idx => `${idx.tablename}.${idx.indexname}`);

    // Read and parse the shared schema file
    const schemaPath = path.join(process.cwd(), 'shared', 'schema.ts');
    const expectedIndexes = extractIndexesFromSchema(schemaPath);

    console.log('📋 Shared Schema Indexes:');
    expectedIndexes.forEach(idx => console.log(`  ${idx}`));
    console.log('\n📊 Database Indexes:');
    dbIndexes.forEach(idx => console.log(`  ${idx}`));

    // Compare
    const matching = expectedIndexes.filter(idx => dbIndexes.includes(idx));
    const missing = expectedIndexes.filter(idx => !dbIndexes.includes(idx));
    const extra = dbIndexes.filter(idx => !expectedIndexes.includes(idx));

    console.log('\n✅ Indexes that exist in both:');
    matching.forEach(idx => console.log(`  ✓ ${idx}`));

    console.log('\n❌ Indexes missing from database:');
    missing.forEach(idx => console.log(`  ✗ ${idx}`));

    console.log('\n⚠️  Indexes in database but not in shared schema:');
    extra.forEach(idx => console.log(`  ⚠ ${idx}`));

    // Check for unique constraints
    console.log('\n🔒 Unique Constraints in Database:');
    const uniqueConstraintsResult = await pool.query(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        tc.constraint_type
      FROM information_schema.table_constraints tc
      WHERE tc.table_schema = 'public' 
        AND tc.constraint_type = 'UNIQUE'
      ORDER BY tc.table_name, tc.constraint_name
    `);
    uniqueConstraintsResult.rows.forEach(constraint => {
      console.log(`  ${constraint.table_name}.${constraint.constraint_name} (${constraint.constraint_type})`);
    });

    console.log('\n📝 Summary:');
    console.log('===========');
    console.log(`Total indexes in database: ${dbIndexes.length}`);
    console.log(`Total expected indexes: ${expectedIndexes.length}`);
    console.log(`Matching indexes: ${matching.length}`);
    console.log(`Missing from database: ${missing.length}`);
    console.log(`Extra in database: ${extra.length}`);

  } catch (error) {
    console.error('❌ Error during index comparison:', error);
  } finally {
    await pool.end();
  }
}

compareIndexes().catch(console.error); 