'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Download, Trash2 } from 'lucide-react';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/manage/subscribers');
      if (res.ok) setSubscribers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    try {
      const res = await fetch(`/api/manage/subscribers?id=${id}`, { method: 'DELETE' });
      if (res.ok) setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Email', 'Subscribed Date'];
    const rows = subscribers.map((s) => [s.id, s.email, new Date(s.createdAt).toLocaleString()]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-500">Manage email subscribers collected from footer forms.</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl text-sm transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-[#c9a15a]" /> Export to CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-[#c9a15a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading subscribers...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium text-sm">No email subscribers yet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Email Address</th>
                <th className="px-6 py-3.5">Subscribed Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.email}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
