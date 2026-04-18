import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";

export default function MonthlyLeaveStatementOS() {
  const [dept, setDept] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // For ALL STAFF section
  const [allDept, setAllDept] = useState("");
  const [allMonth, setAllMonth] = useState("");
  const [allYear, setAllYear] = useState("");

  // Load staff when department changes
  useEffect(() => {
    if (!dept) return;

    api
      .get("/users/by-department", { params: { dept } })
      .then((res) => setStaffList(res.data))
      .catch(() => setStaffList([]));
  }, [dept]);

  // ▶ Download PDF (single staff)
  const downloadPDF = () => {
    api
      .get("/leave/export/pdf", {
        params: { staffId, month, year },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "monthly_leave_statement.pdf";
        a.click();
      });
  };

  // ▶ Download Excel (single staff)
  const downloadExcel = () => {
    api
      .get("/leave/export/excel", {
        params: { staffId, month, year },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "monthly_leave_statement.xlsx";
        a.click();
      });
  };

  // ▶ Download ALL STAFF PDF
  const downloadAllPDF = () => {
    api
      .get("/leave/export-all/pdf", {
        params: { dept: allDept, month: allMonth, year: allYear },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `all_staff_leave_${allDept}.pdf`;
        a.click();
      });
  };

  // ▶ Download ALL STAFF Excel
  const downloadAllExcel = () => {
    api
      .get("/leave/export-all/excel", {
        params: { dept: allDept, month: allMonth, year: allYear },
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `all_staff_leave_${allDept}.xlsx`;
        a.click();
      });
  };

  return (
    <Box p={3}>
      {/* =============================
          SECTION 1: SINGLE STAFF REPORT
          ============================= */}
      <Paper sx={{ p: 3, maxWidth: 500, mx: "auto", mb: 4 }}>
        <Typography variant="h6" mb={2}>
          Monthly Leave Statement (Particular Staff)
        </Typography>

        <TextField
          fullWidth
          select
          label="Department"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="CSE">CSE</MenuItem>
          <MenuItem value="ECE">ECE</MenuItem>
          <MenuItem value="CE">CE</MenuItem>
          <MenuItem value="EE">EE</MenuItem>
          <MenuItem value="BSHME">BSHME</MenuItem>
          <MenuItem value="OFFICE_STAFF">Office Staff</MenuItem>
          <MenuItem value="ADMINISTRATION">Administration</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Select Staff"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          sx={{ mb: 2 }}
          disabled={!dept}
        >
          {staffList.length === 0 && (
            <MenuItem disabled>No Staff Found</MenuItem>
          )}

          {staffList.map((staff) => (
            <MenuItem key={staff.id} value={staff.staffId}>
              {staff.name} — {staff.staffId}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          sx={{ mb: 2 }}
        >
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Year"
          type="number"
          placeholder="2025"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 1 }}
          onClick={downloadPDF}
          disabled={!staffId}
        >
          Download PDF
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={downloadExcel}
          disabled={!staffId}
        >
          Download Excel
        </Button>
      </Paper>

      {/* =============================
          SECTION 2: ALL STAFF REPORT
          ============================= */}
      <Paper sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
        <Typography variant="h6" mb={2}>
          Monthly Leave Statement (All Staff of Department)
        </Typography>

        <TextField
          fullWidth
          select
          label="Department"
          value={allDept}
          onChange={(e) => setAllDept(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="CSE">CSE</MenuItem>
          <MenuItem value="ECE">ECE</MenuItem>
          <MenuItem value="CE">CE</MenuItem>
          <MenuItem value="EE">EE</MenuItem>
          <MenuItem value="BSHME">BSHME</MenuItem>
          <MenuItem value="OFFICE_STAFF">Office Staff</MenuItem>
          <MenuItem value="ADMINISTRATION">Administration</MenuItem>
        </TextField>

        <TextField
          fullWidth
          select
          label="Month"
          value={allMonth}
          onChange={(e) => setAllMonth(e.target.value)}
          sx={{ mb: 2 }}
        >
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("en", { month: "long" })}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Year"
          type="number"
          placeholder="2025"
          value={allYear}
          onChange={(e) => setAllYear(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 1 }}
          onClick={downloadAllPDF}
          disabled={!allDept}
        >
          Download PDF (All Staff)
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={downloadAllExcel}
          disabled={!allDept}
        >
          Download Excel (All Staff)
        </Button>
      </Paper>
    </Box>
  );
}
