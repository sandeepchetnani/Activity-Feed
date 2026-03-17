const mongoose = require("mongoose");
const Activity = require("../models/Activity");

const getFeed = async (lastId, limit = 10) => {
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

  let query = {};

  if (lastId) {
    if (!mongoose.Types.ObjectId.isValid(lastId)) {
      throw { status: 400, message: "Invalid lastId format" };
    }
    query._id = { $lt: new mongoose.Types.ObjectId(lastId) };
  }

  const activities = await Activity.find(query)
    .sort({ _id: -1 })
    .limit(parsedLimit)
    .lean();

  const hasMore = activities.length === parsedLimit;

  return {
    data: activities,
    pagination: {
      hasMore,
      nextCursor: activities.length > 0 ? activities[activities.length - 1]._id : null,
      count: activities.length,
    },
  };
};

const createActivity = async (title, description, imageUrl) => {
  if (!title || !title.trim()) {
    throw { status: 400, message: "Title is required" };
  }

  const activity = await Activity.create({
    title: title.trim(),
    description: description?.trim() || "",
    imageUrl: imageUrl?.trim() || "",
  });

  return activity;
};

module.exports = {
  getFeed,
  createActivity,
};
