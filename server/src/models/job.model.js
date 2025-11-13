const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  externalId: { type: String,unique: true, },
  title: String,
  company: String,
  location: String,
  description: String,
  url: String,
  raw: Object,
}, 
{ timestamps: true 
    
});

//JobSchema.index({ _id: 1 }, { unique: true });

module.exports = mongoose.model('job', JobSchema);
