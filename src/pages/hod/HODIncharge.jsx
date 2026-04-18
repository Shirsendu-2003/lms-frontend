import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";

export default function HODIncharge() {
  const [dept, setDept] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [search, setSearch] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("ALL");

  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [history, setHistory] = useState([]);

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const loadHistory = () => {
    api
      .get("/hod/incharge/history")
      .then((res) => setHistory(res.data))
      .catch(() => {});
  };

  // Fetch staff when dept changes
  useEffect(() => {
    if (!dept) return;

    setLoading(true);

    api
      .get("/users/by-department", { params: { dept } })
      .then((res) => {
        setStaffList(res.data);
        setDesignations([...new Set(res.data.map((u) => u.designation))]);
        setLoading(false);
      })
      .catch(() => {
        setStaffList([]);
        setLoading(false);
      });

    api
      .get("/hod/incharge", { params: { dept } })
      .then((res) => {
        if (res.data?.staffId) {
          setSelectedStaff(res.data.staffId);
        } else {
          setSelectedStaff("");
        }
      })
      .catch(() => {});

    loadHistory();
  }, [dept]);

  const handleSave = () => {
    if (!dept || !selectedStaff) return;

    setSaving(true);

    api
      .post("/hod/incharge", { dept, staffId: selectedStaff })
      .then(() => {
        alert("Incharge updated successfully!");
        loadHistory();
      })
      .catch(() => {
        alert("Error saving incharge");
      })
      .finally(() => setSaving(false));
  };

  // FILTER + SORT + SEARCH LOGIC
  const filteredSortedData = useMemo(() => {
    let data = [...staffList];

    if (search.trim()) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.staffId.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterDesignation !== "ALL") {
      data = data.filter((u) => u.designation === filterDesignation);
    }

    data.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });

    return data;
  }, [staffList, search, filterDesignation, sortField, sortDir]);

  const totalPages = Math.ceil(filteredSortedData.length / pageSize);
  const paginated = filteredSortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const changeSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const formatIST = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h6" mb={3}>
          HOD – Assign Page Incharge
        </Typography>

        {/* Department Selector */}
        <TextField
          fullWidth
          select
          label="Select Department"
          value={dept}
          onChange={(e) => {
            setDept(e.target.value);
            setPage(1);
          }}
          sx={{ mb: 3, maxWidth: 350 }}
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="CSE">CSE</MenuItem>
          <MenuItem value="ECE">ECE</MenuItem>
          <MenuItem value="EE">EE</MenuItem>
          <MenuItem value="CE">CE</MenuItem>
          <MenuItem value="BSHME">BSHME</MenuItem>
          <MenuItem value="OFFICE_STAFF">Office Staff</MenuItem>
          <MenuItem value="ADMINISTRATION">Administration</MenuItem>
        </TextField>

        {dept && (
          <>
            {/* Filters */}
            <div className="flex gap-4 items-end mb-4">
              <TextField
                label="Search"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "250px" }}
              />

              <TextField
                select
                label="Designation"
                size="small"
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                style={{ width: "220px" }}
              >
                <MenuItem value="ALL">All Designations</MenuItem>
                {designations.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {/* TABLE */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => changeSort("name")}
                  >
                    Name
                  </th>
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => changeSort("email")}
                  >
                    Email
                  </th>
                  <th
                    className="p-2 cursor-pointer"
                    onClick={() => changeSort("designation")}
                  >
                    Designation
                  </th>
                  <th className="p-2">Select Incharge</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      <CircularProgress />
                    </td>
                  </tr>
                )}

                {!loading &&
                  paginated.map((staff) => (
                    <tr
                      key={staff.staffId}
                      className={`border-b ${
                        selectedStaff === staff.staffId
                          ? "bg-green-100"
                          : "bg-white"
                      }`}
                    >
                      <td className="p-2">{staff.name}</td>
                      <td className="p-2">{staff.email}</td>
                      <td className="p-2">{staff.designation}</td>

                      {/* ALWAYS GREEN BUTTON IF SELECTED */}
                      <td className="p-2 text-center">
                        <Button
                          variant={
                            selectedStaff === staff.staffId
                              ? "contained"
                              : "outlined"
                          }
                          color={
                            selectedStaff === staff.staffId
                              ? "success"
                              : "primary"
                          }
                          onClick={() => setSelectedStaff(staff.staffId)}
                        >
                          {selectedStaff === staff.staffId
                            ? "Assigned"
                            : "Assign"}
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="contained"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </Button>

              <span>
                Page {page} / {totalPages}
              </span>

              <Button
                variant="contained"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>

            {/* SAVE BUTTON */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={!selectedStaff || saving}
              onClick={handleSave}
            >
              {saving ? <CircularProgress size={24} /> : "Save Incharge"}
            </Button>

            {/* HISTORY */}
            <div className="mt-8">
              <Typography variant="subtitle1" mb={1}>
                Incharge Assignment History
              </Typography>

              <Paper sx={{ p: 2, maxHeight: 260, overflowY: "auto" }}>
                {history.length === 0 && <p>No history found</p>}

                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2">Department</th>
                      <th className="p-2">Staff ID</th>
                      <th className="p-2">Assigned At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-b">
                        <td className="p-2">{h.department}</td>
                        <td className="p-2">{h.staffId}</td>
                        <td className="p-2">{formatIST(h.assignedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Paper>
            </div>
          </>
        )}
      </Paper>
    </Box>
  );
}
