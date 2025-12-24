import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sources = [
  // Newsletters - Tech
  {
    name: "TLDR",
    url: "https://tldr.tech/api/rss/tech",
    type: "newsletter",
    icon: "https://tldr.tech/favicon.ico",
  },
  {
    name: "JavaScript Weekly",
    url: "https://javascriptweekly.com/rss/",
    type: "newsletter",
    icon: "https://javascriptweekly.com/favicon.png",
  },
  {
    name: "React Status",
    url: "https://react.statuscode.com/rss/",
    type: "newsletter",
    icon: "https://react.statuscode.com/favicon.png",
  },
  {
    name: "Node Weekly",
    url: "https://nodeweekly.com/rss/",
    type: "newsletter",
    icon: "https://nodeweekly.com/favicon.png",
  },
  {
    name: "Hacker News",
    url: "https://hnrss.org/frontpage?points=200",
    type: "newsletter",
    icon: "https://news.ycombinator.com/favicon.ico",
  },
  {
    name: "The Pragmatic Engineer",
    url: "https://newsletter.pragmaticengineer.com/feed",
    type: "newsletter",
    icon: null,
  },
  {
    name: "Changelog",
    url: "https://changelog.com/feed",
    type: "newsletter",
    icon: "https://changelog.com/favicon.ico",
  },
  {
    name: "Frontend Focus",
    url: "https://frontendfoc.us/rss/",
    type: "newsletter",
    icon: "https://frontendfoc.us/favicon.png",
  },
  {
    name: "CSS Weekly",
    url: "https://css-weekly.com/feed/",
    type: "newsletter",
    icon: null,
  },
  {
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    type: "newsletter",
    icon: "https://www.smashingmagazine.com/favicon.ico",
  },
  // Design / UI / UX
  {
    name: "Sidebar.io",
    url: "https://sidebar.io/feed.xml",
    type: "newsletter",
    icon: "https://sidebar.io/favicon.ico",
  },
  {
    name: "UX Collective",
    url: "https://uxdesign.cc/feed",
    type: "newsletter",
    icon: null,
  },
  {
    name: "Nielsen Norman Group",
    url: "https://www.nngroup.com/feed/rss/",
    type: "newsletter",
    icon: "https://www.nngroup.com/favicon.ico",
  },
  {
    name: "A List Apart",
    url: "https://alistapart.com/main/feed/",
    type: "newsletter",
    icon: "https://alistapart.com/favicon.ico",
  },
  {
    name: "Codrops",
    url: "https://tympanus.net/codrops/feed/",
    type: "newsletter",
    icon: "https://tympanus.net/codrops/favicon.ico",
  },
  {
    name: "CSS-Tricks",
    url: "https://css-tricks.com/feed/",
    type: "newsletter",
    icon: "https://css-tricks.com/favicon.ico",
  },
  {
    name: "UX Planet",
    url: "https://uxplanet.org/feed",
    type: "newsletter",
    icon: null,
  },
  // Entrepreneurship / Startups / Product
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com/feed",
    type: "newsletter",
    icon: "https://www.producthunt.com/favicon.ico",
  },
  {
    name: "Hacker News - Show HN",
    url: "https://hnrss.org/show?points=50",
    type: "newsletter",
    icon: "https://news.ycombinator.com/favicon.ico",
  },
  {
    name: "Y Combinator Blog",
    url: "https://www.ycombinator.com/blog/rss/",
    type: "newsletter",
    icon: "https://www.ycombinator.com/favicon.ico",
  },
  {
    name: "Lenny's Newsletter",
    url: "https://www.lennysnewsletter.com/feed",
    type: "newsletter",
    icon: null,
  },
  {
    name: "SaaStr",
    url: "https://www.saastr.com/feed/",
    type: "newsletter",
    icon: "https://www.saastr.com/favicon.ico",
  },
  {
    name: "Stratechery",
    url: "https://stratechery.com/feed/",
    type: "newsletter",
    icon: "https://stratechery.com/favicon.ico",
  },
  // YouTube channels - Dev
  {
    name: "Fireship",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Theo - t3.gg",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "ThePrimeagen",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC8ENHE5xdFSwx71u3fDH5Xw",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Traversy Media",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC29ju8bIPH5as8OGnQzwJyA",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Web Dev Simplified",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCFbNIlppjAuEX4znoulh0Cw",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Jack Herrington",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC6vRUjYqDuoUsYsku86Lrsw",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Matt Pocock",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCswG6FSbgZjbWtdf_hMLaow",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Syntax",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCyU5wkjgQYGRB0hIHMwm2Sg",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Kevin Powell",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCJZv4d5rbIKd4QHMPkcABCw",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Coding Garden",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCLNgu_OupwoeESgtab33CCw",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  // YouTube Design / UI / UX
  {
    name: "The Futur",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC-b3c7kxa5vU-bnmaROgvog",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Flux Academy",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCN7dywl5wDxTu1RM3eJ_h9Q",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "DesignCourse",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCVyRiMvfUNMA1UPlDPzG5Ow",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  // YouTube Entrepreneurship
  {
    name: "Y Combinator",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCcefcZRL2oaA_uBNeo5UOWg",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "My First Million",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCqqJQ_cXSat0KIAVfIfKkVA",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Greg Isenberg",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCPjNBjflYl0-HQtUvOx0Ibw",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Pieter Levels",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCSw5U1MuzDED2Nvlx9m65-Q",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "How I Built This",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCn-hX1cX2CrQdyDh-qik1ZA",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Starter Story",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UChhw6DlKKTQ9mYSpTfXUYqA",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Juxtopposed",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCa8W2_uf81Ew6gYuw0VPSeA",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
  {
    name: "Mizko",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCZJkZy008cQjqkJeKpJu8tA",
    type: "youtube",
    icon: "https://www.youtube.com/s/desktop/f56e2c5d/img/favicon_144x144.png",
  },
];

async function main() {
  console.log("Seeding database...");

  for (const source of sources) {
    await prisma.source.upsert({
      where: { url: source.url },
      update: {},
      create: source,
    });
    console.log(`Added source: ${source.name}`);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
