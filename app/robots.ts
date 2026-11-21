import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/applications', '/saved', '/login', '/register', '/api/'],
    },
    sitemap: 'https://madar-jobs.vercel.app/sitemap.xml',
  }
}
