import * as schema from '../shared/schema';
import { getTableName } from 'drizzle-orm';

function inspect(table: any, label: string) {
  console.log(`\n=== ${label} ===`);
  try {
    console.log('tableName:', getTableName(table));
  } catch (e) {
    console.log('getTableName error:', (e as Error).message);
  }
  console.log('own keys:', Object.keys(table));
  console.log('columns keys:', Object.keys((table as any).columns || {}));
  console.log('properties:', Object.getOwnPropertyNames(table));
}

// pick a few known tables
// @ts-ignore
inspect((schema as any).brandAssets, 'brandAssets');
// @ts-ignore
inspect((schema as any).generations, 'generations');
// @ts-ignore
inspect((schema as any).users, 'users');


