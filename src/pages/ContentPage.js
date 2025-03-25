import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import { Modal, Box, Button, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { db, collection, addDoc, getDocs } from "../service/firebase-config";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Cloudinary Config
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dpzgzkv6o/upload";
  const UPLOAD_PRESET = "csvpresent";

  // 🔹 Year & Month Options
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 🔹 Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🔹 Upload CSV to Cloudinary & Store in Firestore
  const handleUpload = async () => {
    if (!file || !selectedYear || !selectedMonth) {
      alert("Please select a CSV file, year, and month!");
      return;
    }

    setLoading(true); // Show loading state

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "raw");

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      const fileUrl = res.data.secure_url;

      // Save URL, Year & Month to Firestore
      await addDoc(collection(db, "csvFiles"), {
        url: fileUrl,
        name: file.name,
        selectedYear,
        selectedMonth
      });

      alert("File uploaded successfully!");
      fetchUploadedFiles(); // Refresh uploaded files list
      setFile(null); // Reset file
      setSelectedYear("");
      setSelectedMonth("");
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // 🔹 Fetch Uploaded Files from Firestore
  const fetchUploadedFiles = async () => {
    const querySnapshot = await getDocs(collection(db, "csvFiles"));
    const files = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUploadedFiles(files);
  };

  // 🔹 Parse and Display CSV Data in Modal
  const handleViewCSV = async (fileUrl) => {
    try {
      const res = await axios.get(fileUrl);
      Papa.parse(res.data, {
        header: true,
        complete: (result) => {
          setCsvData(result.data);
          setOpen(true); // Open the modal
        },
      });
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  // 🔹 Close Modal
  const handleClose = () => setOpen(false);

  // 🔹 Fetch on Load
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>📂 Upload & View CSV Files</h2>

      {/* 🔹 Year & Month Selection */}
      <FormControl style={{ marginRight: "10px", minWidth: 120 }}>
        <InputLabel>Year</InputLabel>
        <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {years.map((year) => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ marginRight: "10px", minWidth: 120 }}>
        <InputLabel>Month</InputLabel>
        <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months.map((month, index) => (
            <MenuItem key={index} value={month}>{month}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 🔹 File Upload Section */}
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        style={{ marginLeft: "10px" }}
        disabled={!file || !selectedYear || !selectedMonth || loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>

      {/* 🔹 Uploaded Files Table */}
      <h3>📄 Uploaded CSV Files</h3>
      <Table style={{ margin: "auto", width: "80%", borderCollapse: "collapse" }}>
        <TableHead>
          <TableRow style={{ border: "1px solid red" }}>
            <TableCell style={{ border: "1px solid red" }}><b>S.No</b></TableCell>
            <TableCell style={{ border: "1px solid red" }}><b>File Name</b></TableCell>
            <TableCell style={{ border: "1px solid red" }}><b>Year</b></TableCell>
            <TableCell style={{ border: "1px solid red" }}><b>Month</b></TableCell>
            <TableCell style={{ border: "1px solid red" }}><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {uploadedFiles.map((file, index) => (
            <TableRow key={file.id} style={{ border: "1px solid blue" }}>
              <TableCell style={{ border: "1px solid blue" }}>{index + 1}</TableCell>
              <TableCell style={{ border: "1px solid blue" }}>{file.name}</TableCell>
              <TableCell style={{ border: "1px solid blue" }}>{file.selectedYear}</TableCell>
              <TableCell style={{ border: "1px solid blue" }}>{file.selectedMonth}</TableCell>
              <TableCell style={{ border: "1px solid blue" }}>
                <Button variant="outlined" color="secondary" onClick={() => handleViewCSV(file.url)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 🔹 Modal for Viewing CSV Data */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflow: "auto",
          maxHeight: "80vh"
        }}>
          <h2>📊 CSV Data</h2>
          <Table border="1" style={{ width: "100%", textAlign: "center" }}>
            <TableHead>
              <TableRow>
                {csvData.length > 0 && Object.keys(csvData[0]).map((key, index) => (
                  <TableCell key={index}><b>{key}</b></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <TableCell key={colIndex}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="contained" color="error" onClick={handleClose} style={{ marginTop: "10px" }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadCSV;
