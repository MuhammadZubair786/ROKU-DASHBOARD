import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../service/firebase-config'; // Your Firebase configuration file
import TableLoading from '../components/table-loading/tableLoading';

const LeagueList = () => {
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [newLeagueImage, setNewLeagueImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const leaguesCollection = collection(db, 'leagues'); // Firestore collection reference

  const TABLE_HEAD = [
    { id: 'teamName', label: 'Team Name', alignRight: false },
    { id: 'teamLogo', label: 'Team Logo', alignRight: false },
    { id: 'actions', label: 'Actions', alignRight: false },
  ];

  // Fetch leagues from Firestore
  useEffect(() => {
    const fetchLeagues = async () => {
      setIsLoading(true);
      try {
        const data = await getDocs(leaguesCollection);
        setLeagues(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching leagues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const handleEditLeague = (league) => {
    setCurrentLeague(league);
    setNewLeagueName(league.leagueName);
    setNewLeagueImage(null);
    setEditModalOpen(true);
  };

  const handleDeleteLeague = (league) => {
    setCurrentLeague(league);
    setDeleteModalOpen(true);
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'newpresent'); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dkfgfnbst/image/upload`, // Replace "your_cloud_name"
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Image upload failed');
    }
  };

  const handleSaveLeagueChanges = async () => {
    setUploadingImage(true);

    try {
      let imageUrl = currentLeague?.imageUrl || '';
      if (newLeagueImage) {
        imageUrl = await uploadImageToCloudinary(newLeagueImage);
      }

      if (currentLeague) {
        // Update existing league
        const leagueDoc = doc(db, 'leagues', currentLeague.id);
        await updateDoc(leagueDoc, { leagueName: newLeagueName, imageUrl });
        setLeagues((prev) =>
          prev.map((league) =>
            league.id === currentLeague.id ? { ...league, leagueName: newLeagueName, imageUrl } : league
          )
        );
        setSnackbarMessage('League updated successfully!');
      } else {
        // Add new league
        const newDoc = await addDoc(leaguesCollection, { leagueName: newLeagueName, imageUrl });
        setLeagues((prev) => [...prev, { id: newDoc.id, leagueName: newLeagueName, imageUrl }]);
        setSnackbarMessage('League added successfully!');
      }

      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving league:', error);
      setSnackbarMessage('Failed to save league');
    } finally {
      setUploadingImage(false);
      setSnackbarOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (currentLeague) {
      const leagueDoc = doc(db, 'leagues', currentLeague.id);
      await deleteDoc(leagueDoc);
      setLeagues((prev) => prev.filter((league) => league.id !== currentLeague.id));
      setSnackbarMessage('League deleted successfully!');
    }

    setDeleteModalOpen(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Leagues List
      </Typography>
      <Button
        style={{ backgroundColor: '#f87203' }}
        onClick={() => {
          setNewLeagueName('');
          setNewLeagueImage(null);
          setCurrentLeague(null);
          setEditModalOpen(true);
        }}
        variant="contained"
        sx={{ mb: 2 }}
      >
        Add New League
      </Button>

      {isLoading ? (
       <TableContainer sx={{ minWidth: 800 }}>
       <Table>
         <TableBody>
           <TableLoading tableHeading={TABLE_HEAD} />
         </TableBody>
       </Table>
     </TableContainer>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>League Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leagues.map((league) => (
                <TableRow key={league.id}>
                  <TableCell>{league.leagueName}</TableCell>
                  <TableCell>
                    <img src={league.imageUrl} alt={league.leagueName} width="50" height="50" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditLeague(league)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteLeague(league)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit/Add League Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>{currentLeague ? 'Edit League' : 'Add League'}</DialogTitle>
        <DialogContent>
          <TextField
            label="League Name"
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewLeagueImage(e.target.files[0])}
            style={{ marginTop: 10 }}
          />
          {uploadingImage && <CircularProgress size={24} sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveLeagueChanges} color="primary">
            {currentLeague ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete League Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{currentLeague?.leagueName}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'center', horizontal: 'center' }} // Center the snackbar
>
  <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>

    </Box>
  );
};

export default LeagueList;
