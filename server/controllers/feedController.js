const feedService = require("../services/feedService");

const getFeed = async (req, res) => {
  try {
    const { lastId, limit } = req.query;
    const result = await feedService.getFeed(lastId, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Server error while fetching feed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const createActivity = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const activity = await feedService.createActivity(title, description, imageUrl);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Server error while creating activity",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getFeed,
  createActivity,
};
