import React, { useState } from 'react';
import axios from 'axios';
import './CaseSummary.css';

const CaseAnalyzer = ({ onCaseAdded }) => {
  const [caseText, setCaseText] = useState('');
  const [category, setCategory] = useState('Criminal');
  const [pendingYears, setPendingYears] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First analyze the case
      const analysisResponse = await axios.post('http://localhost:5000/analyze_case', {
        case_text: caseText,
        category: category
      });

      if (!analysisResponse.data) {
        throw new Error('No analysis data received');
      }

      // Then add the case with the analysis results
      const caseData = {
        case_text: caseText,
        category: category,
        summary: analysisResponse.data.summary,
        priority: analysisResponse.data.predicted_priority,
        start_date: new Date().toISOString(),
        next_hearing_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        last_hearing_date: new Date().toISOString()
      };

      const addResponse = await axios.post('http://localhost:5000/add_case', caseData);

      if (!addResponse.data) {
        throw new Error('Failed to add case');
      }

      // Clear form and show success message
      setCaseText('');
      setCategory('');
      setSuccessMessage('Case added successfully!');

      // Call onCaseAdded if provided
      if (typeof onCaseAdded === 'function') {
        onCaseAdded(addResponse.data);
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Error analyzing case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/add_case', {
        case_text: caseText,
        category: category,
        start_date: new Date().toISOString(),
        next_hearing_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Set next hearing to 7 days from now
        last_hearing_date: new Date().toISOString() // Set initial last hearing to current date
      });

      if (response.data) {
        setSubmittedCase(response.data);
        setCaseText('');
        setCategory('Criminal');
        setPendingYears('');
        setShowSuccess(true);
        
        // Call onCaseAdded if it's a function
        if (typeof onCaseAdded === 'function') {
          onCaseAdded();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Case</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Case Details
          </label>
          <textarea
            value={caseText}
            onChange={(e) => setCaseText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            required
            placeholder="Enter case details..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Criminal">Criminal</option>
            <option value="Civil">Civil</option>
            <option value="Family">Family</option>
            <option value="Property">Property</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pending Years
          </label>
          <input
            type="number"
            value={pendingYears}
            onChange={(e) => setPendingYears(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.1"
            required
            placeholder="Enter pending years..."
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Analyzing Case...' : 'Analyze Case'}
        </button>
      </form>

      {summary && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Summary</h3>
          <div 
            className="case-summary"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </div>
      )}

      {successMessage && (
        <div className="mt-6 text-green-500 text-sm">{successMessage}</div>
      )}
    </div>
  );
};

export default CaseAnalyzer; 