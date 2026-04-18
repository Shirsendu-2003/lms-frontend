import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  // Toggle Active / Blocked
  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/users/toggle-status/${id}`);
      loadUsers();
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          User Management
        </h1>

        <button
          onClick={() => navigate("/admin/create-user")}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          + Create User
        </button>
      </div>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search by name..."
        className="border border-slate-300 rounded-xl px-4 py-2 w-72 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ===== TABLE ===== */}
      <div className="overflow-auto bg-white rounded-2xl shadow-sm border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-3 font-medium text-slate-800">{u.userid}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-slate-600">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.department}</td>

                {/* STATUS */}
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.active ? "Active" : "Blocked"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/users/edit/${u.id}`)}
                    className="px-3 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => toggleStatus(u.id)}
                    className={`px-3 py-1 rounded-lg text-white transition ${
                      u.active
                        ? "bg-slate-600 hover:bg-slate-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {u.active ? "Block" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-slate-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
