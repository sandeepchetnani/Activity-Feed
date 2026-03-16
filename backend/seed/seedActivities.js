require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Activity = require("../models/Activity");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/activityFeedDB";

const activityTypes = [
  "User posted a photo",
  "User shared an update",
  "User uploaded a video",
  "User commented on a post",
  "User liked a photo",
  "User joined a group",
  "User created an event",
  "User updated their profile",
  "User shared a link",
  "User added a new friend",
];

const descriptions = [
  "Beautiful sunset today",
  "Having a great time!",
  "Check out this amazing view",
  "Feeling grateful",
  "Exploring new places",
  "Weekend vibes",
  "Nature at its best",
  "Making memories",
  "Living the dream",
  "Adventure awaits",
];

const generateActivities = (count) => {
  const activities = [];

  for (let i = 1; i <= count; i++) {
    const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    const hasImage = Math.random() > 0.2;

    activities.push({
      title: `Activity ${i} - ${randomType}`,
      description: randomDesc,
      imageUrl: hasImage ? `https://picsum.photos/400/300?random=${i}` : "",
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

    console.log("Seeding 50 activities...");
    await Activity.insertMany(activities);

    console.log("Database seeded successfully with 50 activities!");

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
