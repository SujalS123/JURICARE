import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import CaseList from "./components/CaseList";
import CaseDetails from "./components/CaseDetails";
import CaseAnalysis from "./components/CaseAnalysis";
import { Case } from "./types";

interface AppRoutesProps {
  selectedCase: Case | null;
  onCaseSelect: (caseData: Case) => void;
  onCaseAdded: () => void;
  refreshKey: number;
}

function AppRoutes({ selectedCase, onCaseSelect, onCaseAdded, refreshKey }: AppRoutesProps) {
  const navigate = useNavigate();

  const handleCaseClose = () => {
    navigate("/cases");
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard key={refreshKey} />} />
        <Route 
          path="/cases" 
          element={<CaseList key={refreshKey} onCaseSelect={onCaseSelect} />} 
        />
        <Route 
          path="/cases/:id" 
          element={
            <CaseDetails 
              key={refreshKey} 
              caseData={selectedCase} 
              onClose={handleCaseClose} 
            />
          } 
        />
        <Route path="/analyze" element={<CaseAnalysis onCaseAdded={onCaseAdded} />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
