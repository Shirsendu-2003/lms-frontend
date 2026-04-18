import React, { useEffect, useState } from "react";
import api from "../../services/api";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";

export default function LeaveHistory() {
  const [rows, setRows] = useState([]);

  // ✅ Format YYYY-MM-DD → DD-MM-YYYY
  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const [y, m, day] = d.split("-");
      return `${day}-${m}-${y}`;
    } catch {
      return d;
    }
  };

  // ✅ Status color logic
  const statusColor = (status) => {
    if (!status || status === "-") return "default";

    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";

    return "warning"; // Pending
  };

  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("lms_user"));
        const staffId = user?.staffId || user?.userid || user?.id;

        if (!staffId) return;

        const res = await api.get(`/applications/history/${staffId}`);

        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRows(sorted);
      } catch (err) {
        console.error("Leave history load error:", err);
      }
    };

    load();
  }, []);

  return (
    <Paper className="p-3">
      <h3 className="mb-3 font-semibold text-lg">My Applications</h3>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Application ID</TableCell>
            <TableCell>Applied On</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Days</TableCell>
            <TableCell>HOD</TableCell>
            <TableCell>OS</TableCell>
            <TableCell>PIC</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => {
            const hod = r.hodStatus || "-";
            const osRaw = r.osStatus || "-";
            const picRaw = r.picStatus || "-";

            let os = "-";
            let pic = "-";

            // ✅ HOD Logic
            if (hod === "APPROVED") {
              os = osRaw === "-" ? "PENDING" : osRaw;

              // ✅ OS Logic
              if (os === "FORWARD_PIC") {
                pic = picRaw === "-" ? "PENDING" : picRaw;
              }
            }

            // ✅ Reject Flow
            if (hod === "REJECTED") {
              os = "-";
              pic = "-";
            }

            if (os === "REJECTED") {
              pic = "-";
            }

            return (
              <TableRow key={r.applicationId}>
                <TableCell>{r.applicationId}</TableCell>
                <TableCell>{formatDate(r.appliedOn)}</TableCell>
                <TableCell>{r.type}</TableCell>

                <TableCell>{formatDate(r.fromDate)}</TableCell>
                <TableCell>{formatDate(r.toDate)}</TableCell>

                <TableCell>{r.days}</TableCell>

                {/* ✅ HOD */}
                <TableCell>
                  <Chip label={hod} color={statusColor(hod)} />
                </TableCell>

                {/* ✅ OS */}
                <TableCell>
                  <Chip label={os} color={statusColor(os)} />
                </TableCell>

                {/* ✅ PIC */}
                <TableCell>
                  <Chip label={pic} color={statusColor(pic)} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
