import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import { tags, recipes } from '../shared/schema';
import { eq, inArray } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function listTags() {
  const allTags = await db.select().from(tags);
  console.table(allTags);
  process.exit(0);
}

async function createTag(argv: any) {
  const { name, description, color, hidden } = argv;
  if (!name) throw new Error('Name is required');
  const [existing] = await db.select().from(tags).where(eq(tags.name, name));
  if (existing) {
    console.error(`Tag '${name}' already exists (ID: ${existing.id})`);
    process.exit(1);
  }
  
  const tagData: any = { name };
  if (description) tagData.description = description;
  if (color) tagData.color = color;
  if (hidden !== undefined) tagData.isHidden = hidden;
  
  const [tag] = await db.insert(tags).values(tagData).returning();
  console.log('Created tag:', tag);
  process.exit(0);
}

async function updateTag(argv: any) {
  const { id, name } = argv;
  if (!id && !name) throw new Error('Provide --id or --name to update');
  let tagRow;
  if (id) tagRow = (await db.select().from(tags).where(eq(tags.id, id)))[0];
  else tagRow = (await db.select().from(tags).where(eq(tags.name, name)))[0];
  if (!tagRow) {
    console.error('Tag not found');
    process.exit(1);
  }
  const update: any = {};
  if (argv.newname) update.name = argv.newname;
  if (argv.description !== undefined) update.description = argv.description;
  if (argv.color !== undefined) update.color = argv.color;
  if (argv.hidden !== undefined) update.isHidden = argv.hidden;
  if (Object.keys(update).length === 0) {
    console.error('Nothing to update');
    process.exit(1);
  }
  await db.update(tags).set(update).where(eq(tags.id, tagRow.id));
  console.log('Updated tag:', { ...tagRow, ...update });
  process.exit(0);
}

async function deleteTag(argv: any) {
  const { id, name, force } = argv;
  if (!id && !name) throw new Error('Provide --id or --name to delete');
  let tagRow;
  if (id) tagRow = (await db.select().from(tags).where(eq(tags.id, id)))[0];
  else tagRow = (await db.select().from(tags).where(eq(tags.name, name)))[0];
  if (!tagRow) {
    console.error('Tag not found');
    process.exit(1);
  }
  // Check usage
  const recipesUsing = await db.select().from(recipes).where(inArray(recipes.tagHighlights, [tagRow.id]));
  if (recipesUsing.length > 0 && !force) {
    console.error(`Tag is used in ${recipesUsing.length} recipe(s). Use --force to delete.`);
    process.exit(1);
  }
  // Remove from recipes
  if (recipesUsing.length > 0) {
    for (const recipe of recipesUsing) {
      const newHighlights = (recipe.tagHighlights || []).filter((tid: number) => tid !== tagRow.id);
      await db.update(recipes).set({ tagHighlights: newHighlights as any }).where(eq(recipes.id, recipe.id));
    }
  }
  await db.delete(tags).where(eq(tags.id, tagRow.id));
  console.log('Deleted tag:', tagRow);
  process.exit(0);
}

async function tagUsage(argv: any) {
  const { id, name } = argv;
  let tagRow;
  if (id) tagRow = (await db.select().from(tags).where(eq(tags.id, id)))[0];
  else tagRow = (await db.select().from(tags).where(eq(tags.name, name)))[0];
  if (!tagRow) {
    console.error('Tag not found');
    process.exit(1);
  }
  const recipesUsing = await db.select().from(recipes).where(inArray(recipes.tagHighlights, [tagRow.id]));
  if (recipesUsing.length === 0) {
    console.log('No recipes use this tag.');
  } else {
    console.log(`Recipes using tag '${tagRow.name}':`);
    recipesUsing.forEach(r => console.log(`- ${r.name} (ID: ${r.id})`));
  }
  process.exit(0);
}

async function mergeTags(argv: any) {
  const { from, to } = argv;
  if (!from || !to) throw new Error('Provide --from and --to tag IDs');
  if (from === to) throw new Error('Cannot merge a tag into itself');
  const fromTag = (await db.select().from(tags).where(eq(tags.id, from)))[0];
  const toTag = (await db.select().from(tags).where(eq(tags.id, to)))[0];
  if (!fromTag || !toTag) {
    console.error('Both tags must exist');
    process.exit(1);
  }
  // Update recipes
  const recipesUsing = await db.select().from(recipes).where(inArray(recipes.tagHighlights, [from]));
  for (const recipe of recipesUsing) {
    const highlights = Array.from(new Set([...(recipe.tagHighlights || []).map((tid: number) => tid === from ? to : tid)]));
    await db.update(recipes).set({ tagHighlights: highlights as any }).where(eq(recipes.id, recipe.id));
  }
  await db.delete(tags).where(eq(tags.id, from));
  console.log(`Merged tag ${from} into ${to}`);
  process.exit(0);
}

yargs(hideBin(process.argv))
  .command('list', 'List all tags', {}, listTags)
  .command('create', 'Create a new tag', y => y
    .option('name', { type: 'string', demandOption: true })
    .option('description', { type: 'string' })
    .option('color', { type: 'string' })
    .option('hidden', { type: 'boolean' }), createTag)
  .command('update', 'Update a tag', y => y
    .option('id', { type: 'number' })
    .option('name', { type: 'string' })
    .option('newname', { type: 'string' })
    .option('description', { type: 'string' })
    .option('color', { type: 'string' })
    .option('hidden', { type: 'boolean' }), updateTag)
  .command('delete', 'Delete a tag', y => y.option('id', { type: 'number' }).option('name', { type: 'string' }).option('force', { type: 'boolean' }), deleteTag)
  .command('usage', 'Show recipes using a tag', y => y.option('id', { type: 'number' }).option('name', { type: 'string' }), tagUsage)
  .command('merge', 'Merge one tag into another', y => y.option('from', { type: 'number', demandOption: true }).option('to', { type: 'number', demandOption: true }), mergeTags)
  .demandCommand(1)
  .help()
  .argv; 