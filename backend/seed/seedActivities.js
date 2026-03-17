require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Activity = require("../models/Activity");

const MONGO_URI = process.env.MONGO_URI;

const BASE_URL = "https://pub-6a74383dd798433f8364e8d2b7ed45ca.r2.dev/static/";

const images = [
  "abby-rurenko-uOYak90r4L0-unsplash.jpg",
  "alexandra-gorn-JIUjvqe2ZHg-unsplash.jpg",
  "aubrey-odom-ITzfgP77DTg-unsplash.jpg",
  "bailey-anselme-Bkp3gLygyeA-unsplash.jpg",
  "chi-m-R1uiDu8vBh0-unsplash.jpg",
  "dhruv-saran-mehra-EItAcdPP-kk-unsplash.jpg",
  "digital-marketing-agency-ntwrk-g39p1kDjvSY-unsplash.jpg",
  "dillon-kydd-2keCPb73aQY-unsplash.jpg",
  "dillon-kydd-XGvwt544g8k-unsplash.jpg",
  "frames-for-your-heart-2d4lAQAlbDA-unsplash.jpg",
  "jason-wang-8J49mtYWu7E-unsplash.jpg",
  "outsite-co-R-LK3sqLiBw-unsplash.jpg",
  "scott-webb-1ddol8rgUH8-unsplash.jpg",
  "spacejoy-9M66C_w_ToM-unsplash.jpg",
  "spacejoy-c0JoR_-2x3E-unsplash.jpg",
  "spacejoy-umAXneH4GhA-unsplash.jpg",
  "todd-kent-178j8tJrNlc-unsplash.jpg"
];

const titles = [
"Neo-Minimal Living Lounge",
"Nordic Serenity Living Space",
"Ultra-Luxe Contemporary Haven",
"Soft-Tone Cozy Retreat",
"Grand Open Concept Living",
"Smart Compact City Living",
"Sleek Modular Kitchen Studio",
"Opulent Bedroom Sanctuary",
"Earthy Wood Essence Interior",
"Zen Minimal Work Nook"
];

const getDescription = (title) => {
  return `A ${title.toLowerCase()} featuring clean design, natural lighting, and a comfortable modern aesthetic.`;
};

const generateActivities = (count) => {
  const activities = [];

  for (let i = 0; i < count; i++) {
    const title = titles[i % titles.length];
    const image = images[i % images.length];

    activities.push({
      title,
      description: getDescription(title),
      imageUrl: BASE_URL + image,
      createdAt: new Date(Date.now() - i * 60000),
    });
  }

  return activities;
};

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    console.log("Clearing existing activities...");
    await Activity.deleteMany({});

    const activities = generateActivities(50);

    console.log("Seeding activities with real images...");
    await Activity.insertMany(activities);

    console.log("Database seeded successfully!");

    const count = await Activity.countDocuments();
    console.log(`Total activities in database: ${count}`);

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();