"use client";

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Admin() {
  const { data: logs, mutate } = useSWR('/api/proxy/import-logs', fetcher, { refreshInterval: 5000 });
  const [url, setUrl] = useState('');

  async function startImport() {
    const res = await fetch('/api/proxy/imports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ feedUrl: url }),
    });

    if (res.ok) {
      setUrl('');
      mutate();
    } else {
      alert('Failed to start import');
    }
  }

  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Import History</h1>

      <div className="flex gap-3 mb-6">
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
        className="border p-2 rounded w-2/3"
          style={{ width: 600 }}
          placeholder="Enter Feed URL (e.g. https://jobicy.com/?feed=job_feed)"
        />
        <button onClick={startImport} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Start Import
        </button>
      </div>


      <table border={1} cellPadding={8} className="w-full border-collapse border border-gray-300">
        <thead >
          <tr>
            <th className='border p-2'>Feed URL</th>
            <th className='border p-2'>Total</th>
            <th className='border p-2'>New</th>
            <th className='border p-2'>Updated</th>
            <th className='border p-2'>Failed</th>
            <th className='border p-2'>Started</th>
          </tr>
        </thead>
        <tbody>
          {logs?.data?.map((log: any) => (
            <tr key={log._id}>
              <td className='border p-2'>{log.feedUrl}</td>
              <td className='border p-2'>{log.totalFetched ?? 0}</td>
              <td className='border p-2'>{log.newJobs ?? 0}</td>
              <td className='border p-2'>{log.updatedJobs ?? 0}</td>
              <td className='border p-2'>{(log.failedJobs || []).length}</td>
              <td className='border p-2'>{new Date(log.startedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
