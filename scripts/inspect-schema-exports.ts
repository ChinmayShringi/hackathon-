import * as schema from '../shared/schema';

const entries = Object.entries(schema);
for (const [key, value] of entries) {
  const hasName = value && typeof value === 'object' && 'name' in (value as any);
  const nameVal = hasName ? (value as any).name : undefined;
  console.log({ key, type: typeof value, hasName, nameType: typeof nameVal, name: nameVal });
  if (hasName && typeof nameVal !== 'string') {
    try {
      console.log('toString(name):', String(nameVal));
    } catch {}
  }
}


