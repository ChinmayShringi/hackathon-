import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as schema from '../shared/schema';
import { getTableName } from 'drizzle-orm';

config();

type Canonical = {
  generatedAt: string;
  inputFile: string;
  tables: Record<string, {
    schema: string;
    name: string;
    columns: Record<string, string>;
    primaryKey: string[] | null;
    uniqueConstraints: string[][];
    indexes: { name: string; columns: string[] }[];
  }>;
};

function loadCanonical(canonicalPath?: string): Canonical {
  const defaultCandidate = path.resolve('database/backups/008_pre_user_media_library.schema.json');
  const target = canonicalPath && fs.existsSync(canonicalPath)
    ? canonicalPath
    : (fs.existsSync(defaultCandidate) ? defaultCandidate : '');
  if (!target) {
    throw new Error('Canonical schema JSON not found. Run analyze-sql-schema.ts first.');
  }
  return JSON.parse(fs.readFileSync(target, 'utf8')) as Canonical;
}

function tableKey(name: string, schemaName = 'public') {
  return `${schemaName}.${name}`;
}

async function main() {
  const canonical = loadCanonical(process.argv[2]);

  // Collect tables from shared/schema.ts
  const tsTables = Object.entries(schema)
    .filter(([_, v]) => typeof v === 'object' && v !== null && (v as any)[Symbol.toStringTag] !== 'PgVarchar')
    .map(([k, v]) => {
      let name = '';
      try {
        name = getTableName(v as any);
      } catch {
        // Not a table; skip by returning empty name
      }
      return { key: k, name, table: v as any };
    })
    .filter((t) => !!t.name);

  const problems: string[] = [];

  console.log('🔍 Comparing shared/schema.ts to canonical SQL schema...');
  for (const { name, table } of tsTables) {
    const c = canonical.tables[tableKey(name)];
    if (!c) {
      problems.push(`Missing table in canonical: public.${name}`);
      continue;
    }

    const tsCols = Object.keys(table.columns || {});
    const sqlCols = Object.keys(c.columns || {});

    const missing = sqlCols.filter((col) => !tsCols.includes(col));
    const extra = tsCols.filter((col) => !sqlCols.includes(col));
    if (missing.length || extra.length) {
      problems.push(`Column mismatch for ${name}: missing in TS [${missing.join(', ')}], extra in TS [${extra.join(', ')}]`);
    }
  }

  // Report tables present in canonical but not in TS
  const tsTableNames = new Set(tsTables.map((t) => t.name));
  Object.values(canonical.tables)
    .filter((t) => t.schema === 'public')
    .forEach((t) => {
      if (!tsTableNames.has(t.name)) {
        problems.push(`Table in canonical not in shared/schema.ts: public.${t.name}`);
      }
    });

  if (problems.length === 0) {
    console.log('🎉 shared/schema.ts matches canonical structure (columns and table presence).');
  } else {
    console.log('❌ Differences found:');
    problems.forEach((p) => console.log(' - ' + p));
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error('❌ Failed comparing to canonical:', err);
  process.exit(1);
});


