import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const PAGE_SIZE = 8;

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/admin/leaves").then((r) => setApps(r.data || []));
  }, []);

  /* ===== Status Summary ===== */
  const summary = useMemo(() => {
    const total = apps.length;
    const pending = apps.filter((a) => a.overallStatus === "PENDING").length;
    const approved = apps.filter((a) => a.overallStatus === "APPROVED").length;
    const rejected = apps.filter((a) => a.overallStatus === "REJECTED").length;
    return { total, pending, approved, rejected };
  }, [apps]);

  /* ===== Filtering ===== */
  const filteredApps = useMemo(() => {
    return apps.filter((a) => {
      const matchesSearch =
        !search ||
        (a.staffName || a.staffId)
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus = status === "ALL" || a.overallStatus === status;

      const appliedDate = a.fromDate;
      const matchesFrom = !fromDate || appliedDate >= fromDate;
      const matchesTo = !toDate || appliedDate <= toDate;

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [apps, search, status, fromDate, toDate]);

  /* ===== Pagination ===== */
  const totalPages = Math.ceil(filteredApps.length / PAGE_SIZE);
  const paginatedApps = filteredApps.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const statusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* ================= STATUS SUMMARY ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard title="Total" value={summary.total} color="slate" />
        <SummaryCard title="Pending" value={summary.pending} color="amber" />
        <SummaryCard title="Approved" value={summary.approved} color="green" />
        <SummaryCard title="Rejected" value={summary.rejected} color="red" />
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by staff name / ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-auto bg-white rounded-2xl shadow-sm border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="p-3 text-left">Staff</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Applied On</th>
            </tr>
          </thead>

          <tbody>
            {paginatedApps.map((a) => (
              <tr
                key={a.applicationId}
                className="hover:bg-slate-50 transition"
              >
                <td className="p-3 border-b font-medium">
                  {a.staffName || a.staffId}
                </td>
                <td className="p-3 border-b">{a.type}</td>
                <td className="p-3 border-b">
                  {a.fromDate} → {a.toDate}
                </td>
                <td className="p-3 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                      a.overallStatus
                    )}`}
                  >
                    {a.overallStatus}
                  </span>
                </td>
                <td className="p-3 border-b">{a.fromDate}</td>
              </tr>
            ))}

            {paginatedApps.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-500">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* ===== Small Summary Card ===== */
function SummaryCard({ title, value, color }) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
      <div className="text-sm text-slate-500">{title}</div>
      <div
        className={`inline-block mt-2 px-3 py-1 rounded-full font-semibold ${colors[color]}`}
      >
        {value}
      </div>
    </div>
  );
}
