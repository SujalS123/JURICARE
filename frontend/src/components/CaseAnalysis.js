import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const CaseAnalysis = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all'); // all, month, year
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchStats();
  }, [timeRange, selectedCategory]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://127.0.0.1:5000/api/cases/stats`, {
        params: {
          time_range: timeRange,
          category: selectedCategory
        }
      });
      setStats(response.data);
    } catch (err) {
      setError('Error fetching case statistics');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Case Statistics',
      },
    },
  };

  // Priority Distribution Chart
  const priorityData = {
    labels: Object.keys(stats.priority_counts || {}),
    datasets: [
      {
        label: 'Cases by Priority',
        data: Object.values(stats.priority_counts || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Status Distribution Chart
  const statusData = {
    labels: Object.keys(stats.status_counts || {}),
    datasets: [
      {
        label: 'Cases by Status',
        data: Object.values(stats.status_counts || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cases Over Time Chart
  const timeData = {
    labels: Object.keys(stats.cases_over_time || {}),
    datasets: [
      {
        label: 'Cases Filed Over Time',
        data: Object.values(stats.cases_over_time || {}),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="Criminal">Criminal</option>
          <option value="Civil">Civil</option>
          <option value="Family">Family</option>
          <option value="Property">Property</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Cases</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total_cases}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Cases</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.status_counts?.Pending || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Cases</h3>
          <p className="text-3xl font-bold text-green-600">{stats.status_counts?.Completed || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg. Duration</h3>
          <p className="text-3xl font-bold text-purple-600">
            {(stats.average_case_duration || 0).toFixed(1)} years
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Cases by Priority</h3>
          <Bar data={priorityData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Cases by Status</h3>
          <Pie data={statusData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Cases Over Time</h3>
          <Line data={timeData} options={chartOptions} />
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Case Distribution</h4>
            <ul className="space-y-2">
              {Object.entries(stats.priority_counts || {}).map(([priority, count]) => (
                <li key={priority} className="flex justify-between items-center">
                  <span className="text-gray-600">{priority} Priority</span>
                  <span className="font-semibold">{count} cases</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Status Overview</h4>
            <ul className="space-y-2">
              {Object.entries(stats.status_counts || {}).map(([status, count]) => (
                <li key={status} className="flex justify-between items-center">
                  <span className="text-gray-600">{status}</span>
                  <span className="font-semibold">{count} cases</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Category Analysis</h4>
            <ul className="space-y-2">
              {Object.entries(stats.category_counts || {}).map(([category, count]) => (
                <li key={category} className="flex justify-between items-center">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-semibold">{count} cases</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Time Analysis</h4>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Average Case Duration</span>
                <span className="font-semibold">{(stats.average_case_duration || 0).toFixed(1)} years</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Cases Filed This Month</span>
                <span className="font-semibold">
                  {stats.cases_over_time?.[new Date().toISOString().slice(0, 7)] || 0}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseAnalysis; 