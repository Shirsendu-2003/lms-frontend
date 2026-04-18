import React, { useEffect, useState } from "react";
import api from "../../services/api";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";

export default function PendingLeaveStatus() {
  const [rows, setRows] = useState([]);

  const formatDate = (d) => {
    if (!d) return "-";
    const [y, m, day] = d.split("-");
    return `${day}-${m}-${y}`;
  };

  const statusColor = (status) => {
    if (!status || status === "-") return "default";
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";
    return "warning";
  };

  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("lms_user"));
        const staffId = user?.staffId || user?.userid || user?.id;

        if (!staffId) return;

        // ✅ Same API as history
        const res = await api.get(`/applications/history/${staffId}`);

        const list = res.data || [];

        // ✅ Apply workflow + filter only PENDING
        const filtered = list.filter((r) => {
          // Only show if ANY status is pending
          return (
            r.hodStatus === "PENDING" ||
            r.osStatus === "PENDING" ||
            r.picStatus === "PENDING"
          );
        });

        setRows(filtered);
      } catch (err) {
        console.error("Pending leaves load error:", err);
      }
    };

    load();
  }, []);

  return (
    <Paper className="p-3">
      <h3 className="mb-3 font-semibold text-lg">Pending Leave Status</h3>

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

            if (hod === "APPROVED") {
              os = osRaw === "-" ? "PENDING" : osRaw;

              if (os === "FORWARD_PIC") {
                pic = picRaw === "-" ? "PENDING" : picRaw;
              }
            }

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

                <TableCell>
                  <Chip label={hod} color={statusColor(hod)} />
                </TableCell>

                <TableCell>
                  <Chip label={os} color={statusColor(os)} />
                </TableCell>

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
