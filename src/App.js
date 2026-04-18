// src/App.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Login from "./components/Auth/Login";
import Layout from "./components/Layout/Layout";

import AdminDashboard from "./components/Dashboard/AdminDashboard";
import StaffDashboard from "./components/Dashboard/StaffDashboard";
import HODDashboard from "./components/Dashboard/HODDashboard";
import OSDashboard from "./components/Dashboard/OSDashboard";
import PICDashboard from "./components/Dashboard/PICDashboard";
import AccountantDashboard from "./components/Dashboard/AccountantDashboard";
import CreateUser from "./pages/Admin/CreateUser";
import AdminUsers from "./pages/Admin/AdminUsers";
import ApplicationsPage from "./pages/Admin/ApplicationsPage";

import { getRole } from "./utils/auth";
import LeaveHistory from "./components/Leave/LeaveHistory";

import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import PageIncharge from "./components/PIC/PageIncharge";
import PendingLeaveStatus from "./components/Leave/PendingLeaveStatus";
import ApproveLeave from "./components/Approve/ApproveLeave";
import LeaveDetailsPage from "./components/Approve/LeaveDetailsPage";
import EditUser from "./pages/Admin/EditUser";
import MonthlyLeaveStatementOS from "./pages/OS/MonthlyLeaveStatement";
import Home from "./components/Layout/Home";
import HODIncharge from "./pages/hod/HODIncharge";
import OSHistory from "./pages/OS/OSHistory";
import HODHistory from "./pages/hod/HODHistory";

export default function App() {
  const [mode, setMode] = useState("light");
  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        components: {
          MuiButton: { defaultProps: { disableElevation: true } },
        },
      }),
    [mode]
  );

  // ✅ Role-based protect wrapper
  const Protected = ({ children, roles }) => {
    const r = getRole();
    if (!r) return <Navigate to="/login" replace />;
    if (!roles.includes(r)) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ✅ Layout for logged-in area */}
          <Route
            path="/*"
            element={
              <Layout mode={mode} toggleMode={toggleMode}>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="/dashboard"
                    element={<Navigate to="/dashboard/redirect" replace />}
                  />

                  {/* ✅ Auto redirect based on role */}
                  <Route
                    path="/dashboard/redirect"
                    element={<DashboardRedirect />}
                  />

                  {/* ✅ Role-based dashboards */}
                  <Route
                    path="/admin/*"
                    element={
                      <Protected roles={["ADMIN"]}>
                        <Routes>
                          <Route path="/" element={<AdminDashboard />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="leaves" element={<ApplicationsPage />} />
                          <Route path="create-user" element={<CreateUser />} />
                          <Route path="users/edit/:id" element={<EditUser />} />

                          {/* Add more admin pages here */}
                        </Routes>
                      </Protected>
                    }
                  />

                  <Route
                    path="/staff/*"
                    element={
                      <Protected roles={["STAFF", "OFFICE_STAFF"]}>
                        <Routes>
                          <Route path="/" element={<StaffDashboard />} />
                          <Route path="history" element={<LeaveHistory />} />
                          <Route
                            path="pending-leave-status"
                            element={<PendingLeaveStatus />}
                          />

                          {/* Add more admin pages here */}
                        </Routes>
                      </Protected>
                    }
                  />

                  {/* ✅ HOD / AR Dashboard with history page */}
                  <Route
                    path="/hod/*"
                    element={
                      <Protected roles={["HOD", "AR"]}>
                        <Routes>
                          <Route path="/" element={<HODDashboard />} />
                          <Route
                            path="approve/:applicationId"
                            element={<LeaveDetailsPage />}
                          />
                          <Route path="history" element={<HODHistory />} />

                          <Route path="incharge" element={<HODIncharge />} />
                        </Routes>
                      </Protected>
                    }
                  />

                  <Route
                    path="/os/*"
                    element={
                      <Protected roles={["OS"]}>
                        <Routes>
                          <Route path="/" element={<OSDashboard />} />

                          <Route path="history" element={<OSHistory />} />
                          <Route
                            path="approve"
                            element={
                              <ApproveLeave role="OS" staffId="STAFF001" />
                            }
                          />
                          <Route
                            path="approve/:applicationId"
                            element={<LeaveDetailsPage />}
                          />
                          <Route
                            path="monthly-leave"
                            element={<MonthlyLeaveStatementOS />}
                          />
                        </Routes>
                      </Protected>
                    }
                  />

                  <Route
                    path="/pic/*"
                    element={
                      <Protected roles={["PIC"]}>
                        <Routes>
                          <Route path="/" element={<PICDashboard />} />
                          <Route
                            path="approve"
                            element={
                              <ApproveLeave role="PIC" staffId="STAFF001" />
                            }
                          />
                          <Route
                            path="approve/:applicationId"
                            element={<LeaveDetailsPage />}
                          />
                          <Route path="incharge" element={<PageIncharge />} />{" "}
                          {/* ✅ Correct path */}
                        </Routes>
                      </Protected>
                    }
                  />

                  <Route
                    path="/accountant/*"
                    element={
                      <Protected roles={["ACC", "ACCOUNTANT"]}>
                        <Routes>
                          <Route path="/" element={<AccountantDashboard />} />

                          <Route
                            path="approve"
                            element={
                              <ApproveLeave role="ACC" staffId="STAFF001" />
                            }
                          />

                          <Route
                            path="approve/:applicationId"
                            element={<LeaveDetailsPage />}
                          />
                        </Routes>
                      </Protected>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

/* ✅ Dashboard Redirect */
function DashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = getRole();
    if (!role) return navigate("/login");

    const map = {
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

    navigate(map[role] || "/staff");
  }, [navigate]);

  return null;
}
