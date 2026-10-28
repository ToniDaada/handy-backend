import { randomUUID } from "node:crypto";

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price_minor: number;
  duration_minutes: number;
  createdAt: string;
}

export interface ServiceDetails {
  title: string;
  description: string;
  category: string;
  price_minor: number;
  duration_minutes: number;
}

export interface ServiceChanges {
  title?: string;
  description?: string;
  category?: string;
  price_minor?: number;
  duration_minutes?: number;
}

// temporary database.
const services: Service[] = [];

export function getAllServices(): Service[] {
  return [...services];
}

export function getServiceById(id: string): Service | undefined {
  return services.find(service => service.id === id);
}

export function addService(details: ServiceDetails): Service {
  const service: Service = {
    id: randomUUID(),
    title: details.title,
    description: details.description,
    category: details.category,
    price_minor: details.price_minor,
    duration_minutes: details.duration_minutes,
    createdAt: new Date().toISOString(),
  };

  services.push(service);

  return service;
}

export function editService(id: string, changes: ServiceChanges): Service | undefined {
  const service = getServiceById(id);

  if (!service) {
    return undefined;
  }

  Object.assign(service, changes);

  return service;
}

export function removeService(id: string): Service | undefined {
  const serviceIndex = services.findIndex(service => service.id === id);

  if (serviceIndex === -1) {
    return undefined;
  }

  const [deletedService] = services.splice(serviceIndex, 1);

  return deletedService;
}
