const { Worker } = require('bullmq');
require("dotenv").config();
const { connection } = require('../services/queue');

const db_connect = require("../config/db_config");

(async () => {
  await db_connect();
})();
const JobModel = require('../models/job.model');
const ImportData = require('../models/import.model');

const concurrency = parseInt(process.env.WORKER_CONCURRENCY || 5, 10);

const worker = new Worker(process.env.QUEUE_NAME || 'job_import_queue', async job => {
  const { job: jobData, importLogId } = job.data;

 
  try {
    if (!jobData.externalId) jobData.externalId = jobData.url || jobData.raw?.id || String(Date.now());
    const existing = await JobModel.findOne({ externalId: jobData.externalId });

    if (!existing) {
      await JobModel.create(jobData);
      await ImportData.findByIdAndUpdate(importLogId, { $inc: { totalImported: 1, newJobs: 1 } }, { new: true });
    } else {
      // update fields
      existing.title = jobData.title;
      existing.company = jobData.company;
      existing.location = jobData.location;
      existing.description = jobData.description;
      existing.url = jobData.url;
      existing.raw = jobData.raw;
      await existing.save();
      await ImportData.findByIdAndUpdate(importLogId, { $inc: { totalImported: 1, updatedJobs: 1 } }, { new: true });
    }

    return { ok: true };
  } catch (err) {

    await ImportData.findByIdAndUpdate(importLogId, { $push: { failedJobs: { externalId: jobData.externalId, reason: err.message } } });
    await ImportData.findByIdAndUpdate(importLogId, { $inc: { failedCount: 1 } }); // optional field
    throw err;
  }

}, { connection, concurrency });

worker.on('completed', job => {
  
  console.log('Completed job', job.id);
});

worker.on('failed', (job, err) => {
  console.error('Job failed', job.id, err.message);
});

module.exports = worker;
