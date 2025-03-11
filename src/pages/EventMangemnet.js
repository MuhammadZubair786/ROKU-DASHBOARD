import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Tooltip,
  Collapse,
  Avatar,
  TableContainer,
  TableBody,
  Table,
} from '@mui/material';
import { Edit, Delete, ArrowDownward, ArrowUpward } from '@mui/icons-material';

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../service/firebase-config';
import TableLoading from '../components/table-loading/tableLoading';

const ActiveMatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1, setTeam1] = useState([{ name: '' }]);
  const [team2, setTeam2] = useState([{ name: '' }]);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const matchesCollection = collection(db, 'matches'); // Firestore collection reference

  // Fetch matches from Firestore
  const fetchMatches = async () => {
    const querySnapshot = await getDocs(matchesCollection);
    const matchesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMatches(matchesData);
    console.log(matchesData)
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchMatches();
  }, []);

  const handleOpenDialog = (match = null) => {
    if (match) {
      setCurrentMatch(match);
      setTeam1Name(match.team1Name);
      setTeam2Name(match.team2Name);
      setTeam1(match.team1);
      setTeam2(match.team2);
      setTeam1Score(match.team1Score);
      setTeam2Score(match.team2Score);
    } else {
      setCurrentMatch(null);
      setTeam1Name('');
      setTeam2Name('');
      setTeam1([{ name: '' }]);
      setTeam2([{ name: '' }]);
      setTeam1Score(0);
      setTeam2Score(0);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddPlayer = (team) => {
    if (team === 'team1') {
      setTeam1([...team1, { name: '' }]);
    } else {
      setTeam2([...team2, { name: '' }]);
    }
  };

  const handleRemovePlayer = (team, index) => {
    if (team === 'team1') {
      const updatedTeam1 = team1.filter((_, i) => i !== index);
      setTeam1(updatedTeam1);
    } else {
      const updatedTeam2 = team2.filter((_, i) => i !== index);
      setTeam2(updatedTeam2);
    }
  };

  const handlePlayerChange = (team, index, value) => {
    if (team === 'team1') {
      const updatedTeam1 = [...team1];
      updatedTeam1[index].name = value;
      setTeam1(updatedTeam1);
    } else {
      const updatedTeam2 = [...team2];
      updatedTeam2[index].name = value;
      setTeam2(updatedTeam2);
    }
  };

  const handleSaveMatch = async () => {
    if (currentMatch) {
      // Update match in Firestore
      const matchDoc = doc(db, 'matches', currentMatch.id);
      await updateDoc(matchDoc, {
        team1Name,
        team2Name,
        team1,
        team2,
        team1Score,
        team2Score,
      });
      setSnackbarMessage('Match updated successfully!');
    } else {
      // Add new match to Firestore
      await addDoc(matchesCollection, {
        team1Name,
        team2Name,
        team1,
        team2,
        team1Score,
        team2Score,
        matchDetails: 'Match details not available',
        isExpanded: false,
      });
      setSnackbarMessage('Match added successfully!');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
    fetchMatches(); // Refresh matches after adding/updating
  };

  const handleDeleteMatch = async (matchId) => {
    const matchDoc = doc(db, 'matches', matchId);
    await deleteDoc(matchDoc);
    setSnackbarMessage('Match deleted successfully!');
    setSnackbarOpen(true);
    fetchMatches(); // Refresh matches after deletion
  };

  const handleToggleDetails = (matchId) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === matchId ? { ...match, isExpanded: !match.isExpanded } : match
      )
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Active Matches
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => handleOpenDialog()}
      >
        Add New Match
      </Button>

      <Grid container spacing={3}>
        {loading ? (
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableBody>
                <TableLoading />
              </TableBody>
            </Table>
          </TableContainer>
        ) : matches.length === 0 ? (
          <Typography style={{ margin: '20px' }}>
            No active matches available. Add a match to get started!
          </Typography>
        ) : (
          matches.map((match) => (
            <Grid item xs={12} md={6} key={match.id}>
              <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                    {match.team1[0].name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {match.team1Name} vs {match.team2Name}
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#f87203' }}>
                    {match.team1Score} - {match.team2Score}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => handleToggleDetails(match.id)}
                  sx={{
                    borderColor: '#f87203',
                    color: '#f87203',
                    '&:hover': { borderColor: '#f57c00', color: '#f57c00' },
                  }}
                >
                  {match.isExpanded ? 'Show Less' : 'Show More'}
                  {match.isExpanded ? <ArrowUpward /> : <ArrowDownward />}
                </Button>

                <Collapse in={match.isExpanded}>
                  <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                  <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {match.team1Name} Players:
          </Typography>
          <ul>
            {match.team1.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
        </Box>

        {/* Show Team 2 Players */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {match.team2Name} Players:
          </Typography>
          <ul>
            {match.team2.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
        </Box>
                  </Typography>
                </Collapse>

                <Box sx={{ mt: 2 }}>
                  <Tooltip title="Edit Match">
                    <IconButton onClick={() => handleOpenDialog(match)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Match">
                    <IconButton onClick={() => handleDeleteMatch(match.id)} color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialog for adding/editing match */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentMatch ? 'Edit Match' : 'Add New Match'}</DialogTitle>
        <DialogContent>
          {/* Team 1 Name Input */}
          <TextField
            label="Team 1 Name"
            value={team1Name}
            onChange={(e) => setTeam1Name(e.target.value)}
            fullWidth
            margin="dense"
          />

          {/* Render inputs for team1 players */}
          <Typography variant="h6">Team 1 Players</Typography>
          {team1.map((player, index) => (
            <Box key={index}>
              <TextField
                label={`Player ${index + 1} Name`}
                value={player.name}
                onChange={(e) => handlePlayerChange('team1', index, e.target.value)}
                fullWidth
                margin="dense"
              />
              <Button onClick={() => handleRemovePlayer('team1', index)} color="error">
                Remove Player
              </Button>
            </Box>
          ))}
          <Button onClick={() => handleAddPlayer('team1')} color="primary">
            Add Player to Team 1
          </Button>

          {/* Team 2 Name Input */}
          <TextField
            label="Team 2 Name"
            value={team2Name}
            onChange={(e) => setTeam2Name(e.target.value)}
            fullWidth
            margin="dense"
          />

          {/* Render inputs for team2 players */}
          <Typography variant="h6">Team 2 Players</Typography>
          {team2.map((player, index) => (
            <Box key={index}>
              <TextField
                label={`Player ${index + 1} Name`}
                value={player.name}
                onChange={(e) => handlePlayerChange('team2', index, e.target.value)}
                fullWidth
                margin="dense"
              />
              <Button onClick={() => handleRemovePlayer('team2', index)} color="error">
                Remove Player
              </Button>
            </Box>
          ))}
          <Button onClick={() => handleAddPlayer('team2')} color="primary">
            Add Player to Team 2
          </Button>

          <TextField
            label="Team 1 Score"
            type="number"
            value={team1Score}
            onChange={(e) => setTeam1Score(Number(e.target.value))}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Team 2 Score"
            type="number"
            value={team2Score}
            onChange={(e) => setTeam2Score(Number(e.target.value))}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveMatch} color="primary">
            {currentMatch ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default ActiveMatchPage;
