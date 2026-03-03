import { getAutomations } from '@/lib/ghl';
import AutomationsClient from './AutomationsClient';

export default async function AutomationsPage() {
  const automations = await getAutomations();
  return <AutomationsClient automations={automations} />;
}
