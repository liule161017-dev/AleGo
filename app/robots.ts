import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // 如果你有后台管理页，禁止爬取
    },
    sitemap: 'https://www.aletoys.com/sitemap.xml',
  };
}