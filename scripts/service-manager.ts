#!/usr/bin/env node

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { services, typeServices, providers } from '../shared/schema.js';
import { eq, and, or, isNull, isNotNull } from 'drizzle-orm';

async function listServices(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const whereClause = argv.all ? undefined : eq(services.isActive, true);
    
    const allServices = await db
      .select({
        id: services.id,
        title: services.title,
        description: services.description,
        endpoint: services.endpoint,
        baseCost: services.baseCost,
        isActive: services.isActive,
        createdAt: services.createdAt,
        config: services.config,
        typeId: services.typeId,
        typeTitle: typeServices.title,
        providerId: services.providerId,
        providerTitle: services.providerTitle,
      })
      .from(services)
      .leftJoin(typeServices, eq(services.typeId, typeServices.id))
      .where(whereClause)
      .orderBy(services.title);

    if (allServices.length === 0) {
      console.log('No services found.');
      process.exit(0);
    }

    console.log('\n🔧 Services:');
    console.log('─'.repeat(100));
    
    for (const service of allServices) {
      console.log(`ID: ${service.id}`);
      console.log(`Title: ${service.title}`);
      console.log(`Description: ${service.description}`);
      console.log(`Type: ${service.typeTitle} (ID: ${service.typeId})`);
      console.log(`Provider: ${service.providerTitle || `ID: ${service.providerId}`}`);
      console.log(`Endpoint: ${service.endpoint}`);
      console.log(`Base Cost: $${service.baseCost}`);
      console.log(`Status: ${service.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`Created: ${service.createdAt?.toISOString() || 'N/A'}`);
      if (service.config) {
        console.log(`Config: ${JSON.stringify(service.config, null, 2)}`);
      }
      console.log('─'.repeat(100));
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing services:', error.message);
    process.exit(1);
  }
}

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
    }
    console.log('─'.repeat(50));
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing service types:', error.message);
    process.exit(1);
  }
}

async function addService(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const { title, description, endpoint, typeId, providerId, providerTitle, baseCost, config } = argv;
    
    if (!title) throw new Error('Title is required');
    if (!description) throw new Error('Description is required');
    if (!endpoint) throw new Error('Endpoint is required');
    if (!typeId) throw new Error('Type ID is required');
    if (!providerId && !providerTitle) throw new Error('Either provider ID or provider title is required');
    if (providerId && providerTitle) throw new Error('Cannot specify both provider ID and provider title');
    
    const configObj = config ? JSON.parse(config) : {};
    const costValue = baseCost ? parseFloat(baseCost).toFixed(16) : "0.0000000000000000";
    
    const [service] = await db.insert(services).values({
      title,
      description,
      endpoint,
      typeId: parseInt(typeId),
      providerId: providerId ? parseInt(providerId) : undefined,
      providerTitle: providerTitle || undefined,
      baseCost: costValue,
      config: configObj,
    }).returning();

    console.log(`✅ Service "${title}" added with ID: ${service.id}`);
    console.log(`   Type ID: ${typeId}`);
    console.log(`   Provider: ${providerTitle || `ID: ${providerId}`}`);
    console.log(`   Endpoint: ${endpoint}`);
    console.log(`   Base Cost: $${costValue}`);
    console.log(`   Active: ${service.isActive}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding service:', error.message);
    process.exit(1);
  }
}

async function updateService(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const { id, title, description, endpoint, typeId, providerId, providerTitle, baseCost, config, activate, deactivate } = argv;
    
    if (!id) throw new Error('Service ID is required');
    
    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (endpoint) updateData.endpoint = endpoint;
    if (typeId) updateData.typeId = parseInt(typeId);
    if (providerId) updateData.providerId = parseInt(providerId);
    if (providerTitle) updateData.providerTitle = providerTitle;
    if (baseCost !== undefined) updateData.baseCost = parseFloat(baseCost).toFixed(16);
    if (config) updateData.config = JSON.parse(config);
    
    if (activate) updateData.isActive = true;
    if (deactivate) updateData.isActive = false;

    if (Object.keys(updateData).length === 0) {
      console.log('❌ No updates specified. Use --title, --description, --endpoint, --typeId, --providerId, --providerTitle, --baseCost, --config, --activate, or --deactivate');
      process.exit(1);
    }

    updateData.updatedAt = new Date();

    const [updatedService] = await db.update(services)
      .set(updateData)
      .where(eq(services.id, id))
      .returning();

    if (!updatedService) {
      console.log(`❌ Service with ID ${id} not found`);
      process.exit(1);
    }

    console.log(`✅ Service "${updatedService.title}" updated successfully`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating service:', error.message);
    process.exit(1);
  }
}

async function removeService(argv: any) {
  try {
    const { db } = await import('../server/db.js');
    const { id } = argv;
    
    if (!id) throw new Error('Service ID is required');
    
    const [service] = await db.update(services)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();

    if (!service) {
      console.log(`❌ Service with ID ${id} not found`);
      process.exit(1);
    }

    console.log(`✅ Service "${service.title}" deactivated`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing service:', error.message);
    process.exit(1);
  }
}

yargs(hideBin(process.argv))
  .command('list', 'List all services', y => y.option('all', { type: 'boolean', description: 'Show inactive services too' }), listServices)
  .command('types', 'List all service types', {}, listTypes)
  .command(
    'add',
    'Add a new service',
    (yargs) => yargs
      .option('title', {
        describe: 'Service title (e.g., "FAL Standard Image", "OpenAI DALL-E 3")',
        type: 'string',
        demandOption: true,
      })
      .option('description', {
        describe: 'Service description',
        type: 'string',
        demandOption: true,
      })
      .option('endpoint', {
        describe: 'Service endpoint URL',
        type: 'string',
        demandOption: true,
      })
      .option('typeId', {
        describe: 'Service type ID (1=Text to Image, 2=Text to Video, 3=Image to Video)',
        type: 'number',
        demandOption: true,
      })
      .option('providerId', {
        describe: 'Provider ID (use this OR providerTitle)',
        type: 'number',
      })
      .option('providerTitle', {
        describe: 'Provider title (use this OR providerId)',
        type: 'string',
      })
      .option('baseCost', {
        describe: 'Base cost in dollars per generation (e.g., 0.05 for 5 cents)',
        type: 'string',
      })
      .option('config', {
        describe: 'Service configuration JSON',
        type: 'string',
      }),
    addService
  )
  .command('update', 'Update service configuration', y => y
    .option('id', { type: 'number', demandOption: true, description: 'Service ID' })
    .option('title', { type: 'string', description: 'Update service title' })
    .option('description', { type: 'string', description: 'Update service description' })
    .option('endpoint', { type: 'string', description: 'Update service endpoint' })
    .option('typeId', { type: 'number', description: 'Update service type ID' })
    .option('providerId', { type: 'number', description: 'Update provider ID' })
    .option('providerTitle', { type: 'string', description: 'Update provider title' })
    .option('baseCost', { type: 'string', description: 'Update base cost in dollars per generation' })
    .option('config', { type: 'string', description: 'Update service configuration JSON' })
    .option('activate', { type: 'boolean', description: 'Activate service' })
    .option('deactivate', { type: 'boolean', description: 'Deactivate service' }), updateService)
  .command('remove', 'Remove a service (soft delete)', y => y
    .option('id', { type: 'number', demandOption: true, description: 'Service ID' }), removeService)
  .demandCommand()
  .strict()
  .help()
  .epilog(
    'Example: service-manager add --title "FAL Standard" --description "FAL AI image generation" --endpoint "https://fal.run/fal-ai/fast-sdxl" --typeId 1 --providerTitle "FAL AI" --baseCost 0.05 --config \'{"apiKey": "xxx"}\'\n' +
    'Example (npm): npm run service-manager -- add --title "FAL Standard" --description "..." --endpoint "..." --typeId 1 --providerTitle "FAL AI" --baseCost 0.05\n' +
    'Note: Always use -- before arguments when using npm scripts.'
  )
  .parse(); 