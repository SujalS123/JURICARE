import React, { useEffect, useState } from 'react';
import CaseHistory from './CaseHistory';
import axios from 'axios';

const CaseDetails = ({ caseData, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [newHearingDate, setNewHearingDate] = useState('');
  const [hearingNotes, setHearingNotes] = useState('');
  const [judgeNote, setJudgeNote] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [finalDecision, setFinalDecision] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!caseData) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Next Hearing':
        return 'bg-blue-100 text-blue-800';
      case 'Last Hearing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setError(null);
      await axios.put(`http://127.0.0.1:5000/cases/${caseData._id}/status`, {
        status: newStatus
      });
      onClose();
    } catch (error) {
      setError('Failed to update case status. Please try again.');
      console.error('Error updating case status:', error);
    }
  };

  const handleScheduleHearing = async () => {
    try {
      setError(null);
      if (!newHearingDate) {
        setError('Please select a hearing date');
        return;
      }
      await axios.post(`http://127.0.0.1:5000/cases/${caseData._id}/hearing`, {
        hearing_date: newHearingDate,
        notes: hearingNotes
      });
      setNewHearingDate('');
      setHearingNotes('');
      onClose();
    } catch (error) {
      setError('Failed to schedule hearing. Please try again.');
      console.error('Error scheduling hearing:', error);
    }
  };

  const handleAddJudgeNote = async () => {
    try {
      setError(null);
      if (!judgeNote.trim()) {
        setError('Please enter a note');
        return;
      }
      await axios.post(`http://127.0.0.1:5000/cases/${caseData._id}/judge_notes`, {
        content: judgeNote,
        type: noteType
      });
      setJudgeNote('');
      onClose();
    } catch (error) {
      setError('Failed to add judge note. Please try again.');
      console.error('Error adding judge note:', error);
    }
  };

  const handleCompleteCase = async () => {
    try {
      setError(null);
      if (!finalDecision.trim()) {
        setError('Please enter a final decision');
        return;
      }
      await axios.post(`http://127.0.0.1:5000/cases/${caseData._id}/complete`, {
        final_decision: finalDecision
      });
      setFinalDecision('');
      onClose();
    } catch (error) {
      setError('Failed to complete case. Please try again.');
      console.error('Error completing case:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Case Details</h2>
            <p className="text-sm text-gray-500 mt-1">Case ID: {caseData.case_id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Category</h3>
              <p className="text-gray-600">{caseData.category}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Priority</h3>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getPriorityColor(caseData.priority)}`}>
                {caseData.priority}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Status</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(caseData.status)}`}>
                  {caseData.status}
                </span>
                <select
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                  value={caseData.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Next Hearing">Next Hearing</option>
                  <option value="Last Hearing">Last Hearing</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Next Hearing</h3>
              <p className="text-gray-600">
                {caseData.next_hearing ? new Date(caseData.next_hearing).toLocaleString() : 'Not Scheduled'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Last Hearing</h3>
              <p className="text-gray-600">
                {caseData.last_hearing ? new Date(caseData.last_hearing).toLocaleString() : 'No Hearing'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Case Duration</h3>
              <p className="text-gray-600">
                {caseData.case_duration ? `${caseData.case_duration.toFixed(1)} years` : 'Not completed'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Start Date</h3>
              <p className="text-gray-600">{new Date(caseData.start_date).toLocaleString()}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">Created At</h3>
              <p className="text-gray-600">{new Date(caseData.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Case Text</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 whitespace-pre-wrap">{caseData.case_text}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700">AI Summary</h3>
              <div 
                className="mt-2 p-4 bg-gray-50 rounded-lg prose max-w-none"
                dangerouslySetInnerHTML={{ __html: caseData.summary }}
              />
            </div>
          </div>
        </div>

        {/* Judge Actions Section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Judge Actions</h3>
          
          {/* Schedule Hearing */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Schedule Hearing</h4>
            <div className="space-y-2">
              <input
                type="datetime-local"
                value={newHearingDate}
                onChange={(e) => setNewHearingDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                value={hearingNotes}
                onChange={(e) => setHearingNotes(e.target.value)}
                placeholder="Add notes about the hearing..."
                className="w-full p-2 border rounded"
                rows="2"
              />
              <button
                onClick={handleScheduleHearing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Schedule Hearing
              </button>
            </div>
          </div>

          {/* Add Judge Note */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Add Note</h4>
            <div className="space-y-2">
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="general">General Note</option>
                <option value="decision">Decision</option>
                <option value="observation">Observation</option>
              </select>
              <textarea
                value={judgeNote}
                onChange={(e) => setJudgeNote(e.target.value)}
                placeholder="Add your note..."
                className="w-full p-2 border rounded"
                rows="2"
              />
              <button
                onClick={handleAddJudgeNote}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Note
              </button>
            </div>
          </div>

          {/* Complete Case */}
          {caseData.status !== 'Completed' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Complete Case</h4>
              <div className="space-y-2">
                <textarea
                  value={finalDecision}
                  onChange={(e) => setFinalDecision(e.target.value)}
                  placeholder="Enter final decision..."
                  className="w-full p-2 border rounded"
                  rows="3"
                />
                <button
                  onClick={handleCompleteCase}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Complete Case
                </button>
              </div>
            </div>
          )}

          {/* Hearing History */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Hearing History</h4>
            <div className="space-y-2">
              {caseData.hearing_history?.map((hearing, index) => (
                <div key={index} className="p-3 bg-white border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {new Date(hearing.date).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{hearing.notes}</p>
                      {hearing.outcome && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Outcome:</strong> {hearing.outcome}
                        </p>
                      )}
                      {hearing.next_steps && (
                        <p className="text-sm text-gray-600">
                          <strong>Next Steps:</strong> {hearing.next_steps}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      hearing.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {hearing.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Judge Notes */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Judge Notes</h4>
            <div className="space-y-2">
              {caseData.judge_notes?.map((note, index) => (
                <div key={index} className="p-3 bg-white border rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      note.type === 'decision' ? 'bg-blue-100 text-blue-800' :
                      note.type === 'observation' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {note.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => {
              // Add functionality to edit case
              console.log('Edit case:', caseData._id);
            }}
          >
            Edit Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails; 