import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

export default function OSHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusColor = (status) => {
    if (!status) return "default";

    if (status === "FORWARD_PIC") return "info"; // OS forwarded to PIC
    if (status === "ADJUSTED") return "warning"; // OS adjusted
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";

    return "warning";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    api
      .get("/applications/history/os")
      .then((res) => {
        setRows(res.data || []);
      })
      .catch(() => {
        setError("Failed to load history.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper className="p-3">
      <Typography variant="h6" className="mb-3 font-semibold">
        OS Processed History
      </Typography>

      {/* Loading state */}
      {loading && (
        <Box className="flex justify-center my-5">
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {!loading && error && (
        <Typography color="error" className="text-center">
          {error}
        </Typography>
      )}

      {/* No data found */}
      {!loading && !error && rows.length === 0 && (
        <Typography className="text-center py-4 text-gray-500">
          No OS history found.
        </Typography>
      )}

      {/* Data table */}
      {!loading && !error && rows.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Staff</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>OS Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((r, idx) => (
              <TableRow key={r.applicationId || idx}>
                <TableCell>{r.staffName}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>{formatDate(r.fromDate)}</TableCell>
                <TableCell>{formatDate(r.toDate)}</TableCell>
                <TableCell>{r.days}</TableCell>
                <TableCell>
                  <Chip
                    label={r.osStatus || "PENDING"}
                    color={statusColor(r.osStatus)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
