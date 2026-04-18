// src/components/Accountant/AccountantDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AnimCard from "../UI/AnimCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function AccountantDashboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api
      .get("/accountant/approved")
      .then((res) => {
        console.log("✅ Accountant data:", res.data);
        setRows(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("❌ Accountant load error:", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimCard
          title="WITHOUT PAY Leaves"
          value={rows.length}
          icon={<MonetizationOnIcon />}
        />
        <AnimCard
          title="Payroll Pending"
          value="—"
          icon={<MonetizationOnIcon />}
        />
        <AnimCard
          title="Payroll Processed"
          value="—"
          icon={<MonetizationOnIcon />}
        />
      </div>

      {/* Approved Leaves List */}
      <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4">
        <h4 className="font-semibold mb-3">WITHOUT PAY Leaves (View Only)</h4>

        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.applicationId}
              className="p-3 bg-white dark:bg-gray-900 rounded border flex items-center justify-between"
            >
              {/* Left side info */}
              <div>
                <div className="font-medium">
                  {r.staffName || r.staffId || "Unknown Staff"}
                </div>

                <div className="text-sm text-gray-500">
                  {r.type || "—"} • {r.fromDate || "—"} to {r.toDate || "—"}
                </div>

                <div className="text-sm text-gray-400">
                  PIC: {r.picStatus || "—"} | AC: {r.acStatus || "—"}
                </div>
              </div>

              {/* VIEW ONLY BADGE */}
              <span className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700">
                VIEW ONLY
              </span>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="text-gray-500 text-sm">
              No WITHOUT PAY leaves found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
