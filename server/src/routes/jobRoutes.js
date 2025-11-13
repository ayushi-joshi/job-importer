const express = require("express");
const router = express.Router();
const jobController = require("../controller/job.controller");


// Define routes

router.get('/get_jobs',  jobController.getJobs);
router.get('/get_job_by_id/:id',  jobController.getJobById);
module.exports = router;