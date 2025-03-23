import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaseStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/cases/stats');
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching case statistics');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading statistics...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Case Statistics</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Cases</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total_cases}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">High Priority</h3>
          <p className="text-3xl font-bold text-red-600">{stats.priority_distribution.high}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Medium Priority</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.priority_distribution.medium}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Low Priority</h3>
          <p className="text-3xl font-bold text-green-600">{stats.priority_distribution.low}</p>
        </div>
      </div>

      {/* Priority Distribution Table */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Priority Distribution</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Cases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(stats.priority_distribution).map(([priority, count]) => (
                <tr key={priority}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((count / stats.total_cases) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Category Distribution</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Cases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(stats.category_distribution).map(([category, count]) => (
                <tr key={category}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((count / stats.total_cases) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Average Pending Years */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">Average Pending Years</h3>
        <p className="text-3xl font-bold text-gray-600">{stats.average_pending_years} years</p>
      </div>
    </div>
  );
};

export default CaseStats; 