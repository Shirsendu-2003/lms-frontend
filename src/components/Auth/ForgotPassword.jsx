// src/components/Auth/ForgotPassword.jsx
import React, { useState } from "react";
import { sendResetOtp } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "info",
    msg: "",
  });
  const nav = useNavigate();

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setSnack({ open: true, severity: "error", msg: "Enter a valid email." });
      return;
    }
    setLoading(true);
    try {
      await sendResetOtp(email);
      setSnack({
        open: true,
        severity: "success",
        msg: "OTP sent. Check your email.",
      });
      setTimeout(
        () => nav("/reset-password?email=" + encodeURIComponent(email)),
        1000
      );
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        severity: "error",
        msg: err?.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-2xl mb-4 text-center font-semibold">
            Forgot Password
          </h2>

          <form onSubmit={submit} noValidate>
            <TextField
              label="Registered Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={!email ? "We will send an OTP to this email." : ""}
            />

            <div className="flex gap-3 mt-4">
              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => nav("/login")}
              >
                Back
              </Button>
            </div>
          </form>
        </motion.div>
      </div>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
