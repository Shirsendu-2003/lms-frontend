import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { login } from "../../services/authService";
import { saveAuth } from "../../utils/auth";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error popup
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const autoHideRef = useRef(null);

  const nav = useNavigate();

  const roleRouteMap = {
    ADMIN: "/admin",
    STAFF: "/staff",
    OFFICE_STAFF: "/staff",
    HOD: "/hod",
    AR: "/hod",
    OS: "/os",
    PIC: "/pic",
    ACC: "/accountant",
    ACCOUNTANT: "/accountant",
  };

  useEffect(() => {
    return () => {
      if (autoHideRef.current) clearTimeout(autoHideRef.current);
    };
  }, []);

  const showErrorPopup = (msg, duration = 3000) => {
    setErrorMsg(msg);
    setShowError(true);

    if (autoHideRef.current) clearTimeout(autoHideRef.current);
    autoHideRef.current = setTimeout(() => {
      setShowError(false);
    }, duration);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!identifier || !password || !role) {
      showErrorPopup("Please enter all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await login({
        email: identifier,
        staffId: identifier,
        password,
        role,
      });

      const { token, user } = res.data;

      if (user.role !== role) {
        showErrorPopup(`Role mismatch! Your role is ${user.role}`);
        return;
      }

      saveAuth(token, user);
      nav(roleRouteMap[user.role] || "/staff");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 403) {
        showErrorPopup("Your account is blocked by admin");
      } else if (typeof data === "string") {
        showErrorPopup(data);
      } else if (data?.message) {
        showErrorPopup(data.message);
      } else {
        showErrorPopup("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100">
      {/* Error Popup */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl shadow-md flex gap-3">
              <span>{errorMsg}</span>
              <button
                onClick={() => setShowError(false)}
                className="text-sm underline"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={submit}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-slate-200"
        >
          <h2 className="text-2xl text-center font-semibold text-slate-800 mb-6">
            Leave Management System
          </h2>

          <TextField
            select
            fullWidth
            label="Select Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="STAFF">Staff</MenuItem>
            <MenuItem value="HOD">HOD</MenuItem>
            <MenuItem value="AR">Assistant Registrar</MenuItem>
            <MenuItem value="OS">Office Superintendent</MenuItem>
            <MenuItem value="PIC">PIC</MenuItem>
            <MenuItem value="ACC">Accountant</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Staff ID or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            margin="normal"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <span
                  className="cursor-pointer text-slate-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🙈"}
                </span>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <div className="text-right mt-2">
            <span
              className="text-sm text-blue-600 cursor-pointer hover:underline"
              onClick={() => nav("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                color: "white",
                borderRadius: "14px",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg,#1d4ed8,#4338ca)",
                },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
