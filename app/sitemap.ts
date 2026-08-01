import type { MetadataRoute } from "next";

const base = "https://goplay11game.net";

const routes: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/",                                       priority: 1.0, changeFreq: "weekly"  },
  { path: "/app-download-guide",                     priority: 0.9, changeFreq: "monthly" },
  { path: "/blog",                                   priority: 0.8, changeFreq: "weekly"  },
  { path: "/blog/how-to-download-goplay-apk",        priority: 0.7, changeFreq: "monthly" },
  { path: "/blog/goplay-gaming-categories-explained",priority: 0.7, changeFreq: "monthly" },
  { path: "/blog/goplay-performance-tips",           priority: 0.7, changeFreq: "monthly" },
  { path: "/faq",                                    priority: 0.8, changeFreq: "monthly" },
  { path: "/about-us",                               priority: 0.6, changeFreq: "monthly" },
  { path: "/contact-us",                             priority: 0.6, changeFreq: "monthly" },
  { path: "/disclaimer",                             priority: 0.4, changeFreq: "yearly"  },
  { path: "/privacy-policy",                         priority: 0.4, changeFreq: "yearly"  },
  { path: "/responsible-gaming",                     priority: 0.5, changeFreq: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFreq }) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-08-01"),
    changeFrequency: changeFreq,
    priority,
  }));
}
