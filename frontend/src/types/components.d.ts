declare module './components/Dashboard' {
  const Dashboard: React.FC;
  export default Dashboard;
}

declare module './components/CaseList' {
  interface CaseListProps {
    onCaseSelect: (caseData: Case) => void;
  }
  const CaseList: React.FC<CaseListProps>;
  export default CaseList;
}

declare module './components/CaseDetails' {
  interface CaseDetailsProps {
    caseData: Case;
    onClose: () => void;
  }
  const CaseDetails: React.FC<CaseDetailsProps>;
  export default CaseDetails;
}

declare module './components/CaseAnalysis' {
  interface CaseAnalysisProps {
    onCaseAdded: () => void;
  }
  const CaseAnalysis: React.FC<CaseAnalysisProps>;
  export default CaseAnalysis;
}

declare module './components/Navbar' {
  const Navbar: React.FC;
  export default Navbar;
}

interface Case {
  case_id: string;
  case_text: string;
  category: string;
  priority: string;
  status: string;
  summary: string;
  start_date: string;
  pending_years: number;
} 