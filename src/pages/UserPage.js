import React, { useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const RokuDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState({
    installs: 0,
    uninstalls: 0,
    netInstalls: 0,
    revenue: 0,
  });
  const [topVideos, setTopVideos] = useState([]);
  const [topTransactions, setTopTransactions] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState({});

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setUploaded(false);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setTimeout(() => {
          processCSVData(result.data);
          setLoading(false);
          setUploaded(true);
        }, 1500);
      },
      error: (err) => console.error("Parsing error:", err),
    });
  };

  // Process CSV Data
  const processCSVData = (csvData) => {
    let installs = 0;
    let uninstalls = 0;
    let revenue = 0;
    const videoCounts = {};
    const transactions = [];
    const monthlyRev = {};

    csvData.forEach((row) => {
      const transactionType = row["Transaction Type"]?.toLowerCase();
      const transactionAmount = parseFloat(row["Transaction Amount"]?.replace(/,/g, "") || 0);
      const videoTitle = row["Video Title"];

      const date = new Date(row["Transaction Date"]);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (transactionType === "purchase") installs += 1;
      if (transactionType === "cancellation") uninstalls += 1;
      revenue += transactionAmount;

      if (!monthlyRev[monthYear]) monthlyRev[monthYear] = 0;
      monthlyRev[monthYear] += transactionAmount;

      transactions.push({
        date: row["Transaction Date"],
        type: row["Transaction Type"],
        amount: transactionAmount.toFixed(2),
      });

      if (videoTitle) {
        videoCounts[videoTitle] = (videoCounts[videoTitle] || 0) + 1;
      }
    });

    const netInstalls = installs - uninstalls;
    setSummary({ installs, uninstalls, netInstalls, revenue });

    console.log(videoCounts)

    // Top 10 Most Watched Videos
    const sortedVideos = Object.entries(videoCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title, count]) => ({ title, count }));


    setTopVideos(sortedVideos);
    setTopTransactions(transactions.slice(0, 10));
    setMonthlyRevenue(monthlyRev);
    setData(csvData);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📊 Roku Analytics Dashboard
      </Typography>

      {!uploaded ? (
        // File Upload Page
        <Paper style={{ padding: 20, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Upload Roku CSV Report
          </Typography>
          {/* File Upload Button */}
          <label htmlFor="upload-file">
            <input
              type="file"
              accept=".csv"
              id="upload-file"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
              Choose File
            </Button>
          </label>

          {loading && <CircularProgress style={{ marginTop: 10 }} />}
        </Paper>
      ) : (
        // Dashboard View
        <>
          <Typography variant="h6" style={{ marginBottom: 10 }}>
            Uploaded File: {fileName}
          </Typography>

          {/* Summary Cards */}
          <Grid container spacing={3}>
            {[
              { label: "Installs", value: summary.installs, color: "#4caf50" },
              { label: "Uninstalls", value: summary.uninstalls, color: "#f44336" },
              { label: "Net Installs", value: summary.netInstalls, color: "#2196f3" },
              { label: "Revenue ($)", value: summary.revenue.toFixed(2), color: "#ff9800" },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card style={{ backgroundColor: item.color, color: "white" }}>
                  <CardContent>
                    <Typography variant="h6">{item.label}</Typography>
                    <Typography variant="h5">{item.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} style={{ marginTop: 20 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">📈 Installs vs Uninstalls</Typography>
              <Pie
                data={{
                  labels: ["Installs", "Uninstalls", "Net Installs"],
                  datasets: [
                    {
                      data: [summary.installs, summary.uninstalls, summary.netInstalls],
                      backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
                    },
                  ],
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">💰 Revenue Analysis</Typography>
              <Bar
                data={{
                  labels: ["Revenue"],
                  datasets: [
                    {
                      label: "Total Revenue ($)",
                      data: [summary.revenue],
                      backgroundColor: ["#ff9800"],
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>

          {/* Top 10 Videos Table */}
          {/* <Typography variant="h6" style={{ marginTop: 20 }}>
            🎥 Top 10 Most Watched Videos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Video Title</TableCell>
                  <TableCell>Views</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topVideos.map((video, index) => (
                  <TableRow key={index}>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{video.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
          <Typography variant="h6" style={{ marginTop: 20 }}>💳 Top 10 Transactions</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topTransactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Reset Button */}
          <Button variant="contained" color="secondary" style={{ marginTop: 20 }} onClick={() => setUploaded(false)}>
            Upload Another File
          </Button>
        </>
      )}
    </Container>
  );
};

export default RokuDashboard;
