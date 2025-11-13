const mongoose = require('mongoose');

const ImportSchema = new mongoose.Schema({
  feedUrl: { type: String,unique: true, },
  startedAt: { type: Date, default: Date.now },
  finishedAt: Date,
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [{ externalId: String, reason: String }],
},
 { timestamps: true });

module.exports = mongoose.model('Import', ImportSchema);
