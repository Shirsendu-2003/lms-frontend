// src/components/Auth/ResetPassword.jsx
import React, { useEffect, useState, useRef } from "react";
import { resetPassword, sendResetOtp } from "../../services/authService";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const emailParam = params.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "info",
    msg: "",
  });

  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    // initialize resend timer to 0 (user can request immediately if needed)
    setResendTimer(0);
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = (secs = 60) => {
    setResendTimer(secs);
    timerRef.current = setInterval(() => {
      setResendTimer((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!email) {
      setSnack({
        open: true,
        severity: "error",
        msg: "Please enter your email first.",
      });
      return;
    }
    try {
      setLoading(true);
      await sendResetOtp(email);
      setSnack({
        open: true,
        severity: "success",
        msg: "OTP resent — check your email.",
      });
      startTimer(60);
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        msg: err?.response?.data?.message || "Resend failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const strongPassword = (p) => p.length >= 6;

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword || !confirm) {
      setSnack({ open: true, severity: "error", msg: "Fill all fields." });
      return;
    }
    if (!strongPassword(newPassword)) {
      setSnack({
        open: true,
        severity: "error",
        msg: "Password must be at least 6 characters.",
      });
      return;
    }
    if (newPassword !== confirm) {
      setSnack({
        open: true,
        severity: "error",
        msg: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword });
      setSnack({
        open: true,
        severity: "success",
        msg: "Password reset successful. Redirecting to login...",
      });
      setTimeout(() => nav("/login"), 1300);
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        msg: err?.response?.data?.message || "Reset failed",
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
            Reset Password
          </h2>

          <form onSubmit={submit} noValidate>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              disabled={!!emailParam}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex gap-3">
              <TextField
                label="OTP"
                fullWidth
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="mt-4 ml-2">
                <Button
                  variant="outlined"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                >
                  {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend OTP"}
                </Button>
              </div>
            </div>

            <TextField
              label="New Password"
              fullWidth
              margin="normal"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="At least 6 characters"
            />

            <TextField
              label="Confirm New Password"
              fullWidth
              margin="normal"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => nav("/login")}
              >
                Cancel
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
