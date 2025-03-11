import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../service/firebase-config';


const RosterManagementPage = () => {
  const [wrestlers, setWrestlers] = useState([]);
  const [newWrestler, setNewWrestler] = useState({ name: '', score: 0, rank: 0, status: 'Bench' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editWrestler, setEditWrestler] = useState(null);

  const wrestlersCollection = collection(db, 'wrestlers');

  // Fetch wrestlers from Firebase
  useEffect(() => {
    const fetchWrestlers = async () => {
      setLoading(true);
      const data = await getDocs(wrestlersCollection);
      setWrestlers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };

    fetchWrestlers();
  }, []);

  const handleAddWrestler = async () => {
    if (wrestlers.length >= 20) {
      setSnackbarMessage('Roster limit reached. You cannot add more than 20 wrestlers.');
      setSnackbarOpen(true);
      return;
    }

    try {
      await addDoc(wrestlersCollection, newWrestler);
      setSnackbarMessage('Wrestler added successfully!');
      setSnackbarOpen(true);
      setNewWrestler({ name: '', score: 0, rank: 0, status: 'Bench' });
      setIsDialogOpen(false);

      // Refresh data
      const data = await getDocs(wrestlersCollection);
      setWrestlers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error('Error adding wrestler:', error);
    }
  };

  const handleEditWrestler = (wrestler) => {
    setEditWrestler(wrestler);
    setNewWrestler(wrestler);
    setIsDialogOpen(true);
  };

  const handleSaveWrestler = async () => {
    try {
      const wrestlerDoc = doc(db, 'wrestlers', editWrestler.id);
      await updateDoc(wrestlerDoc, newWrestler);
      setSnackbarMessage('Wrestler updated successfully!');
      setSnackbarOpen(true);
      setEditWrestler(null);
      setIsDialogOpen(false);

      // Refresh data
      const data = await getDocs(wrestlersCollection);
      setWrestlers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error('Error updating wrestler:', error);
    }
  };

  const handleDeleteWrestler = async (id) => {
    try {
      const wrestlerDoc = doc(db, 'wrestlers', id);
      await deleteDoc(wrestlerDoc);
      setSnackbarMessage('Wrestler deleted successfully!');
      setSnackbarOpen(true);

      // Refresh data
      const data = await getDocs(wrestlersCollection);
      setWrestlers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error('Error deleting wrestler:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    const wrestler = wrestlers.find((w) => w.id === id);
    const newStatus = wrestler.status === 'Active' ? 'Bench' : 'Active';

    try {
      const wrestlerDoc = doc(db, 'wrestlers', id);
      await updateDoc(wrestlerDoc, { status: newStatus });

      // Refresh data
      const data = await getDocs(wrestlersCollection);
      setWrestlers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2E3B55' }}>
        Roster Management (Admin Only)
      </Typography>

      {/* Add New Wrestler Button */}
      <Button
        variant="contained"
        style={{ backgroundColor: '#f87203' }}
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => setIsDialogOpen(true)}
        disabled={wrestlers.length >= 20}
      >
        Add New Wrestler
      </Button>

      {/* Wrestlers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : wrestlers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No wrestlers available.
                </TableCell>
              </TableRow>
            ) : (
              wrestlers.map((wrestler) => (
                <TableRow key={wrestler.id}>
                  <TableCell>{wrestler.name}</TableCell>
                  <TableCell>{wrestler.score}</TableCell>
                  <TableCell>{wrestler.rank}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEditWrestler(wrestler)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteWrestler(wrestler.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Toggle Status">
                      <IconButton color="primary" onClick={() => handleToggleStatus(wrestler.id)}>
                        {wrestler.status === 'Active' ? <Cancel /> : <CheckCircle />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Wrestler Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{editWrestler ? 'Edit Wrestler' : 'Add New Wrestler'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={newWrestler.name}
            onChange={(e) => setNewWrestler({ ...newWrestler, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Score"
            variant="outlined"
            type="number"
            fullWidth
            value={newWrestler.score}
            onChange={(e) => setNewWrestler({ ...newWrestler, score: +e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Rank"
            variant="outlined"
            type="number"
            fullWidth
            value={newWrestler.rank}
            onChange={(e) => setNewWrestler({ ...newWrestler, rank: +e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={editWrestler ? handleSaveWrestler : handleAddWrestler}
            color="primary"
            variant="contained"
          >
            {editWrestler ? 'Save Changes' : 'Add Wrestler'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RosterManagementPage;
