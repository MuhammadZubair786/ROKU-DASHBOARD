import React, { useState, useEffect } from "react";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import Papa from "papaparse";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Container,
  Typography,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const db = getFirestore();

const RokuNew = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topTransactions, setTopTransactions] = useState([]);
  const [summary, setSummary] = useState({
    installs: 0,
    uninstalls: 0,
    netInstalls: 0,
    grossrevenue: 0,
    netrevenue: 0
  });

  useEffect(() => {
    const fetchFiles = async () => {
      const querySnapshot = await getDocs(collection(db, "csvFiles"));
      const fileList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFiles(fileList);
    };
    fetchFiles();
  }, []);

  const handleFileSelect = async (event) => {
    // let name = event.split(",")
    const [year, month, fileName] = event.target.value.split(",");
    console.log(year, month, fileName)

    const selected = files.find((file) =>
      `${file.selectedYear} ${file.selectedMonth} ${file.name}` === `${year} ${month} ${fileName}`
    );

    if (!selected) return;
    setSelectedFile(event.target.value);
    setLoading(true);

    try {
      const response = await fetch(selected.url);
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          processCSVData(result.data);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error fetching file:", error);
      setLoading(false);
    }
  };

  const processCSVData = (csvData) => {
    let installs = 0;
    let uninstalls = 0;
    let grossrevenue = 0;
    let netrevenue = 0;
    const transactions = [];

    csvData.forEach((row) => {
      const transactionType = row["Transaction Type"]?.toLowerCase();
      const transactionAmount = parseFloat(row["Transaction Amount"]?.replace(/,/g, "") || 0);
      const newtransactionAmount = parseFloat(row['Developer Rev Share']?.replace(/,/g, '') || 0);

      if (transactionType === "purchase") installs += 1;
      if (transactionType === "cancellation") uninstalls += 1;
      grossrevenue += transactionAmount;
      netrevenue += newtransactionAmount;


      if (transactionAmount > 0) {
        transactions.push({
          date: row['Transaction Date'],
          type: row['Transaction Type'],
          amount: transactionAmount,
        });
      }
    });


    setSummary({ installs, uninstalls, netInstalls: installs - uninstalls, grossrevenue, netrevenue });
    setData(csvData);
    setTopTransactions(transactions);

  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📊 Roku Analytics Dashboard
      </Typography>

      <Paper style={{ padding: 20, textAlign: "center" }}>
        <FormControl fullWidth>
          <InputLabel>Select CSV File</InputLabel>
          <Select value={selectedFile} onChange={handleFileSelect}>
            {files.map((file, index) => (
              <MenuItem key={index} value={`${file.selectedYear},${file.selectedMonth},${file.name}`}>
                {(index + 1)} &emsp; {file.selectedYear} &emsp; {file.selectedMonth} &emsp; {file.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading && <CircularProgress style={{ marginTop: 20 }} />}

      {data.length > 0 && (
        <>
          <Grid container spacing={3} style={{ marginTop: 20 }}>
            {[{ label: "Installs", value: summary.installs }, { label: "Uninstalls", value: summary.uninstalls }, { label: "Gross Revenue ($)", value: summary.grossrevenue.toFixed(2) }, { label: "Net Revenue ($)", value: summary.netrevenue.toFixed(2) }].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{item.label}</Typography>
                    <Typography variant="h5">{item.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} style={{ marginTop: 20 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">📈 Installs vs Uninstalls</Typography>
              <Pie data={{ labels: ["Installs", "Uninstalls"], datasets: [{ data: [summary.installs, summary.uninstalls], backgroundColor: ["#4caf50", "#f44336"] }] }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">💰 Revenue Analysis</Typography>
              <Doughnut
                data={{
                  labels: ["Gross Revenue ($)", "Net Revenue ($)"],
                  datasets: [
                    {
                      data: [summary.grossrevenue, summary.netrevenue],
                      backgroundColor: ["#ff9800", "#028067"],
                      hoverBackgroundColor: ["#ffa726", "#26a69a"],
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" style={{ marginTop: 20 }}>
            💳 Top 10 Transactions
          </Typography>
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
        </>
      )}
    </Container>
  );
};

export default RokuNew;
