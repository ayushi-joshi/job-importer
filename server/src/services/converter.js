const axios = require('axios');
const xml2js = require('xml2js');

async function fetchFeedXml(url) {
  const res = await axios.get(url, { timeout: 20000 });
  return res.data;
}

async function parseXml(xml) {
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
  return parser.parseStringPromise(xml);
}


function normalizeJobs(parsed) {
  const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
  const list = Array.isArray(items) ? items : [items];
  return list.map(item => ({
    externalId: item.guid?.value || item.id || item.link,
    title: item.title,
    company: item['company'] || item.author?.name || null,
    location: item.location || item['job_location'] || null,
    description: item.description || item.summary || null,
    url: (item.link && (typeof item.link === 'string' ? item.link : item.link.href)) || null,
    raw: item
  }));
}

module.exports = { fetchFeedXml, parseXml, normalizeJobs };
