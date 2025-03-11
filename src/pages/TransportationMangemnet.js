import React, { useState, useEffect, useRef } from 'react';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

import {
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../service/firebase-config';

const DraftWrestlingAdminPage = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', score: 0, rank: 0 });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDraftActive, setIsDraftActive] = useState(false);
  const [draftTimer, setDraftTimer] = useState(0);  // Timer in seconds
  const [loading, setLoading] = useState(true); // Simulate loading state
  const [editMember, setEditMember] = useState(null); // For editing members
  const [drafts, setDrafts] = useState([]); // Track all drafts
  const [draftStartDate, setDraftStartDate] = useState(null); // Store draft start date
  const [showDraftDetails, setShowDraftDetails] = useState(null); // For showing draft details
  const [currentdraftId, setcurrentdraftId] = useState(""); // For showing draft details


  const intervalRef = useRef(null);
  const membersCollection = collection(db, 'members');
const draftsCollection = collection(db, 'drafts');
  // Fetch members from Firestore
  const fetchMembers = async () => {
    const querySnapshot = await getDocs(membersCollection);
    const fetchedMembers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMembers(fetchedMembers);
    setLoading(false);
  };

  // Fetch drafts from Firestore
  const fetchDrafts = async () => {
    const querySnapshot = await getDocs(draftsCollection);
    const fetchedDrafts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDrafts(fetchedDrafts);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMembers();
    fetchDrafts();
  }, []);

  // Start the draft timer
  const handleStartDraft = async () => {
    const timerSet = prompt("Enter Timer ")
    setIsDraftActive(true);
    const startTime = new Date();
    setDraftStartDate(startTime.toLocaleString());  // Store the start time
    setDraftTimer(timerSet);  // Starting timer at 60 seconds for demo
    const querySnapshot = await getDocs(membersCollection);
    const fetchedMembers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const newDocRef = doc(draftsCollection);

    // Get the auto-generated document ID
    const draftId = newDocRef.id;

    // Create the draft object, including the draftId
    const newDraft = {
      draftId, // Store the draftId
      startTime: startTime.toLocaleString(),
      endTime: null,
      isActive: true,
      timer:timerSet,
      members: fetchedMembers, // Empty list of members initially
    };

    // Save the draft to Firestore
    await setDoc(newDocRef, newDraft);
    setcurrentdraftId(newDocRef.id)

    // const docRef = await setDoc(doc(draftsCollection), newDraft); // Save draft to Firestore
    console.log(newDocRef)
    setDrafts((prevDrafts) => [
      ...prevDrafts,
      { id: newDocRef.id, ...newDraft },
    ]);
  };

  // Timer countdown (every second)
  useEffect(() => {
    if (isDraftActive && draftTimer > 0) {
      intervalRef.current = setInterval(() => {
        setDraftTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current); // Clear the interval when timer reaches 0
            handleStopDraft()
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isDraftActive, draftTimer]);

  const updateDraftStatus = async (endTime) => {
    const querySnapshot = await getDocs(membersCollection);
    const fetchedMembers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("end ")
    console.log(fetchedMembers)
    const draftRef = doc(draftsCollection,currentdraftId);  // Example: First draft
    await updateDoc(draftRef, {
      endTime,
      isActive: false,
      members:fetchedMembers
    });
  };

  const handleEditMember = (member) => {
    setEditMember(member);
    setNewMember({ name: member.name, score: member.score, rank: member.rank });
    setIsDialogOpen(true);
  };

  const handleSaveEditedMember = async () => {
    const updatedMember = { ...editMember, ...newMember };
    const memberRef = doc(membersCollection, editMember.id);
    await updateDoc(memberRef, newMember); // Save updated member in Firestore
    setSnackbarMessage('Member updated successfully!');
    setSnackbarOpen(true);
    setEditMember(null);
    setIsDialogOpen(false);
    fetchMembers(); // Re-fetch members after edit
  };

  const handleDeleteMember = async (id) => {
    const memberRef = doc(membersCollection, id);
    await deleteDoc(memberRef); // Delete member from Firestore
    setSnackbarMessage('Member deleted successfully!');
    setSnackbarOpen(true);
    fetchMembers(); // Re-fetch members after deletion
  };

  const handleStopDraft = async () => {
    setIsDraftActive(false);
    const endTime = new Date().toLocaleString();
    // Update draft status to completed and save the draft
    setDrafts((prevDrafts) =>
      prevDrafts.map((draft) =>
        draft.isActive
          ? { ...draft, endTime, isActive: false,members }
          : draft
      )
    );
    // updateDraftStatus(endTime); // Update draft in Firestore
  };

  const handleAddMember = async () => {
    if (!newMember.name || newMember.score < 0 || newMember.rank < 0) {
      setSnackbarMessage('Please fill out all fields correctly!');
      setSnackbarOpen(true);
      return;
    }
  
    try {
      await addDoc(membersCollection, {
        name: newMember.name,
        score: newMember.score,
        rank: newMember.rank,
      });
      setSnackbarMessage('Member added successfully!');
      setSnackbarOpen(true);
      setIsDialogOpen(false); // Close dialog
      setNewMember({ name: '', score: 0, rank: 0 }); // Reset form state
      fetchMembers(); // Re-fetch members to update the table
    } catch (error) {
      setSnackbarMessage('Failed to add member!');
      setSnackbarOpen(true);
    }
  };
  

  const handleShowDraftDetails = (draftId) => {
    const draftDetails = drafts.find((draft) => draft.id === draftId);
    setShowDraftDetails(draftDetails);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Admin Header */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2E3B55' }}>
        Wrestling Draft Management (Admin Only)
      </Typography>

      {/* Start Draft Timer Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          style={{ backgroundColor: '#f87203' }}
          sx={{ marginRight: 2 }}
          onClick={handleStartDraft}
          disabled={isDraftActive}
        >
          Start Draft Timer
        </Button>
        {isDraftActive && (
          <Typography variant="h6" sx={{ color: '#2E7D32' }}>
            Draft Timer: {draftTimer}s
          </Typography>
        )}
        <Button
          variant="contained"
          color="error"
          sx={{ marginLeft: 2 }}
          onClick={handleStopDraft}
          disabled={!isDraftActive}
        >
          Stop Draft
        </Button>
      </Box>

      {/* Date of Draft */}
      {isDraftActive && draftStartDate && (
        <Typography variant="body1" sx={{ mb: 3, color: '#1e88e5' }}>
          Draft started at: {draftStartDate}
        </Typography>
      )}

      {/* Add New Member Button */}
      <Button
        variant="contained"
        style={{ backgroundColor: '#f87203' }}
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => {
          setEditMember(null); // Reset edit member if adding new
          setIsDialogOpen(true);
        }}
        disabled={isDraftActive}  // Disable button when draft is active
      >
        Add New Member
      </Button>

      {/* Display Members in Table */}
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

                // Skeleton loader for the rows
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width="100px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="120px" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="180px" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" width="80px" height="20px" />
                    </TableCell>
                   
                  </TableRow>
                ))
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No members available.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.score}</TableCell>
                  <TableCell>{member.rank}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditMember(member)}
                        disabled={isDraftActive}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteMember(member.id)}
                        disabled={isDraftActive}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Draft History Table */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Draft History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Draft ID</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drafts.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell>{draft.id}</TableCell>
                  <TableCell>{draft.startTime}</TableCell>
                  <TableCell>{draft.endTime || 'In Progress'}</TableCell>
                  <TableCell>{draft.isActive ? 'Active' : 'Completed'}</TableCell>
                  <TableCell>
                    <Tooltip title="Show Details">
                      <IconButton
                        color="primary"
                        onClick={() =>{
                          handleShowDraftDetails(draft.id)
                          console.log(draft)
                        } }
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {

<Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#2E3B55' }}>
    {editMember ? 'Edit Member' : 'Add New Member'}
  </DialogTitle>
  <DialogContent sx={{ padding: 3 }}>
    <TextField
      label="Name"
      fullWidth
      value={newMember.name}
      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Score"
      fullWidth
      type="number"
      value={newMember.score}
      onChange={(e) => setNewMember({ ...newMember, score: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Rank"
      fullWidth
      type="number"
      value={newMember.rank}
      onChange={(e) => setNewMember({ ...newMember, rank: e.target.value })}
      sx={{ mb: 2 }}
    />
  </DialogContent>
  <DialogActions sx={{ padding: '0 24px 24px' }}>
    <Button onClick={() => setIsDialogOpen(false)} color="primary">
      Cancel
    </Button>
    <Button
      onClick={handleAddMember} // Trigger the Add member logic
      color="primary"
      variant="contained"
      sx={{ backgroundColor: '#4A90E2' }}
    >
      Save
    </Button>
  </DialogActions>
</Dialog>

      }

      

      {showDraftDetails && (
  <Dialog open={Boolean(showDraftDetails)} onClose={() => setShowDraftDetails(null)} fullWidth maxWidth="md">
    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#2E3B55' }}>
      Draft Details
    </DialogTitle>
    <DialogContent sx={{ padding: 3 }}>
      {/* Draft Information Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
          Draft ID: <span style={{ color: '#000' }}>{showDraftDetails.id}</span>
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
          Start Time: <span style={{ color: '#000' }}>{showDraftDetails.startTime}</span>
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
          End Time: <span style={{ color: '#000' }}>
            {showDraftDetails.endTime || 'In Progress'}
          </span>
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4A90E2' }}>
          Status: <span style={{ color: showDraftDetails.isActive ? '#2E7D32' : '#E57373' }}>
            {showDraftDetails.isActive ? 'Active' : 'Completed'}
          </span>
        </Typography>
      </Box>

      {/* Members in this Draft */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4A90E2', mb: 2 }}>
          Members in this Draft:
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f4f6f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#4A90E2' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4A90E2' }}>Score</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#4A90E2' }}>Rank</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showDraftDetails.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.score}</TableCell>
                  <TableCell>{member.rank}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DialogContent>
    <DialogActions sx={{ padding: '0 24px 24px' }}>
      <Button onClick={() => setShowDraftDetails(null)} color="primary" variant="contained" sx={{ backgroundColor: '#4A90E2' }}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
)}



      {/* Snackbar for success message */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DraftWrestlingAdminPage;
