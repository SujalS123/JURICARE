import React from 'react';
import { Box, Typography } from '@mui/material';
import CaseTable from './CaseTable';
import { Case } from '../types';

interface CaseListProps {
  onCaseSelect: (caseData: Case) => void;
}

const CaseList: React.FC<CaseListProps> = ({ onCaseSelect }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Case List
      </Typography>
      <CaseTable onCaseSelect={onCaseSelect} />
    </Box>
  );
};

export default CaseList; 