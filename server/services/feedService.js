const mongoose = require("mongoose");
const Activity = require("../models/Activity");

const buildFuzzyRegex = (searchTerm) => {
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fuzzyPattern = escaped.split("").join(".*");
  return new RegExp(fuzzyPattern, "i");
};

const getFeed = async (lastId, limit = 10, search = null) => {
  let query = {};

  if (search && search.trim()) {
    const fuzzyRegex = buildFuzzyRegex(search.trim());
    query.title = { $regex: fuzzyRegex };
    
    const activities = await Activity.find(query)
      .sort({ _id: -1 })
      .lean();

    return {
      data: activities,
      pagination: {
        hasMore: false,
        nextCursor: null,
        count: activities.length,
      },
    };
  }

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

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
