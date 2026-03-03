export type { ConsoleUser } from './auth';

export interface Client {
  id: string;
  name: string;
  email: string;
  businessType: string;
  status: 'active' | 'onboarding' | 'paused';
  ghlLocationId?: string;
  createdAt: string;
  stats: {
    contacts: number;
    openDeals: number;
    automations: number;
  };
}
