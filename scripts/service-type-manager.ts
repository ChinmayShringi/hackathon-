#!/usr/bin/env node

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { typeServices } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function listTypes(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const allTypes = await db.select().from(typeServices).orderBy(typeServices.id);

    if (allTypes.length === 0) {
      console.log('No service types found.');
      process.exit(0);
    }

    console.log('\n🔧 Service Types:');
    console.log('─'.repeat(50));
    
    for (const type of allTypes) {
      console.log(`ID: ${type.id} - ${type.title}`);
      console.log(`   Created: ${type.createdAt?.toISOString() || 'N/A'}`);
      console.log('─'.repeat(50));
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing service types:', error.message);
    process.exit(1);
  }
}

async function addType(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const { title } = argv;
    
    if (!title) throw new Error('Title is required');
    
    const [type] = await db.insert(typeServices).values({
      title: title,
    }).returning();

    console.log(`✅ Service type "${title}" added with ID: ${type.id}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding service type:', error.message);
    process.exit(1);
  }
}

async function updateType(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const { id, title } = argv;
    
    if (!id) throw new Error('Type ID is required');
    if (!title) throw new Error('New title is required');
    
    const [updatedType] = await db.update(typeServices)
      .set({ title: title })
      .where(eq(typeServices.id, id))
      .returning();

    if (!updatedType) {
      console.log(`❌ Service type with ID ${id} not found`);
      process.exit(1);
    }

    console.log(`✅ Service type updated successfully`);
    console.log(`   ID: ${updatedType.id}`);
    console.log(`   New title: ${updatedType.title}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating service type:', error.message);
    process.exit(1);
  }
}

yargs(hideBin(process.argv))
  .command('list', 'List all service types', {}, listTypes)
  .command(
    'add',
    'Add a new service type',
    (yargs) => yargs
      .option('title', {
        describe: 'Service type title (e.g., "Text to Audio", "Video to GIF")',
        type: 'string',
        demandOption: true,
      }),
    addType
  )
  .command('update', 'Update service type title', y => y
    .option('id', { type: 'number', demandOption: true, description: 'Service type ID' })
    .option('title', { type: 'string', demandOption: true, description: 'New service type title' }), updateType)
  .demandCommand()
  .strict()
  .help()
  .epilog(
    'Example: service-type-manager add --title "Text to Audio"\n' +
    'Example: service-type-manager update --id 4 --title "Audio Generation"\n' +
    'Example (npm): npm run service-type-manager -- add --title "Text to Audio"\n' +
    'Note: Always use -- before arguments when using npm scripts.\n' +
    'Note: Service types cannot be deleted to maintain data integrity.'
  )
  .parse(); 