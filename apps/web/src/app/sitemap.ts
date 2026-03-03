import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools-registry';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tools.wokspec.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries: MetadataRoute.Sitemap = TOOLS.filter(t => t.status !== 'soon').map(tool => ({
    url: `${BASE_URL}${tool.href}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolEntries,
  ];
}
