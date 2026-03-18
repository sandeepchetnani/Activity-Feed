const express = require("express");
const router = express.Router();
const { getFeed, createActivity } = require("../controllers/feedController");

router.get("/", getFeed);
router.post("/", createActivity);

module.exports = router;
