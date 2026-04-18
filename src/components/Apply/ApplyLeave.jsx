// src/components/Leave/ApplyLeave.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { Button, TextField, MenuItem, Typography } from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function ApplyLeave({ user, onSuccess }) {
  const [type, setType] = useState("CL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [medicalFile, setMedicalFile] = useState(null);

  const [leaveBalance, setLeaveBalance] = useState({});
  const [joiningBlock, setJoiningBlock] = useState(false);
  const [joiningDaysLeft, setJoiningDaysLeft] = useState(0);
  const [weekBlock, setWeekBlock] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  const [lastLeaveDate, setLastLeaveDate] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showSLPopup, setShowSLPopup] = useState(false);

  // --- Helper: calculate 6-month joining block ---
  const getJoiningBlock = (dateOfJoining) => {
    if (!dateOfJoining) return { block: false, diffDays: 0 };

    const [year, month, day] = dateOfJoining.split("-").map(Number);
    const doj = new Date(year, month - 1, day);

    const sixMonthsLater = new Date(doj);
    sixMonthsLater.setMonth(doj.getMonth() + 6);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const block = today < sixMonthsLater;
    const diffDays = block
      ? Math.ceil((sixMonthsLater - today) / (1000 * 60 * 60 * 24))
      : 0;

    return { block, diffDays };
  };

  // --- 6 months joining block check ---
  useEffect(() => {
    if (!user?.doj && !user?.dateOfJoining) return;
    const dojStr = user.doj || user.dateOfJoining;
    const { block, diffDays } = getJoiningBlock(dojStr);
    setJoiningBlock(block);
    setJoiningDaysLeft(diffDays);
  }, [user]);

  // --- 1-week leave rule & last leave date ---
  // --- 1-week leave rule & last leave date ---
  useEffect(() => {
    if (!user?.staffId) return;

    const fetchLastLeave = async () => {
      try {
        const res = await api.get(`/applications/last/${user.staffId}`);
        const lastData = res.data;

        const lastDateStr = lastData?.lastAppliedDate || null;
        setLastLeaveDate(lastDateStr);

        if (lastDateStr) {
          const lastDate = new Date(lastDateStr);
          lastDate.setDate(lastDate.getDate() + 7); // Next leave allowed after 7 days
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          setWeekBlock(today < lastDate);
          setDaysLeft(
            today < lastDate
              ? Math.ceil((lastDate - today) / (1000 * 60 * 60 * 24))
              : 0
          );
        } else {
          setWeekBlock(false);
          setDaysLeft(0);
        }
      } catch (err) {
        console.error("Failed to fetch last leave:", err);
        setWeekBlock(false);
        setDaysLeft(0);
        setLastLeaveDate(null);
      }
    };

    fetchLastLeave();
  }, [user]);

  // --- Load leave balance ---
  useEffect(() => {
    if (!user?.staffId) return;

    const fetchBalance = async () => {
      try {
        const res = await api.get(`/auth/${user.staffId}/balance`);
        setLeaveBalance(res.data || {});
      } catch (err) {
        console.error("Failed to load balance:", err);
      }
    };

    fetchBalance();
  }, [user]);

  // --- Calculate leave days ---
  useEffect(() => {
    if (fromDate && toDate) {
      const diff =
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24) + 1;
      setDays(diff > 0 ? diff : 0);
    } else setDays(0);
  }, [fromDate, toDate]);

  // --- Validation flags ---
  const clExceedsLimit = type === "CL" && days > 3;
  const insufficientBalance = (leaveBalance[type] ?? 0) < days;
  const allZero = ["CL", "PL", "ML", "EL"].every(
    (l) => (leaveBalance[l] ?? 0) === 0
  );
  const showSL = insufficientBalance || clExceedsLimit || allZero;

  useEffect(() => {
    if (days <= 0) return;

    if (showSL && type !== "SL") {
      setType("SL");
      setShowSLPopup(true);
    }
  }, [days, showSL, type]);

  const isPastLeave = useCallback(() => {
    if (!fromDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today > new Date(fromDate);
  }, [fromDate]);

  // --- Collect validation errors ---
  useEffect(() => {
    const errs = [];
    if (joiningBlock)
      errs.push(
        `❌ Leave allowed only after 6 months. Remaining ${joiningDaysLeft} day(s).`
      );
    if (weekBlock)
      errs.push(
        `❌ Only 1 leave per week allowed. Next leave in ${daysLeft} day(s).`
      );
    if (days <= 0) errs.push("❌ Invalid date range.");
    if (clExceedsLimit) {
      errs.push(
        "ℹ️ Casual Leave is limited to 3 days. Please apply another leave type (PL / EL)."
      );
    }
    if (insufficientBalance && type !== "SL") {
      const available = leaveBalance[type] ?? 0;
      errs.push(
        `❌ Insufficient ${type} balance. Required: ${days}, Available: ${available}`
      );
    }
    // SL → always needs document
    if (type === "SL" && !medicalFile) {
      errs.push("❌ Supporting document is mandatory for Special Leave.");
    }

    // ML → document only if leave already taken
    if (type === "ML" && isPastLeave() && !medicalFile) {
      errs.push("❌ Medical document required since leave is already taken.");
    }

    if (allZero && type !== "SL")
      errs.push("❌ All balances are 0. Only Special Leave allowed.");
    setErrors(errs);
  }, [
    joiningBlock,
    weekBlock,
    days,
    clExceedsLimit,
    insufficientBalance,
    medicalFile,
    allZero,
    type,
    joiningDaysLeft,
    daysLeft,
    leaveBalance,
    isPastLeave,
  ]);

  // --- Submit leave ---
  const submit = async (e) => {
    e.preventDefault();
    if (errors.length > 0) return;

    const formData = new FormData();
    formData.append("staffId", user.staffId);
    formData.append("staffName", user.name);
    formData.append("department", user.department);
    formData.append("doj", user.doj || user.dateOfJoining);
    formData.append("type", type);
    formData.append("fromDate", fromDate);
    formData.append("toDate", toDate);
    formData.append("reason", reason);
    if ((type === "ML" || type === "SL") && medicalFile) {
      formData.append("medicalCertificate", medicalFile);
    }

    setLoading(true);
    try {
      const res = await api.post("/applications/apply", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess?.(res.data);

      // Reset form
      setType("CL");
      setFromDate("");
      setToDate("");
      setReason("");
      setMedicalFile(null);
      setErrors([]);
    } catch (err) {
      console.error("Leave apply error:", err);
      setErrors([err.response?.data?.message || "❌ Submit failed"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 bg-white border border-gray-200 rounded-xl p-5 max-w-xl"
    >
      {/* LAST LEAVE INFO */}
      {lastLeaveDate && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md">
          <Typography variant="body2">
            Last leave applied till: <b>{lastLeaveDate}</b>
          </Typography>
          {weekBlock && (
            <Typography variant="caption">
              Next leave allowed in <b>{daysLeft}</b> day(s)
            </Typography>
          )}
        </div>
      )}

      {/* ERRORS */}
      {errors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-md space-y-1">
          {errors.map((err, idx) => (
            <Typography key={idx} variant="caption">
              {err}
            </Typography>
          ))}
        </div>
      )}

      <Dialog
        open={showSLPopup}
        onClose={() => setShowSLPopup(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Special Leave Selected</DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2">
            Your selected leave exceeds the available balance.
            <br />
            <b>Special Leave (SL)</b> has been selected automatically.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setShowSLPopup(false)}
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* LEAVE TYPE */}
      <TextField
        select
        label="Leave Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        fullWidth
        size="small"
      >
        <MenuItem value="CL" disabled={allZero}>
          Casual Leave (CL)
        </MenuItem>
        <MenuItem value="PL" disabled={allZero}>
          Privilege Leave (PL)
        </MenuItem>
        <MenuItem value="ML" disabled={allZero}>
          Medical Leave (ML)
        </MenuItem>
        <MenuItem value="EL" disabled={allZero}>
          Earned Leave (EL)
        </MenuItem>
        {allZero && <MenuItem value="SL">Special Leave</MenuItem>}
        {/* ✅ SHOW SL WHEN REQUIRED */}
        {showSL && <MenuItem value="SL">Special Leave (SL)</MenuItem>}
      </TextField>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          fullWidth
          size="small"
        />
      </div>

      <TextField
        label="Total Leave Days"
        value={days}
        InputProps={{ readOnly: true }}
        fullWidth
        size="small"
      />

      {/* REASON */}
      <TextField
        label="Reason"
        multiline
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        fullWidth
        size="small"
      />

      {/* DOCUMENT UPLOAD */}
      {(type === "SL" || (type === "ML" && isPastLeave())) && (
        <div className="border border-gray-200 rounded-md p-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Supporting Document
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setMedicalFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
      )}

      {/* SUBMIT */}
      <Button
        type="submit"
        variant="contained"
        disabled={loading || errors.length > 0}
        sx={{
          backgroundColor: "#2563eb",
          ":hover": { backgroundColor: "#1d4ed8" },
          textTransform: "none",
          fontWeight: 500,
        }}
        fullWidth
      >
        {loading ? "Applying..." : "Apply Leave"}
      </Button>
    </form>
  );
}
