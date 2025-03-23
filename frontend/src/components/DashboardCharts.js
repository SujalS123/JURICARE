import React from 'react';
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

// Register ChartJS components
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

const DashboardCharts = ({ caseStats, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading statistics: {error}
      </div>
    );
  }

  if (!caseStats || Object.keys(caseStats).length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No statistics available
      </div>
    );
  }

  // Cases by Priority Chart
  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Cases by Priority',
        data: [
          caseStats.priority_counts?.High || 0,
          caseStats.priority_counts?.Medium || 0,
          caseStats.priority_counts?.Low || 0,
        ],
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

  // Cases by Status Chart
  const statusData = {
    labels: ['Pending', 'Completed', 'Next Hearing', 'Last Hearing'],
    datasets: [
      {
        label: 'Cases by Status',
        data: [
          caseStats.status_counts?.Pending || 0,
          caseStats.status_counts?.Completed || 0,
          caseStats.status_counts?.['Next Hearing'] || 0,
          caseStats.status_counts?.['Last Hearing'] || 0,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cases by Category Chart
  const categoryData = {
    labels: Object.keys(caseStats.category_counts || {}),
    datasets: [
      {
        label: 'Cases by Category',
        data: Object.values(caseStats.category_counts || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Cases Over Time Chart
  const timeData = {
    labels: Object.keys(caseStats.cases_over_time || {}),
    datasets: [
      {
        label: 'Cases Filed Over Time',
        data: Object.values(caseStats.cases_over_time || {}),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

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

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Cases</h3>
          <p className="text-3xl font-bold text-blue-600">{caseStats.total_cases || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Cases</h3>
          <p className="text-3xl font-bold text-yellow-600">{caseStats.status_counts?.Pending || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completed Cases</h3>
          <p className="text-3xl font-bold text-green-600">{caseStats.status_counts?.Completed || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Avg. Duration</h3>
          <p className="text-3xl font-bold text-purple-600">
            {(caseStats.average_case_duration || 0).toFixed(1)} years
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Cases by Priority</h3>
          <Bar data={priorityData} options={chartOptions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Cases by Status</h3>
          <Pie data={statusData} options={chartOptions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Cases by Category</h3>
          <Bar data={categoryData} options={chartOptions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Cases Over Time</h3>
          <Line data={timeData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts; 