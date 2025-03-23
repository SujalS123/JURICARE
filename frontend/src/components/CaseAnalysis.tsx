import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from '@mui/material';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveIcon from '@mui/icons-material/Save';
import CategoryIcon from '@mui/icons-material/Category';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SummarizeIcon from '@mui/icons-material/Summarize';
import axios from 'axios';

interface AnalysisResult {
  summary: string;
  predicted_priority: string;
  category: string;
}

interface CaseAnalysisProps {
  onCaseAdded?: () => void;
}

const CaseAnalysis: React.FC<CaseAnalysisProps> = ({ onCaseAdded = () => {} }) => {
  const navigate = useNavigate();
  const [caseText, setCaseText] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [submittedCase, setSubmittedCase] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!caseText) {
      setError('Please enter case text');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/analyze_case', {
        case_text: caseText,
        category: category,
      });

      if (!response.data) {
        throw new Error('Failed to analyze case');
      }

      setAnalysisResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [caseText, category]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/add_case', {
        case_text: caseText,
        category: category,
        start_date: new Date().toISOString()
      });

      if (response.data) {
        setSubmittedCase(response.data);
        setCaseText('');
        setCategory('');
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
          AI Case Analysis
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ mb: 4 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Case Text"
              multiline
              rows={6}
              value={caseText}
              onChange={(e) => setCaseText(e.target.value)}
              placeholder="Enter the case details here..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                },
              }}
            >
              <MenuItem value="Civil">Civil</MenuItem>
              <MenuItem value="Criminal">Criminal</MenuItem>
              <MenuItem value="Family">Family</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
              <MenuItem value="Constitutional">Constitutional</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
            sx={{
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Case'}
          </Button>
        </Box>

        {analysisResult && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
              Analysis Results
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card elevation={2} sx={{ bgcolor: '#ffffff' }}>
                  <CardHeader
                    avatar={<SummarizeIcon sx={{ color: '#1976d2' }} />}
                    title="Case Summary"
                    titleTypographyProps={{ variant: 'h6', color: '#1a237e' }}
                  />
                  <CardContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(analysisResult.summary),
                      }}
                      style={{
                        lineHeight: '1.6',
                        color: '#424242',
                        fontSize: '1.1rem',
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ bgcolor: '#ffffff' }}>
                  <CardHeader
                    avatar={<PriorityHighIcon sx={{ color: '#1976d2' }} />}
                    title="Predicted Priority"
                    titleTypographyProps={{ variant: 'h6', color: '#1a237e' }}
                  />
                  <CardContent>
                    <Chip
                      label={analysisResult.predicted_priority}
                      color={getPriorityColor(analysisResult.predicted_priority)}
                      size="medium"
                      sx={{ fontSize: '1.1rem', padding: '8px 16px' }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ bgcolor: '#ffffff' }}>
                  <CardHeader
                    avatar={<CategoryIcon sx={{ color: '#1976d2' }} />}
                    title="Category"
                    titleTypographyProps={{ variant: 'h6', color: '#1a237e' }}
                  />
                  <CardContent>
                    <Chip
                      label={analysisResult.category}
                      color="primary"
                      size="medium"
                      sx={{ fontSize: '1.1rem', padding: '8px 16px' }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                  sx={{
                    bgcolor: '#2e7d32',
                    '&:hover': {
                      bgcolor: '#1b5e20',
                    },
                  }}
                >
                  Save Case
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {showSuccess && submittedCase && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Case Submitted Successfully!
            </Typography>
            <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Case ID: {submittedCase.case_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">Priority:</Typography>
                    <Chip 
                      label={submittedCase.predicted_priority} 
                      color={
                        submittedCase.predicted_priority === 'High' ? 'error' :
                        submittedCase.predicted_priority === 'Medium' ? 'warning' : 'success'
                      }
                      size="medium"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">Category:</Typography>
                    <Chip 
                      label={submittedCase.category} 
                      color="primary" 
                      size="medium"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Summary:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {submittedCase.summary}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowSuccess(false)}
              sx={{ mt: 2 }}
            >
              Submit Another Case
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CaseAnalysis; 