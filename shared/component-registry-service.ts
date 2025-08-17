import { Component } from './component-system';
import { config } from 'dotenv';

config(); // Load environment variables

/**
 * Component metadata for database storage
 */
export interface ComponentMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  category?: string;
  tags?: string[];
  creditCost?: number;
  estimatedProcessingTime?: number;
  isActive: boolean;
  inputChannels: ComponentChannelMetadata[];
  outputChannels: ComponentChannelMetadata[];
}

/**
 * Component channel metadata for database storage
 */
export interface ComponentChannelMetadata {
  channelId: string;
  channelName: string;
  type: number;
  position?: number;
  isRequired?: boolean;
  description?: string;
  validationRules?: any;
  defaultValue?: any;
  metadata?: any;
}

/**
 * Component Registry Service
 * 
 * This service handles the registration and discovery of components in the database.
 * It enables the future recipe editor to understand available components and their
 * input/output specifications.
 */
export class ComponentRegistryService {
  private db: any = null;

  /**
   * Initialize database connection
   */
  private async getDb() {
    if (!this.db) {
      const { drizzle } = await import('drizzle-orm/node-postgres');
      const { Pool } = await import('pg');
      
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const { componentRegistry, componentInputChannels, componentOutputChannels, componentUsage, componentDependencies } = await import('./schema');
      
      this.db = drizzle(pool, { schema: { componentRegistry, componentInputChannels, componentOutputChannels, componentUsage, componentDependencies } });
    }
    return this.db;
  }

  /**
   * Register a component in the database
   */
  async registerComponent(component: Component): Promise<void> {
    try {
      const db = await this.getDb();
      const { componentRegistry, componentInputChannels, componentOutputChannels } = await import('./schema');
      
      console.log(`🔧 Registering component: ${component.id}`);

      // Register component metadata
      const [componentRecord] = await db
        .insert(componentRegistry)
        .values({
          componentId: component.id,
          name: component.name,
          version: component.version || '1.0.0',
          description: component.description,
          category: component.category,
          tags: component.tags,
          creditCost: component.creditCost || 0,
          estimatedProcessingTime: component.estimatedProcessingTime,
          isActive: true
        })
        .onConflictDoUpdate({
          target: componentRegistry.componentId,
          set: {
            name: component.name,
            version: component.version || '1.0.0',
            description: component.description,
            category: component.category,
            tags: component.tags,
            creditCost: component.creditCost || 0,
            estimatedProcessingTime: component.estimatedProcessingTime,
            updatedAt: new Date()
          }
        })
        .returning();

      console.log(`✅ Component registered with ID: ${componentRecord.id}`);

      // Register input channels
      for (const channel of component.inputChannels) {
        await db
          .insert(componentInputChannels)
          .values({
            componentId: component.id,
            channelId: channel.id,
            channelName: channel.description || channel.id,
            type: channel.type,
            position: channel.position,
            isRequired: channel.required,
            description: channel.description,
            validationRules: channel.validation,
            defaultValue: channel.defaultValue
          })
          .onConflictDoUpdate({
            target: [componentInputChannels.componentId, componentInputChannels.channelId],
            set: {
              channelName: channel.description || channel.id,
              type: channel.type,
              position: channel.position,
              isRequired: channel.required,
              description: channel.description,
              validationRules: channel.validation,
              defaultValue: channel.defaultValue
            }
          });
      }

      // Register output channels
      for (const channel of component.outputChannels) {
        await db
          .insert(componentOutputChannels)
          .values({
            componentId: component.id,
            channelId: channel.id,
            channelName: channel.description || channel.id,
            type: channel.type,
            description: channel.description,
            metadata: channel.metadata
          })
          .onConflictDoUpdate({
            target: [componentOutputChannels.componentId, componentOutputChannels.channelId],
            set: {
              channelName: channel.description || channel.id,
              type: channel.type,
              description: channel.description,
              metadata: channel.metadata
            }
          });
      }

      console.log(`✅ Component ${component.id} fully registered with ${component.inputChannels.length} inputs and ${component.outputChannels.length} outputs`);

    } catch (error) {
      console.error(`❌ Failed to register component ${component.id}:`, error);
      throw error;
    }
  }

