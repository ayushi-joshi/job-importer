const express = require("express");
const jobRoutes = require("./jobRoutes");
const importRoutes = require("./importRoutes");
const router = express.Router();

// Auth Route
router.use("/import", importRoutes);
router.use("/jobs", jobRoutes);

module.exports = router;