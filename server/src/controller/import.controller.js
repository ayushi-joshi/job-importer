const { fetchFeedXml, parseXml, normalizeJobs } = require('../services/converter');
const { queue } = require('../services/queue');
const ImportData = require('../models/import.model');

const importController =async(req,res)=>{
    try {
        const { feedUrl } = req.body;
    if (!feedUrl) return res.status(400).send({ error: 'url required' });


    const importLog = await ImportData.create({ feedUrl, startedAt: new Date() });

    const xml = await fetchFeedXml(feedUrl);
    const parsed = await parseXml(xml);
    const jobs = normalizeJobs(parsed);

    for (const job of jobs) {
      await queue.add('import-job', { job, importLogId: importLog._id }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
    }

    importLog.totalFetched = jobs.length;
    await importLog.save();

    return res.status(200).send({ message: 'Enqueued', total: jobs.length, importLogId: importLog._id });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
}

const get_import_data=async(req, res)=>{
    try {
         const logs = await ImportData.find()
      .sort({ startedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      message: 'Import logs fetched successfully',
      data: logs
    });
    } catch (error) {
        console.error('Error fetching import logs:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch import logs'
    });
  }
    
}

module.exports = { importController, get_import_data };
