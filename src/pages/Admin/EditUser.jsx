import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobileNo: "",
    department: "",
    role: "",
  });

  const departments = [
    "CSE",
    "ECE",
    "CE",
    "EE",
    "BSHME",
    "OFFICE_STAFF",
    "ADMINISTRATION",
  ];

  const roles = ["ADMIN", "STAFF", "HOD", "AR", "OS", "PIC", "ACC"];

  // ✅ Load User
  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user");
        setLoading(false);
      });
  }, [id]);

  // ✅ Handle input update
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Save updates
  const handleSave = () => {
    setSaving(true);
    setError("");

    api
      .put(`/admin/users/${id}`, user)
      .then(() => {
        alert("✅ User updated successfully!");
        navigate("/admin/users");
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to update user");
      })
      .finally(() => setSaving(false));
  };

  if (loading)
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Paper
      elevation={3}
      style={{
        maxWidth: 600,
        margin: "30px auto",
        padding: "25px",
        borderRadius: "12px",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Edit User
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <TextField
        label="Name"
        name="name"
        fullWidth
        margin="normal"
        value={user.name}
        onChange={handleChange}
      />

      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={user.email}
        onChange={handleChange}
      />

      <TextField
        label="Mobile Number"
        name="mobileNo"
        fullWidth
        margin="normal"
        value={user.mobileNo}
        onChange={handleChange}
      />

      <TextField
        label="Department"
        name="department"
        select
        fullWidth
        margin="normal"
        value={user.department}
        onChange={handleChange}
      >
        {departments.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Role"
        name="role"
        select
        fullWidth
        margin="normal"
        value={user.role}
        onChange={handleChange}
      >
        {roles.map((r) => (
          <MenuItem key={r} value={r}>
            {r}
          </MenuItem>
        ))}
      </TextField>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={() => navigate("/admin/users")}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Paper>
  );
}
