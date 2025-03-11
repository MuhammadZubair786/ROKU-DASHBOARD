import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { collection, getDocs, updateDoc, doc,addDoc  } from "firebase/firestore";
import { db } from '../service/firebase-config';

const LeaguesApprovalPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const addStaticLeagues = async () => {
    const leagues = [
      {
        leagueName: "Premier League",
        userName: "John Doe",
        userEmail: "john.doe@example.com",
        status: "pending",
      },
      {
        leagueName: "La Liga",
        userName: "Jane Smith",
        userEmail: "jane.smith@example.com",
        status: "pending",
      },
      {
        leagueName: "Serie A",
        userName: "Bob Johnson",
        userEmail: "bob.johnson@example.com",
        status: "pending",
      },
      {
        leagueName: "Bundesliga",
        userName: "Alice Brown",
        userEmail: "alice.brown@example.com",
        status: "pending",
      },
      {
        leagueName: "Ligue 1",
        userName: "Charlie Davis",
        userEmail: "charlie.davis@example.com",
        status: "pending",
      },
    ];
  
    try {
      const collectionRef = collection(db, "leagues");
  
      // Use Promise.all to execute all addDoc calls concurrently
      await Promise.all(
        leagues.map((league) => addDoc(collectionRef, league))
      );
  
      console.log("Static leagues added successfully!");
    } catch (error) {
      console.error("Error adding static leagues: ", error);
    }
  };
  
  
  // Call the function to add static leagues
  // addStaticLeagues();

  

  // Fetch leagues data from Firestore
  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "leagues"));
        const leaguesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeagues(leaguesData);
      } catch (error) {
        console.error("Error fetching leagues: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  // Update league status in Firestore
  const updateLeagueStatus = async (leagueId, status) => {
    try {
      const leagueDoc = doc(db, "leagues", leagueId);
      await updateDoc(leagueDoc, { status });
      setLeagues((prevLeagues) =>
        prevLeagues.map((league) =>
          league.id === leagueId ? { ...league, status } : league
        )
      );
      setSnackbarMessage(
        status === "approved" ? "League approved successfully!" : "League rejected!"
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating league status: ", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "#2E3B55" }}
      >
        League Approval Dashboard
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">League Name</TableCell>
              <TableCell align="left">User Name</TableCell>
              <TableCell align="left">User Email</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
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
                  <TableCell align="center">
                    <Skeleton variant="circle" width={40} height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              leagues.map((league) => (
                <TableRow key={league.id}>
                  <TableCell>{league.leagueName}</TableCell>
                  <TableCell>{league.userName}</TableCell>
                  <TableCell>{league.userEmail}</TableCell>
                  <TableCell align="center">
                    {league.status === "pending" ? (
                      <Typography color="orange" fontWeight="bold">
                        Pending
                      </Typography>
                    ) : league.status === "approved" ? (
                      <Typography color="green" fontWeight="bold">
                        Approved
                      </Typography>
                    ) : (
                      <Typography color="red" fontWeight="bold">
                        Rejected
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {league.status === "pending" && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton
                            onClick={() => updateLeagueStatus(league.id, "approved")}
                            color="primary"
                            sx={{
                              "&:hover": {
                                backgroundColor: "#E0F7FA",
                                color: "#00838F",
                              },
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            onClick={() => updateLeagueStatus(league.id, "rejected")}
                            color="error"
                            sx={{
                              "&:hover": {
                                backgroundColor: "#FFEBEE",
                                color: "#D32F2F",
                              },
                            }}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {league.status !== "pending" && (
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: league.status === "approved" ? "green" : "red",
                        }}
                      >
                        {/* {league.status.charAt(0).toUpperCase() +
                          league.status.slice(1)} */}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaguesApprovalPage;
