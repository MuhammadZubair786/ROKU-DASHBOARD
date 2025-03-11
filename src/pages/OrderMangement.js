import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

const LeaguesApprovalPage = () => {
  // Simulate pending leagues data
  const [leagues, setLeagues] = useState([
    {
      id: 1,
      leagueName: 'Premier League',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      status: 'pending', // pending, approved, rejected
    },
    {
      id: 2,
      leagueName: 'La Liga',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      status: 'pending',
    },
    {
      id: 3,
      leagueName: 'Serie A',
      userName: 'Bob Johnson',
      userEmail: 'bob.johnson@example.com',
      status: 'pending',
    },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleApproveLeague = (leagueId) => {
    setLeagues((prevLeagues) =>
      prevLeagues.map((league) =>
        league.id === leagueId ? { ...league, status: 'approved' } : league
      )
    );
    setSnackbarMessage('League approved successfully!');
    setSnackbarOpen(true);
  };

  const handleRejectLeague = (leagueId) => {
    setLeagues((prevLeagues) =>
      prevLeagues.map((league) =>
        league.id === leagueId ? { ...league, status: 'rejected' } : league
      )
    );
    setSnackbarMessage('League rejected!');
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2E3B55' }}>
        League Approval Dashboard
      </Typography>

      <Grid container spacing={3}>
        {leagues.length === 0 ? (
          <Typography sx={{ color: '#8D8D8D', fontSize: '1.1rem' }}>
            No pending leagues for approval!
          </Typography>
        ) : (
          leagues.map((league) => (
            <Grid item xs={12} md={6} key={league.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E3B55' }}>
                    {league.leagueName}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ marginTop: 1 }}>
                    Created by: {league.userName} (Email: {league.userEmail})
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    {league.status === 'pending' && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton
                            onClick={() => handleApproveLeague(league.id)}
                            color="primary"
                            sx={{
                              '&:hover': {
                                backgroundColor: '#E0F7FA',
                                color: '#00838F',
                              },
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            onClick={() => handleRejectLeague(league.id)}
                            color="error"
                            sx={{
                              '&:hover': {
                                backgroundColor: '#FFEBEE',
                                color: '#D32F2F',
                              },
                            }}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {league.status === 'approved' && (
                      <Typography sx={{ color: 'green', fontWeight: 'bold' }}>Approved</Typography>
                    )}
                    {league.status === 'rejected' && (
                      <Typography sx={{ color: 'red', fontWeight: 'bold' }}>Rejected</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaguesApprovalPage;
