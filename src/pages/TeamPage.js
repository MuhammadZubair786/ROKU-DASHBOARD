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
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../service/firebase-config';
import TableLoading from '../components/table-loading/tableLoading';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLogo, setNewTeamLogo] = useState(null); // Image file state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const TABLE_HEAD = [
    { id: 'teamName', label: 'Team Name', alignRight: false },
    { id: 'teamLogo', label: 'Team Logo', alignRight: false },
    { id: 'actions', label: 'Actions', alignRight: false },
  ];

  // Fetch data from Firebase Firestore
  useEffect(() => {
    const fetchTeams = async () => {
      const querySnapshot = await getDocs(collection(db, 'teams'));
      const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
      setIsLoading(false);
    };

    fetchTeams();
  }, []);

  const handleImageChange = (e) => {
    setNewTeamLogo(e.target.files[0]);
  };

  const handleDeleteTeam = (team) => {
    setCurrentTeam(team);
    setDeleteModalOpen(true);
  };

  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'newpresent'); // Replace with your Cloudinary upload preset
    formData.append('cloud_name', 'dkfgfnbst'); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dkfgfnbst/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url; // This is the image URL that you will store in Firestore
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleAddTeam = async () => {
    if (newTeamName.trim() !== '') {
      try {
        let teamLogoUrl = 'defaultLogo.png'; // Default logo in case no image is uploaded
        if (newTeamLogo) {
          teamLogoUrl = await uploadImageToCloudinary(newTeamLogo);
        }

        const docRef = await addDoc(collection(db, 'teams'), {
          teamName: newTeamName,
          teamLogo: teamLogoUrl,
        });

        setTeams(prevTeams => [
          ...prevTeams,
          { id: docRef.id, teamName: newTeamName, teamLogo: teamLogoUrl },
        ]);
        setNewTeamName('');
        setNewTeamLogo(null); // Reset the logo input
        setEditModalOpen(false);
        setSnackbarMessage('Team added successfully!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error adding team:", error);
      }
    }
  };

  const handleEditTeam = (team) => {
    setCurrentTeam(team);
    setNewTeamName(team.teamName);
    setNewTeamLogo(null); // Allow for new image to be uploaded
    setEditModalOpen(true);
  };

  const handleSaveTeamChanges = async () => {
    try {
      let teamLogoUrl = currentTeam.teamLogo; // Keep the existing logo if no new logo is uploaded
      if (newTeamLogo) {
        teamLogoUrl = await uploadImageToCloudinary(newTeamLogo);
      }

      const teamRef = doc(db, 'teams', currentTeam.id);
      await updateDoc(teamRef, { teamName: newTeamName, teamLogo: teamLogoUrl });

      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === currentTeam.id ? { ...team, teamName: newTeamName, teamLogo: teamLogoUrl } : team
        )
      );
      setEditModalOpen(false);
      setSnackbarMessage('Team updated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const teamRef = doc(db, 'teams', currentTeam.id);
      await deleteDoc(teamRef);
      setTeams(prevTeams => prevTeams.filter(team => team.id !== currentTeam.id));
      setDeleteModalOpen(false);
      setSnackbarMessage('Team deleted successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Teams List
      </Typography>
      <Button
        style={{ backgroundColor: '#f87203' }}
        onClick={() => {
          setNewTeamName('');
          setCurrentTeam(null);
          setEditModalOpen(true);
        }}
        variant="contained"
        sx={{ mb: 2 }}
      >
        Add New Team
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
                <TableCell>Team Name</TableCell>
                <TableCell>Team Logo</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.teamName}</TableCell>
                  <TableCell>
                    <img src={team.teamLogo} alt={team.teamName} width={50} height={50} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditTeam(team)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteTeam(team)}>
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

      {/* Edit/Add Team Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>{currentTeam ? 'Edit Team' : 'Add Team'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ marginTop: '1rem' }}
          />
          {newTeamLogo && (
            <img src={URL.createObjectURL(newTeamLogo)} alt="Preview" width={100} height={100} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={currentTeam ? handleSaveTeamChanges : handleAddTeam}
            color="primary"
          >
            {currentTeam ? 'Save Changes' : 'Add Team'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Are you sure you want to delete this team?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeamList;
