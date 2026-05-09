import { MetadataRoute } from 'next';
import { supabase } from '@/utils/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.aletoys.com';

  // 获取所有产品链接
  const { data: products } = await supabase.from('products').select('id');
  const productUrls = (products || []).map((p) => ({
    url: `${baseUrl}/product/${p.id}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    ...productUrls,
  ];
}