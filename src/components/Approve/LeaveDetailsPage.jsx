// src/components/Approve/LeaveDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function LeaveDetailsPage() {
  const { applicationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(state?.data || null);
  const [role] = useState(state?.role || "");
  const [leaveBalance, setLeaveBalance] = useState({});
  const [adjust, setAdjust] = useState({});
  const [comment, setComment] = useState("");
  const [payType, setPayType] = useState("WITH_PAY");
  const [loading, setLoading] = useState(false);

  // dialog controls
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const isAccountant = role === "ACC";
  // HOD reject dialog
  const [hodRejectOpen, setHodRejectOpen] = useState(false);
  const [hodRejectComment, setHodRejectComment] = useState("");
  // PIC reject dialog
  const [picRejectOpen, setPicRejectOpen] = useState(false);
  const [picRejectComment, setPicRejectComment] = useState("");

  const [breakup, setBreakup] = useState([]);

  const isSL = data.type === "SL";

  const safe = (v) => v ?? 0;

  // Fetch application details if page refreshed
  useEffect(() => {
    if (!data) {
      (async () => {
        try {
          const res = await api.get(`/applications/details/${applicationId}`);
          setData(res.data);
        } catch (err) {
          console.error(err);
          alert("Failed to fetch application details");
        }
      })();
    }
  }, [data, applicationId]);

  // Fetch leave balance
  useEffect(() => {
    if (data?.staffId) {
      (async () => {
        try {
          const res = await api.get(`/auth/${data.staffId}/balance`);
          setLeaveBalance(res.data);
        } catch (err) {
          console.error("Balance error:", err);
        }
      })();
    }
  }, [data]);

  useEffect(() => {
    if (data && data.type !== "SL") {
      setPayType("WITH_PAY");
    }
  }, [data]);

  useEffect(() => {
    if (data?.adjustedBreakup) {
      try {
        setBreakup(JSON.parse(data.adjustedBreakup));
      } catch (e) {
        console.error("Invalid breakup JSON", e);
      }
    }
  }, [data]);

  // Perform backend action
  const handleAction = async (actionType) => {
    try {
      setLoading(true);
      await api.post(`/applications/${applicationId}/action`, null, {
        params: { role, action: actionType, comment },
      });
      alert(`Action "${actionType}" successful`);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  // OS local adjustment
  const handleOSAdjust = async () => {
    try {
      const adjustments = Object.entries(adjust)
        .filter(([_, v]) => v > 0)
        .map(([type, days]) => ({ type, days }));

      if (adjustments.length === 0) {
        alert("Please enter at least one adjustment");
        return;
      }

      await api.post(`/applications/os-adjust-bulk/${data.applicationId}`, {
        adjustments,
        comment,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Adjustment failed");
    }
  };

  if (!data) return <div className="p-10 text-center">Loading...</div>;

  const displayedBalance = { ...leaveBalance };

  return (
    <>
      {/* BACK BUTTON — top left corner */}
      <div className="p-4">
        <Button variant="outlined" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      <div className="flex w-full gap-6 p-6 bg-gray-50 min-h-screen">
        {/* LEFT SUMMARY */}
        <div className="w-64 bg-white rounded-2xl shadow p-5 h-fit sticky top-4">
          <h3 className="font-semibold text-lg mb-3">Leave Balance</h3>
          <div className="space-y-1 text-1xl font-bold">
            {["CL", "PL", "ML", "EL"].map((type) => (
              <div key={type}>
                {type} – {safe(displayedBalance[type])}
                {data.adjustedDays &&
                  data.adjustedType === type &&
                  role !== "OS" && (
                    <span className="text-blue-600">
                      {" "}
                      (Adjusted: {data.adjustedDays})
                    </span>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE SECTION */}

        <div className="flex-1 bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-4x1 font-bold mb-3">Application</h2>
          <h2 className="text-2xl font-bold">
            {data.staffName} — {data.staffId}
          </h2>

          {isAccountant && (
            <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded text-sm">
              <b>WITHOUT PAY</b> leave approved by PIC.
              <br />
              This page is <b>view-only</b> for Accounts.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-1xl">
            <div>
              <b>Department: {data.department}</b>
            </div>
            <div>
              <b>Application ID: {data.applicationId}</b>
            </div>
            <div>
              <b>Applied On: {data.appliedOn}</b>
            </div>
            <div>
              <b>Date Of Joining: {data.dateOfJoining}</b>
            </div>
            <div>
              <b>Leave Type: {data.type}</b>
            </div>
            <div>
              <b>Days: {data.days}</b>
            </div>
            <div>
              <b>From: {data.fromDate}</b>
            </div>
            <div>
              <b>To: {data.toDate}</b>
            </div>
            <div>
              <b>Reason: {data.reason}</b>
            </div>
          </div>

          {data.medicalCertificateUrl && (
            <a
              href={`http://localhost:8080/api/files/medical/${data.medicalCertificateFilename}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Download Medical Certificate
            </a>
          )}

          <TextField
            label="Comment / Remarks"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            disabled={isAccountant}
          />

          {role === "OS" && (
            <div>
              <label className="block text-sm font-medium mb-1">Pay Type</label>

              {isSL ? (
                <select
                  className="border rounded-lg p-2 w-full"
                  value={payType}
                  onChange={(e) => setPayType(e.target.value)}
                >
                  <option value="WITH_PAY">With Pay</option>
                  <option value="WITHOUT_PAY">Without Pay</option>
                </select>
              ) : (
                <input
                  type="text"
                  value="With Pay"
                  disabled
                  className="border rounded-lg p-2 w-full bg-gray-100"
                />
              )}
            </div>
          )}

          {role === "PIC" && (
            <div>
              <label className="block text-sm font-medium mb-1">Pay Type</label>
              <input
                type="text"
                value={payType === "WITH_PAY" ? "With Pay" : "Without Pay"}
                disabled
                className="border rounded-lg p-2 w-full bg-gray-100"
              />
            </div>
          )}

          {/* HOD Buttons */}
          {role === "HOD" && (
            <div className="flex gap-3 mt-4">
              <Button
                variant="contained"
                color="success"
                fullWidth
                disabled={loading}
                onClick={() => handleAction("APPROVED")}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setHodRejectComment("");
                  setHodRejectOpen(true);
                }}
              >
                Reject
              </Button>
            </div>
          )}
          {/* 🔴 HOD Reject Dialog */}
          <Dialog open={hodRejectOpen} onClose={() => setHodRejectOpen(false)}>
            <DialogTitle>Reject Leave Application</DialogTitle>

            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                Please provide a reason for rejecting this leave application.
                This comment will be visible to the applicant and next
                authorities.
              </DialogContentText>

              <TextField
                label="Rejection Reason"
                value={hodRejectComment}
                onChange={(e) => setHodRejectComment(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                required
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setHodRejectOpen(false)}>Cancel</Button>

              <Button
                color="error"
                variant="contained"
                disabled={!hodRejectComment.trim() || loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await api.post(
                      `/applications/${applicationId}/action`,
                      null,
                      {
                        params: {
                          role,
                          action: "REJECTED",
                          comment: hodRejectComment,
                        },
                      }
                    );

                    alert("Leave rejected successfully");
                    navigate(-1);
                  } catch (err) {
                    console.error(err);
                    alert(err.response?.data?.message || "Rejection failed");
                  } finally {
                    setLoading(false);
                    setHodRejectOpen(false);
                  }
                }}
              >
                Confirm Reject
              </Button>
            </DialogActions>
          </Dialog>

          {/* 🔴 PIC Reject Dialog */}
          <Dialog open={picRejectOpen} onClose={() => setPicRejectOpen(false)}>
            <DialogTitle>Reject Leave Application</DialogTitle>

            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                Please provide a reason for rejecting this leave application.
                This comment will be visible to the applicant and all
                authorities.
              </DialogContentText>

              <TextField
                label="Rejection Reason"
                value={picRejectComment}
                onChange={(e) => setPicRejectComment(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                required
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setPicRejectOpen(false)}>Cancel</Button>

              <Button
                color="error"
                variant="contained"
                disabled={!picRejectComment.trim() || loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await api.post(
                      `/applications/${applicationId}/action`,
                      null,
                      {
                        params: {
                          role,
                          action: "REJECTED",
                          comment: picRejectComment,
                        },
                      }
                    );

                    alert("Leave rejected successfully");
                    navigate(-1);
                  } catch (err) {
                    console.error(err);
                    alert(err.response?.data?.message || "Rejection failed");
                  } finally {
                    setLoading(false);
                    setPicRejectOpen(false);
                  }
                }}
              >
                Confirm Reject
              </Button>
            </DialogActions>
          </Dialog>

          {/* OS BUTTON → Opens dialog */}
          {role === "OS" && isSL && (
            <div className="mt-4">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setPendingAction("FORWARD_PIC");
                  setDialogOpen(true);
                }}
              >
                Save Adjustment & Forward to PIC
              </Button>
            </div>
          )}
          {role === "OS" && !isSL && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              onClick={() => handleAction("FORWARD_PIC")}
            >
              Forward to PIC
            </Button>
          )}

          {/* PIC BUTTONS → Opens dialog */}
          {role === "PIC" && (
            <div className="flex gap-3 mt-4">
              <Button
                variant="contained"
                color="success"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setPendingAction(
                    payType === "WITHOUT_PAY" ? "WITHOUT_PAY" : "APPROVED"
                  );
                  setDialogOpen(true);
                }}
              >
                Approve
              </Button>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setPicRejectComment("");
                  setPicRejectOpen(true);
                }}
              >
                Reject
              </Button>

              <Button
                variant="contained"
                color="warning"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setPendingAction("WITHOUT_PAY");
                  setDialogOpen(true);
                }}
              >
                Without Pay
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT ADJUSTMENT PANEL */}
        {/* RIGHT ADJUSTMENT PANEL  — HOD cannot see this */}

        {/* ✅ RIGHT PANEL (Routine PDFs for HOD / Adjustment for OS & PIC) */}
        <div className="w-64 bg-white rounded-2xl shadow p-5 h-fit sticky top-4">
          {/* ✅ HOD — Only sees routine PDFs */}
          {role === "HOD" && (
            <>
              <h3 className="font-semibold text-lg mb-3">Class Routine PDFs</h3>

              <div className="space-y-3 text-blue-600 underline text-sm">
                <a
                  href="/routine/odd-semester.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 Odd Semester Routine
                </a>

                <a
                  href="/routine/even-semester.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 Even Semester Routine
                </a>

                <a
                  href="/routine/exam-routine.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  🧾 Exam Routine
                </a>
              </div>
            </>
          )}

          {/* ✅ OS & PIC Adjustment Panel */}
          {role !== "HOD" && (
            <>
              <h2 className="font-semibold text-lg mb-3">
                {" "}
                OS leave Adjustments
              </h2>
              <h3 className="font-semibold text-lg mb-2">Leave Adjustment</h3>

              {role === "OS" && (
                <div className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded mb-3">
                  Adjustments are recorded; leave balance updates after PIC
                  approval.
                </div>
              )}

              {/* PIC sees OS adjustment + OS comment */}
              {role === "PIC" && (data.adjustedDays || data.osComment) && (
                <div className="bg-blue-50 text-sm border-l-4 border-blue-600 p-2 rounded mb-3">
                  {breakup.length > 0 && (
                    <div className="space-y-1">
                      <p className="font-semibold text-green-700">
                        ✅ OS Adjustment
                      </p>
                      {breakup.map((b, i) => (
                        <p key={i}>
                          {b.type} → <b>{b.days}</b> day(s)
                        </p>
                      ))}
                    </div>
                  )}

                  {data.osComment && (
                    <p className="mt-1">
                      💬 <b>OS Comment:</b> {data.osComment}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3 text-1xl font-bold">
                {["CL", "PL", "ML", "EL"].map((type) => (
                  <div key={type} className="flex justify-between items-center">
                    <span>{type}</span>
                    <input
                      type="number"
                      min="0"
                      className={`w-16 border rounded p-1 text-center ${
                        role === "OS" && isSL
                          ? ""
                          : "bg-gray-100 cursor-not-allowed"
                      }`}
                      value={
                        role === "PIC"
                          ? breakup.find((b) => b.type === type)?.days ?? 0
                          : adjust[type] ?? 0
                      }
                      onChange={(e) =>
                        role === "OS" &&
                        isSL &&
                        setAdjust({ ...adjust, [type]: Number(e.target.value) })
                      }
                      disabled={role !== "OS" || !isSL}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ✅ MUI Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingAction === "FORWARD_PIC" &&
              "Are you sure you want to save adjustment and forward to PIC?"}
            {pendingAction === "APPROVED" &&
              "Are you sure you want to APPROVE this leave?"}
            {pendingAction === "REJECTED" &&
              "Are you sure you want to REJECT this leave?"}
            {pendingAction === "WITHOUT_PAY" &&
              "Are you sure you want to mark this leave as WITHOUT PAY?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>

          <Button
            color="primary"
            onClick={async () => {
              setDialogOpen(false);
              setLoading(true);

              if (pendingAction === "FORWARD_PIC") {
                await handleOSAdjust();
                await handleAction("FORWARD_PIC");
              } else {
                await handleAction(pendingAction);
              }

              setLoading(false);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
