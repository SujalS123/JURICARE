import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaseHistory = ({ caseId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEntry, setNewEntry] = useState({ action: '', details: '' });

  useEffect(() => {
    fetchHistory();
  }, [caseId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/cases/${caseId}/history`);
      setHistory(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching case history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:5000/cases/${caseId}/history`, {
        ...newEntry,
        user: 'Current User' // Replace with actual user
      });
      setNewEntry({ action: '', details: '' });
      fetchHistory();
    } catch (err) {
      setError('Error adding history entry');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Case History</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            value={newEntry.action}
            onChange={(e) => setNewEntry({ ...newEntry, action: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select an action</option>
            <option value="Status Update">Status Update</option>
            <option value="Document Added">Document Added</option>
            <option value="Hearing Scheduled">Hearing Scheduled</option>
            <option value="Decision Made">Decision Made</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Details
          </label>
          <textarea
            value={newEntry.details}
            onChange={(e) => setNewEntry({ ...newEntry, details: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
            placeholder="Enter details about this action..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Add History Entry
        </button>
      </form>

      <div className="space-y-4">
        {history.map((entry, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{entry.action}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="text-sm text-gray-500">{entry.user}</span>
            </div>
            <p className="mt-2 text-gray-600">{entry.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseHistory; 