#!/usr/bin/env node

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { providers } from '../shared/schema.js';
import { eq, desc } from 'drizzle-orm';

async function listProviders(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const whereClause = argv.all ? undefined : eq(providers.isActive, true);
    const allProviders = await db.select().from(providers).where(whereClause).orderBy(providers.title);

    if (allProviders.length === 0) {
      console.log('No providers found.');
      process.exit(0);
    }

    console.log('\n📋 Providers:');
    console.log('─'.repeat(80));
    
    for (const provider of allProviders) {
      console.log(`ID: ${provider.id}`);
      console.log(`Title: ${provider.title}`);
      console.log(`Description: ${provider.description || 'N/A'}`);
      console.log(`Slots: ${provider.numSlots}`);
      console.log(`Status: ${provider.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`Created: ${provider.createdAt?.toISOString() || 'N/A'}`);
      if (provider.config) {
        console.log(`Config: ${JSON.stringify(provider.config, null, 2)}`);
      }
      console.log('─'.repeat(80));
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing providers:', error.message);
    process.exit(1);
  }
}

async function addProvider(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const { title, slots, description, config } = argv;
    
    if (!title) throw new Error('Title is required');
    if (!slots) throw new Error('Slots is required');
    
    const configObj = config ? JSON.parse(config) : {};
    
    const [provider] = await db.insert(providers).values({
      title: title,
      description: description,
      numSlots: slots,
      config: configObj,
    }).returning();

    console.log(`✅ Provider "${title}" added with ID: ${provider.id}`);
    console.log(`   Slots: ${slots}`);
    console.log(`   Active: ${provider.isActive}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding provider:', error.message);
    process.exit(1);
  }
}

async function updateProvider(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const { id, slots, title, description, config, activate, deactivate } = argv;
    
    if (!id) throw new Error('Provider ID is required');
    
    const updateData: any = {};
    
    if (slots !== undefined) {
      if (slots < 1) {
        throw new Error('Number of slots must be >= 1');
      }
      updateData.numSlots = slots;
    }
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (config) updateData.config = JSON.parse(config);
    
    if (activate) updateData.isActive = true;
    if (deactivate) updateData.isActive = false;

    if (Object.keys(updateData).length === 0) {
      console.log('❌ No updates specified. Use --slots, --title, --description, --config, --activate, or --deactivate');
      process.exit(1);
    }

    updateData.updatedAt = new Date();

    const [updatedProvider] = await db.update(providers)
      .set(updateData)
      .where(eq(providers.id, id))
      .returning();

    if (!updatedProvider) {
      console.log(`❌ Provider with ID ${id} not found`);
      process.exit(1);
    }

    console.log(`✅ Provider "${updatedProvider.title}" updated successfully`);
    
    if (slots !== undefined) {
      console.log(`   Slots updated to: ${slots}`);
    }
    if (title) {
      console.log(`   Title updated to: ${title}`);
    }
    if (activate) {
      console.log(`   Provider activated`);
    }
    if (deactivate) {
      console.log(`   Provider deactivated`);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating provider:', error.message);
    process.exit(1);
  }
}

async function removeProvider(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const { id } = argv;
    
    if (!id) throw new Error('Provider ID is required');
    
    const [provider] = await db.update(providers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(providers.id, id))
      .returning();

    if (!provider) {
      console.log(`❌ Provider with ID ${id} not found`);
      process.exit(1);
    }

    console.log(`✅ Provider "${provider.title}" deactivated`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing provider:', error.message);
    process.exit(1);
  }
}

yargs(hideBin(process.argv))
  .command('list', 'List all providers', y => y.option('all', { type: 'boolean', description: 'Show inactive providers too' }), listProviders)
  .command(
    'add',
    'Add a new provider',
    (yargs) => yargs
      .option('title', {
        describe: 'Provider title (e.g., "FAL AI", "Black Forest Labs")',
        type: 'string',
        demandOption: true,
      })
      .option('slots', {
        describe: 'Number of concurrent slots',
        type: 'number',
        demandOption: true,
      })
      .option('description', {
        describe: 'Provider description',
        type: 'string',
      })
      .option('config', {
        describe: 'Provider configuration JSON',
        type: 'string',
      }),
    addProvider
  )
  .command('update', 'Update provider configuration', y => y
    .option('id', { type: 'number', demandOption: true, description: 'Provider ID' })
    .option('slots', { type: 'number', description: 'Update number of slots' })
    .option('title', { type: 'string', description: 'Update provider title' })
    .option('description', { type: 'string', description: 'Update provider description' })
    .option('config', { type: 'string', description: 'Update provider configuration JSON' })
    .option('activate', { type: 'boolean', description: 'Activate provider' })
    .option('deactivate', { type: 'boolean', description: 'Deactivate provider' }), updateProvider)
  .command('remove', 'Remove a provider (soft delete)', y => y
    .option('id', { type: 'number', demandOption: true, description: 'Provider ID' }), removeProvider)
  .demandCommand()
  .strict()
  .help()
  .epilog(
    'Example (direct): provider-manager add --title "FAL Standard" --slots 10 --description "..."\n' +
    'Example (npm): npm run provider-manager -- add --title "FAL Standard" --slots 10 --description "..."\n' +
    'Note: Always use -- before arguments when using npm scripts.'
  )
  .parse(); 