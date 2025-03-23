import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface CaseStats {
  total_cases: number;
  pending_cases: number;
  high_priority: number;
  resolved_cases: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<CaseStats>({
    total_cases: 0,
    pending_cases: 0,
    high_priority: 0,
    resolved_cases: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cases/stats');
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch case statistics');
      setLoading(false);
    }
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Cases</Typography>
            <Typography variant="h4">{stats.total_cases}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Pending Cases</Typography>
            <Typography variant="h4">{stats.pending_cases}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">High Priority</Typography>
            <Typography variant="h4">{stats.high_priority}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Resolved Cases</Typography>
            <Typography variant="h4">{stats.resolved_cases}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 