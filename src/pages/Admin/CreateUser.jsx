import React, { useState } from "react";
import api from "../../services/api";

export default function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
    role: "",
    department: "",
    dateOfJoining: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    "ADMIN",
    "STAFF",
    "OFFICE_STAFF",
    "HOD",
    "AR",
    "OS",
    "PIC",
    "ACC",
    "REGISTRAR",
    "PRINCIPAL",
  ];

  const departments = ["CSE", "ECE", "CE", "EE", "BSHME", "OFFICE_STAFF"];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        role: form.role?.toUpperCase(),
        department: form.department?.toUpperCase(),
      };

      await api.post("/admin/user/create", payload);

      setMsg("✅ User created successfully!");
      setForm({
        name: "",
        email: "",
        mobileNo: "",
        password: "",
        role: "",
        department: "",
        dateOfJoining: "",
      });
    } catch (err) {
      console.error(err.response);
      setMsg(
        "❌ " +
          (err.response?.data?.message ||
            err.response?.data ||
            "Error creating user")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow border p-6">
        <h2 className="text-2xl font-semibold mb-6">Create New User</h2>

        {msg && (
          <div
            className={`mb-4 p-3 rounded ${
              msg.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={submitForm} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Mobile"
            name="mobileNo"
            value={form.mobileNo}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <Input
            label="Date of Joining"
            name="dateOfJoining"
            type="date"
            value={form.dateOfJoining}
            onChange={handleChange}
          />

          <Select
            label="Role"
            name="role"
            value={form.role}
            options={roles}
            onChange={handleChange}
          />
          <Select
            label="Department"
            name="department"
            value={form.department}
            options={departments}
            onChange={handleChange}
          />

          <button
            disabled={loading || !form.role}
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              loading || !form.role
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        {...props}
        required
        className="w-full px-4 py-2 border rounded-xl"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select
        {...props}
        required
        className="w-full px-4 py-2 border rounded-xl"
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
