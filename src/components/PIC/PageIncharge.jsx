import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import { Button, TextField, MenuItem } from "@mui/material";

export default function PageIncharge() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("ALL");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [logs, setLogs] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/all");
      setUsers(res.data);
      setDepartments([...new Set(res.data.map((u) => u.department))]);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get("/logs/incharge");
      setLogs(res.data);
    } catch (err) {
      console.error("Error loading logs", err);
    }
  };

  // Assign In-Charge (always sets true)
  const toggleRadioMode = async (userId, userName) => {
    const confirm = window.confirm(
      `Are you sure you want to assign In-Charge to ${userName}?`
    );

    if (!confirm) return;

    try {
      setLoading(true);

      await api.put(
        `/users/incharge/${userId}?status=true`,
        {},
        {
          headers: {
            actor: "Admin",
          },
        }
      );

      await fetchUsers();
      await fetchLogs();
    } catch (err) {
      console.error("Error toggling incharge", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  // FILTER + SORT + SEARCH
  const filteredSortedData = useMemo(() => {
    let data = [...users];

    if (search.trim()) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dept !== "ALL") {
      data = data.filter((u) => u.department === dept);
    }

    data.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });

    return data;
  }, [users, search, dept, sortField, sortDir]);

  // PAGINATION
  const totalPages = Math.ceil(filteredSortedData.length / pageSize);
  const paginatedData = filteredSortedData.slice(
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

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
      {/* SEARCH + FILTER */}
      <div className="flex gap-4 items-end">
        <TextField
          label="Search user"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "220px" }}
        />

        <TextField
          select
          label="Department"
          size="small"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          style={{ width: "200px" }}
        >
          <MenuItem value="ALL">All Departments</MenuItem>
          {departments.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
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
              onClick={() => changeSort("department")}
            >
              Department
            </th>
            <th className="p-2 text-center">In-Charge</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((u) => (
            <tr
              key={u.id}
              className={`border-b dark:border-gray-700 ${
                u.incharge ? "bg-green-100 dark:bg-green-700" : ""
              }`}
            >
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.department}</td>

              <td className="p-2 text-center">
                {u.incharge ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    disabled={true}
                  >
                    In-Charge
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={loading} // 🔥 No disable when someone else is in-charge
                    onClick={() => toggleRadioMode(u.id, u.name)}
                  >
                    Assign
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
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

      {/* ACTIVITY LOG */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Activity Log</h3>

        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded h-48 overflow-auto text-sm">
          {logs.length === 0 && <p>No activity yet</p>}

          {logs.map((log, index) => (
            <div key={index} className="mb-2">
              <strong>{log.actor}</strong> {log.action}
              <strong> {log.target}</strong> at {log.time}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
