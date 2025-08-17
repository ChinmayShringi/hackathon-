import { db } from './db';
import { services } from '../shared/schema';
import { eq } from 'drizzle-orm';

export class ServiceResolver {
  private serviceCache: Map<number, any> = new Map();

  async getServiceById(serviceId: number): Promise<any | null> {
    // Check cache first
    if (this.serviceCache.has(serviceId)) {
      return this.serviceCache.get(serviceId);
    }

    try {
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, serviceId))
        .limit(1);

      if (service) {
        // Cache the result
        this.serviceCache.set(serviceId, service);
        return service;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching service ${serviceId}:`, error);
      return null;
    }
  }

  async getServiceName(serviceId: number): Promise<string> {
    const service = await this.getServiceById(serviceId);
    return service?.title || `Service ${serviceId}`;
  }

  async getServiceDetails(serviceId: number): Promise<{
    title: string;
    description: string;
    endpoint: string;
    baseCost: string;
  } | null> {
    const service = await this.getServiceById(serviceId);
    if (!service) return null;

    return {
      title: service.title,
      description: service.description,
      endpoint: service.endpoint,
      baseCost: service.baseCost
    };
  }

  // Clear cache (useful for testing or when services are updated)
  clearCache(): void {
    this.serviceCache.clear();
  }
}

export const serviceResolver = new ServiceResolver(); 