const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const sources = [
  // Newsletters - Tech
  { name: "TLDR", url: "https://tldr.tech/api/rss/tech", type: "newsletter", icon: "https://tldr.tech/favicon.ico" },
  { name: "JavaScript Weekly", url: "https://javascriptweekly.com/rss/", type: "newsletter", icon: "https://javascriptweekly.com/favicon.png" },
  { name: "Hacker News", url: "https://hnrss.org/frontpage?points=200", type: "newsletter", icon: "https://news.ycombinator.com/favicon.ico" },
  { name: "Changelog", url: "https://changelog.com/feed", type: "newsletter", icon: "https://changelog.com/favicon.ico" },
  { name: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/", type: "newsletter", icon: "https://www.smashingmagazine.com/favicon.ico" },
  // YouTube channels - Dev
  { name: "Fireship", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA", type: "youtube", icon: null },
  { name: "Theo - t3.gg", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA", type: "youtube", icon: null },
  { name: "ThePrimeagen", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC8ENHE5xdFSwx71u3fDH5Xw", type: "youtube", icon: null },
  { name: "Traversy Media", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC29ju8bIPH5as8OGnQzwJyA", type: "youtube", icon: null },
  { name: "Web Dev Simplified", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCFbNIlppjAuEX4znoulh0Cw", type: "youtube", icon: null },
  // YouTube Entrepreneurship
  { name: "Y Combinator", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCcefcZRL2oaA_uBNeo5UOWg", type: "youtube", icon: null },
  { name: "My First Million", url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCqqJQ_cXSat0KIAVfIfKkVA", type: "youtube", icon: null },
];

async function main() {
  console.log("Seeding database...");

  // Create default password
  const password = process.env.AUTH_PASSWORD || "veille2024";
  const hash = await bcrypt.hash(password, 10);

  await prisma.settings.upsert({
    where: { id: "main" },
    update: { password: hash },
    create: { id: "main", password: hash },
  });
  console.log("Password set!");

  // Add sources
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
