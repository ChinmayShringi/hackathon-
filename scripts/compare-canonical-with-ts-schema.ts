import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { getTableName } from 'drizzle-orm';

config();

type Canonical = {
  tables: Record<string, {
    schema: string;
    name: string;
    columns: Record<string, string>;
    primaryKey: string[] | null;
    uniqueConstraints: string[][];
    indexes: { name: string; columns: string[] }[];
  }>;
};

function tableKey(name: string, schemaName = 'public') {
  return `${schemaName}.${name}`;
}

async function main() {
  const canonicalPath = process.argv[2] || path.resolve('database/backups/008_pre_user_media_library.schema.json');
  const tsModulePath = process.argv[3] || '../shared/schema.ts';

  if (!fs.existsSync(canonicalPath)) {
    console.error(`❌ Canonical schema JSON not found at ${canonicalPath}. Run analyze-sql-schema.ts first.`);
    process.exit(1);
  }

  const canonical: Canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));

  const resolvedTs = tsModulePath.startsWith('.') ? path.resolve(path.join(path.dirname(new URL(import.meta.url).pathname), tsModulePath)) : tsModulePath;
  const mod = await import(resolvedTs);

  // Collect table objects from the TS schema module
  const tsTables = Object.entries(mod)
    .map(([key, value]) => {
      try {
        const name = getTableName(value as any);
        // Extract actual DB column names from Drizzle column objects
        const columns = Object.entries(value as any)
          .filter(([prop, col]) => prop !== 'enableRLS' && col && typeof col === 'object' && typeof (col as any).name === 'string')
          .map(([_, col]) => (col as any).name as string);
        return { key, name, table: value as any, columns };
      } catch {
        return null;
      }
    })
    .filter((t): t is { key: string; name: string; table: any; columns: string[] } => !!t && !!t.name);

  const problems: string[] = [];

  console.log(`🔍 Comparing ${path.basename(tsModulePath)} to canonical SQL schema...`);

  const tsTableNames = new Set(tsTables.map((t) => t.name));

  // Compare presence
  Object.values(canonical.tables)
    .filter((t) => t.schema === 'public')
    .forEach((t) => {
      if (!tsTableNames.has(t.name)) {
        problems.push(`Table in canonical not in TS schema: public.${t.name}`);
      }
    });

  // Compare columns for overlapping tables
  for (const t of tsTables) {
    const c = canonical.tables[tableKey(t.name)];
    if (!c) {
      problems.push(`Missing table in canonical: public.${t.name}`);
      continue;
    }
    const sqlCols = Object.keys(c.columns || {});
    const missing = sqlCols.filter((col) => !t.columns.includes(col));
    const extra = t.columns.filter((col) => !sqlCols.includes(col));
    if (missing.length || extra.length) {
      problems.push(`Column mismatch for ${t.name}: missing in TS [${missing.join(', ')}], extra in TS [${extra.join(', ')}]`);
    }
  }

  if (problems.length === 0) {
    console.log('🎉 TS schema matches canonical structure (tables and columns).');
  } else {
    console.log('❌ Differences found:');
    problems.forEach((p) => console.log(' - ' + p));
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error('❌ Failed comparing canonical to TS schema:', err);
  process.exit(1);
});


