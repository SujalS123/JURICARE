import React, { useState, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Typography, Grid, Paper } from "@mui/material";
import AppRoutes from "./AppRoutes";
import CaseAnalyzer from "./components/CaseAnalyzer";
import { Case } from "./types";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff9800", // Orange
    },
    secondary: {
      main: "#4caf50", // Green
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(to bottom, #ffcc80, #66bb6a)", // Orange to Green
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

function App() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCaseSelect = useCallback((caseData: Case) => {
    setSelectedCase(caseData);
  }, []);

  const handleCaseAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: "#333" }}>
            Judiciary Case Management System
          </Typography>

          <Grid container spacing={3}>
            {/* Left Panel: Case Analyzer */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
                <CaseAnalyzer onCaseAdded={handleCaseAdded} />
              </Paper>
            </Grid>

            {/* Right Panel: Routes and Dashboard */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
                <AppRoutes 
                  selectedCase={selectedCase} 
                  onCaseSelect={handleCaseSelect} 
                  onCaseAdded={handleCaseAdded} 
                  refreshKey={refreshKey} 
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
