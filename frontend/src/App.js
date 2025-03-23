import React, { useState, useEffect } from 'react';
import CaseTable from './components/CaseTable';
import CaseDetails from './components/CaseDetails';
import AddCase from './components/AddCase';
import CaseAnalysis from './components/CaseAnalysis';

function App() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseStats, setCaseStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCase, setShowAddCase] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    fetchCaseStats();
  }, []);

  const fetchCaseStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://127.0.0.1:5000/api/cases/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch case statistics');
      }
      const data = await response.json();
      setCaseStats(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching case statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseSelect = (caseData) => {
    setSelectedCase(caseData);
  };

  const handleCaseAdded = () => {
    fetchCaseStats();
  };

  const handleCaseUpdate = (updatedCase) => {
    setSelectedCase(updatedCase);
    fetchCaseStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500 to-green-500">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Case Management System</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setShowAnalysis(false)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    !showAnalysis
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Cases
                </button>
                <button
                  onClick={() => setShowAnalysis(true)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    showAnalysis
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Analysis
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setShowAddCase(true)}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add New Case
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
         
        {showAnalysis ? (
          <CaseAnalysis onCaseAdded={handleCaseAdded} />
        ) : (
          <>
            <CaseTable onCaseSelect={handleCaseSelect} selectedCase={selectedCase} />
            {selectedCase && (
              <CaseDetails
                case={selectedCase}
                onClose={() => setSelectedCase(null)}
                onUpdate={handleCaseUpdate}
              />
            )}
          </>
        )}
      </main>
        
      {showAddCase && (
        <AddCase onClose={() => setShowAddCase(false)} onAdd={handleCaseAdded} />
      )}
    </div>
  );
}


export default App;
