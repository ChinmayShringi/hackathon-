import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config();

interface CanonicalIndex {
  name: string;
  unique: boolean;
  schema: string;
  table: string;
  definition: string;
  columns: string[];
}

interface CanonicalForeignKey {
  constraintName: string;
  columns: string[];
  referencedSchema: string;
  referencedTable: string;
  referencedColumns: string[];
}

interface CanonicalTable {
  schema: string;
  name: string;
  columns: Record<string, string>;
  primaryKey: string[] | null;
  uniqueConstraints: string[][];
  foreignKeys: CanonicalForeignKey[];
  indexes: CanonicalIndex[];
}

interface CanonicalSchemaFile {
  generatedAt: string;
  inputFile: string;
  tables: Record<string, CanonicalTable>; // key: schema.table
}

function findLatestBackupFile(defaultDir: string): string | null {
  if (!fs.existsSync(defaultDir)) return null;
  const files = fs
    .readdirSync(defaultDir)
    .filter((f) => f.endsWith('.sql'))
    .map((f) => ({ f, mtime: fs.statSync(path.join(defaultDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  return files[0] ? path.join(defaultDir, files[0].f) : null;
}

function normalizeIdent(raw: string): string {
  return raw.replace(/^[\"']|[\"']$/g, '');
}

function splitIdentifiers(list: string): string[] {
  return list
    .split(',')
    .map((s) => normalizeIdent(s.trim().replace(/^\((.*)\)$/g, '$1')))
    .filter(Boolean);
}

function parseTables(sql: string): Record<string, CanonicalTable> {
  const tables: Record<string, CanonicalTable> = {};

  // CREATE TABLE statements (quoted or unquoted)
  const createTableRegex = /CREATE\s+TABLE\s+\"?([a-zA-Z0-9_]+)\"?\.(\"?[a-zA-Z0-9_]+\"?)\s*\(([\s\S]*?)\);/g;
  let match: RegExpExecArray | null;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const schema = normalizeIdent(match[1]);
    const table = normalizeIdent(match[2]);
    const body = match[3];

    const columns: Record<string, string> = {};
    let primaryKey: string[] | null = null;
    const uniqueConstraints: string[][] = [];

    // Split body by lines, parse columns and inline constraints
    const lines = body
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    for (const line of lines) {
      // PRIMARY KEY inline
      const pkMatch = line.match(/PRIMARY\s+KEY\s*\(([^\)]+)\)/i);
      if (pkMatch) {
        primaryKey = splitIdentifiers(pkMatch[1]);
        continue;
      }

      // UNIQUE inline
      const uqMatch = line.match(/UNIQUE\s*\(([^\)]+)\)/i);
      if (uqMatch) {
        uniqueConstraints.push(splitIdentifiers(uqMatch[1]));
        continue;
      }

      // Column definition (skip constraint lines)
      if (/^CONSTRAINT\s+/i.test(line)) continue;
      const colMatch = line.match(/^\"?([a-zA-Z0-9_]+)\"?\s+([^,]+?)(?:,|$)/);
      if (colMatch) {
        const colName = normalizeIdent(colMatch[1]);
        const colType = colMatch[2].trim();
        columns[colName] = colType;
      }
    }

    const key = `${schema}.${table}`;
    tables[key] = {
      schema,
      name: table,
      columns,
      primaryKey,
      uniqueConstraints,
      foreignKeys: [],
      indexes: [],
    };
  }

  // ALTER TABLE ... ADD CONSTRAINT (including FKs, PKs, UNIQUE)
  const alterConstraintRegex = /ALTER\s+TABLE\s+ONLY\s+\"?([a-zA-Z0-9_]+)\"?\.(\"?[a-zA-Z0-9_]+\"?)\s+ADD\s+CONSTRAINT\s+\"?([a-zA-Z0-9_]+)\"?\s+(PRIMARY\s+KEY|UNIQUE|FOREIGN\s+KEY)\s*\(([^\)]+)\)(?:\s+REFERENCES\s+\"?([a-zA-Z0-9_]+)\"?\.(\"?[a-zA-Z0-9_]+)\"?\s*\(([^\)]+)\))?/gi;
  while ((match = alterConstraintRegex.exec(sql)) !== null) {
    const schema = normalizeIdent(match[1]);
    const table = normalizeIdent(match[2]);
    const type = match[4].toUpperCase();
    const cols = splitIdentifiers(match[5]);
    const key = `${schema}.${table}`;
    const t = tables[key];
    if (!t) continue;

    if (type.includes('PRIMARY')) {
      t.primaryKey = cols;
    } else if (type.includes('UNIQUE')) {
      t.uniqueConstraints.push(cols);
    } else if (type.includes('FOREIGN')) {
      const refSchema = normalizeIdent(match[6] || 'public');
      const refTable = normalizeIdent(match[7] || '');
      const refCols = splitIdentifiers(match[8] || '');
      t.foreignKeys.push({
        constraintName: '',
        columns: cols,
        referencedSchema: refSchema,
        referencedTable: refTable,
        referencedColumns: refCols,
      });
    }
  }

  // CREATE INDEX statements
  const indexRegex = /CREATE\s+(UNIQUE\s+)?INDEX\s+\"?([a-zA-Z0-9_]+)\"?\s+ON\s+\"?([a-zA-Z0-9_]+)\"?\.(\"?[a-zA-Z0-9_]+\"?)[\s\S]*?\(([^;\)]*)\)[\s\S]*?;/g;
  while ((match = indexRegex.exec(sql)) !== null) {
    const unique = Boolean(match[1]);
    const name = normalizeIdent(match[2]);
    const schema = normalizeIdent(match[3]);
    const table = normalizeIdent(match[4]);
    const colsRaw = match[5];
    const columns = colsRaw
      .split(',')
      .map((s) => s.trim())
      .map((s) => s.replace(/\bASC\b|\bDESC\b|NULLS\s+(FIRST|LAST)|USING\s+\w+|COLLATE\s+\w+/gi, '').trim())
      .map((s) => s.replace(/\((.*)\)/, '$1'))
      .map((s) => s.replace(/\"/g, ''))
      .map((s) => s.split('\s')[0])
      .filter(Boolean);

    const defStart = match.index;
    const defEnd = indexRegex.lastIndex;
    const definition = sql.substring(defStart, defEnd).split('\n').map((l) => l.trim()).join(' ');

    const key = `${schema}.${table}`;
    if (!tables[key]) continue;
    tables[key].indexes.push({ name, unique, schema, table, definition, columns });
  }

  return tables;
}

async function main() {
  const defaultSql = path.resolve('database/backups/008_pre_user_media_library.sql');
  const input = process.argv[2] || (fs.existsSync(defaultSql) ? defaultSql : findLatestBackupFile(path.resolve('database/backups')));

  if (!input || !fs.existsSync(input)) {
    console.error(`❌ SQL backup file not found. Pass a path, e.g.:\n   npx tsx scripts/analyze-sql-schema.ts database/backups/008_pre_user_media_library.sql`);
    process.exit(1);
  }

  const sql = fs.readFileSync(input, 'utf8');
  const tables = parseTables(sql);

  const canonical: CanonicalSchemaFile = {
    generatedAt: new Date().toISOString(),
    inputFile: path.resolve(input),
    tables,
  };

  const outPath = input.replace(/\.sql$/i, '.schema.json');
  fs.writeFileSync(outPath, JSON.stringify(canonical, null, 2), 'utf8');

  const publicTables = Object.values(tables).filter((t) => t.schema === 'public');
  console.log(`✅ Parsed schema from ${path.basename(input)}`);
  console.log(`📦 Total tables: ${Object.keys(tables).length} (public: ${publicTables.length})`);
  console.log(`📝 Wrote canonical JSON: ${outPath}`);

  // Quick summary output
  const summary = publicTables
    .map((t) => ` - ${t.name}: ${Object.keys(t.columns).length} columns, PK ${t.primaryKey ? '(' + t.primaryKey.join(',') + ')' : '(none)'} , ${t.indexes.length} indexes`)
    .join('\n');
  console.log('📋 Tables:\n' + summary);
}

main().catch((err) => {
  console.error('❌ Failed to analyze SQL schema:', err);
  process.exit(1);
});


