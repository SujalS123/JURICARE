import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TableSortLabel,
  Box,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import { Case } from '../types';

interface CaseTableProps {
  onCaseSelect: (caseData: Case) => void;
}

const CaseTable: React.FC<CaseTableProps> = ({ onCaseSelect }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState<keyof Case>('case_id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cases');
      setCases(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cases');
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Case) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const filteredCases = cases.filter((caseItem) =>
    Object.values(caseItem).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedCases = [...filteredCases].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : 1;
    }
    return aValue > bValue ? -1 : 1;
  });

  const columns = [
    { id: 'case_id', label: 'Case ID', minWidth: 170 },
    { id: 'category', label: 'Category', minWidth: 100 },
    { id: 'priority', label: 'Priority', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'start_date', label: 'Start Date', minWidth: 170 },
    { id: 'next_hearing_date', label: 'Next Hearing', minWidth: 170 },
    { id: 'last_hearing_date', label: 'Last Hearing', minWidth: 170 },
    { id: 'pending_years', label: 'Pending Years', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 100 }
  ];

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search cases..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'case_id'}
                  direction={sortField === 'case_id' ? sortDirection : 'asc'}
                  onClick={() => handleSort('case_id')}
                >
                  Case ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'category'}
                  direction={sortField === 'category' ? sortDirection : 'asc'}
                  onClick={() => handleSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'priority'}
                  direction={sortField === 'priority' ? sortDirection : 'asc'}
                  onClick={() => handleSort('priority')}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'status'}
                  direction={sortField === 'status' ? sortDirection : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'start_date'}
                  direction={sortField === 'start_date' ? sortDirection : 'asc'}
                  onClick={() => handleSort('start_date')}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'next_hearing_date'}
                  direction={sortField === 'next_hearing_date' ? sortDirection : 'asc'}
                  onClick={() => handleSort('next_hearing_date')}
                >
                  Next Hearing
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'last_hearing_date'}
                  direction={sortField === 'last_hearing_date' ? sortDirection : 'asc'}
                  onClick={() => handleSort('last_hearing_date')}
                >
                  Last Hearing
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCases.map((caseItem) => (
              <TableRow key={caseItem.case_id}>
                <TableCell>{caseItem.case_id}</TableCell>
                <TableCell>{caseItem.category}</TableCell>
                <TableCell>
                  <Chip
                    label={caseItem.priority}
                    color={
                      caseItem.priority === 'High'
                        ? 'error'
                        : caseItem.priority === 'Medium'
                        ? 'warning'
                        : 'success'
                    }
                    size="medium"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={caseItem.status}
                    color={
                      caseItem.status === 'Open'
                        ? 'error'
                        : caseItem.status === 'In Progress'
                        ? 'warning'
                        : 'success'
                    }
                    size="medium"
                  />
                </TableCell>
                <TableCell>
                  {formatDate(caseItem.start_date)}
                </TableCell>
                <TableCell>
                  {formatDate(caseItem.next_hearing_date)}
                </TableCell>
                <TableCell>
                  {formatDate(caseItem.last_hearing_date)}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => onCaseSelect(caseItem)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CaseTable; 