  /**
   * Get all available components for recipe editor
   */
  async getAvailableComponents(): Promise<ComponentMetadata[]> {
    try {
      const db = await this.getDb();
      const { componentRegistry, componentInputChannels, componentOutputChannels } = await import('./schema');
      const { eq } = await import('drizzle-orm');

      // Get all active components
      const components = await db
        .select()
        .from(componentRegistry)
        .where(eq(componentRegistry.isActive, true))
        .orderBy(componentRegistry.name);

      const result: ComponentMetadata[] = [];

      for (const component of components) {
        // Get input channels
        const inputs = await db
          .select()
          .from(componentInputChannels)
          .where(eq(componentInputChannels.componentId, component.componentId))
          .orderBy(componentInputChannels.position);

        // Get output channels
        const outputs = await db
          .select()
          .from(componentOutputChannels)
          .where(eq(componentOutputChannels.componentId, component.componentId));

        result.push({
          id: component.componentId,
          name: component.name,
          version: component.version,
          description: component.description || undefined,
          category: component.category || undefined,
          tags: component.tags || undefined,
          creditCost: component.creditCost || undefined,
          estimatedProcessingTime: component.estimatedProcessingTime || undefined,
          isActive: component.isActive,
          inputChannels: inputs.map((input: any) => ({
            channelId: input.channelId,
            channelName: input.channelName,
            type: input.type,
            position: input.position,
            isRequired: input.isRequired,
            description: input.description || undefined,
            validationRules: input.validationRules,
            defaultValue: input.defaultValue || undefined
          })),
          outputChannels: outputs.map((output: any) => ({
            channelId: output.channelId,
            channelName: output.channelName,
            type: output.type,
            description: output.description || undefined,
            metadata: output.metadata
          }))
        });
      }

      return result;

    } catch (error) {
      console.error('❌ Failed to get available components:', error);
      throw error;
    }
  }

  /**
   * Get component by ID with full specification
   */
  async getComponentById(componentId: string): Promise<ComponentMetadata | null> {
    try {
      const db = await this.getDb();
      const { componentRegistry, componentInputChannels, componentOutputChannels } = await import('./schema');
      const { eq } = await import('drizzle-orm');

      // Get component
      const [component] = await db
        .select()
        .from(componentRegistry)
        .where(eq(componentRegistry.componentId, componentId));

      if (!component) {
        return null;
      }

      // Get input channels
      const inputs = await db
        .select()
        .from(componentInputChannels)
        .where(eq(componentInputChannels.componentId, componentId))
        .orderBy(componentInputChannels.position);

      // Get output channels
      const outputs = await db
        .select()
        .from(componentOutputChannels)
        .where(eq(componentOutputChannels.componentId, componentId));

      return {
        id: component.componentId,
        name: component.name,
        version: component.version,
        description: component.description || undefined,
        category: component.category || undefined,
        tags: component.tags || undefined,
        creditCost: component.creditCost || undefined,
        estimatedProcessingTime: component.estimatedProcessingTime || undefined,
        isActive: component.isActive,
        inputChannels: inputs.map((input: any) => ({
          channelId: input.channelId,
          channelName: input.channelName,
          type: input.type,
          position: input.position,
          isRequired: input.isRequired,
          description: input.description || undefined,
          validationRules: input.validationRules,
          defaultValue: input.defaultValue || undefined
        })),
        outputChannels: outputs.map((output: any) => ({
          channelId: output.channelId,
          channelName: output.channelName,
          type: output.type,
          description: output.description || undefined,
          metadata: output.metadata
        }))
      };

    } catch (error) {
      console.error(`❌ Failed to get component ${componentId}:`, error);
      throw error;
    }
  }

  /**
   * Track component usage for analytics
   */
  async trackComponentUsage(
    componentId: string,
    userId: string | null,
    executionId: string | null,
    inputData: any,
    outputData: any,
    processingTimeMs: number,
    creditCost: number,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    try {
      const db = await this.getDb();
      const { componentUsage } = await import('./schema');

      await db.insert(componentUsage).values({
        componentId,
        userId,
        executionId,
        inputData,
        outputData,
        processingTimeMs,
        creditCost,
        success,
        errorMessage
      });

      console.log(`📊 Component usage tracked for ${componentId}`);

    } catch (error) {
      console.error(`❌ Failed to track component usage for ${componentId}:`, error);
      // Don't throw error for usage tracking failures
    }
  }

  /**
   * Get component usage statistics
   */
  async getComponentUsageStats(componentId: string, days: number = 30): Promise<any> {
    try {
      const db = await this.getDb();
      const { componentUsage } = await import('./schema');
      const { eq, gte, sql } = await import('drizzle-orm');

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const stats = await db
        .select({
          totalExecutions: sql<number>`count(*)`,
          successfulExecutions: sql<number>`count(*) filter (where ${componentUsage.success} = true)`,
          failedExecutions: sql<number>`count(*) filter (where ${componentUsage.success} = false)`,
          avgProcessingTime: sql<number>`avg(${componentUsage.processingTimeMs})`,
          totalCreditCost: sql<number>`sum(${componentUsage.creditCost})`
        })
        .from(componentUsage)
        .where(
          sql`${componentUsage.componentId} = ${componentId} AND ${componentUsage.createdAt} >= ${cutoffDate}`
        );

      return stats[0] || {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        avgProcessingTime: 0,
        totalCreditCost: 0
      };

    } catch (error) {
      console.error(`❌ Failed to get usage stats for ${componentId}:`, error);
      throw error;
    }
  }
}
