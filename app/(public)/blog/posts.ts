export type Post = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  excerpt: string;
  category: string;
};

export const posts: Post[] = [
  {
    slug: "how-to-download-goplay-apk",
    title: "How to Download the Goplay APK Safely on Android",
    date: "2026-08-01",
    dateLabel: "August 1, 2026",
    category: "Installation",
    excerpt:
      "A practical walkthrough covering trusted sources, enabling Unknown Sources, and verifying the APK before installation.",
  },
  {
    slug: "goplay-gaming-categories-explained",
    title: "Goplay Gaming Categories Explained",
    date: "2026-08-01",
    dateLabel: "August 1, 2026",
    category: "Platform Guide",
    excerpt:
      "Casual, Card, Strategy, Skill, and Quick Play — what each category offers and how to find the right one for your style.",
  },
  {
    slug: "goplay-performance-tips",
    title: "5 Tips to Improve Goplay Performance on Your Android Device",
    date: "2026-08-01",
    dateLabel: "August 1, 2026",
    category: "Tips & Tricks",
    excerpt:
      "Free up RAM, keep the app updated, and adjust settings to get the smoothest gameplay experience from Goplay.",
  },
];
