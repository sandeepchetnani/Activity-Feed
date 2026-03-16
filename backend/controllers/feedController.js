const mongoose = require("mongoose");
const Activity = require("../models/Activity");

const getFeed = async (req, res) => {
  try {
    const { lastId, limit = 10 } = req.query;
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    let query = {};

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid lastId format",
        });
      }
      query._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const activities = await Activity.find(query)
      .sort({ _id: -1 })
      .limit(parsedLimit)
      .lean();

    const hasMore = activities.length === parsedLimit;

    res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        hasMore,
        nextCursor: activities.length > 0 ? activities[activities.length - 1]._id : null,
        count: activities.length,
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching feed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const createActivity = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const activity = await Activity.create({
      title: title.trim(),
      description: description?.trim() || "",
      imageUrl: imageUrl?.trim() || "",
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating activity",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getFeed,
  createActivity,
};
