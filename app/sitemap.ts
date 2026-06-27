import type { MetadataRoute } from "next";
import { CATEGORIES, getAllArticles } from "@/lib/blog";
import { getAllSigns } from "@/lib/zodiac";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  // Günlük burç yorumu sayfaları — her gün güncellenir (tazelik sinyali).
  const horoscopes = getAllSigns().map((s) => ({
    url: `${SITE_URL}/burc-yorumlari/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const articles = getAllArticles().map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categories = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/blog/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const signs = getAllSigns().map((s) => ({
    url: `${SITE_URL}/burclar/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/harita-olustur`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/burc-yorumlari`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...horoscopes,
    {
      url: `${SITE_URL}/burclar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/astroprofil`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/test`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/uyumluluk`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...signs,
    ...categories,
    ...articles,
  ];
}
