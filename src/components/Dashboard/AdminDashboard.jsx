import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import AnimCard from "../UI/AnimCard";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/users").then((r) => setUsers(r.data || []));
    api.get("/admin/leaves").then((r) => setApps(r.data || []));
  }, []);

  return (
    <div className="space-y-8 bg-slate-50 p-6 rounded-xl">
      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <AnimCard
          title="Total Users"
          value={users.length}
          icon={<PersonIcon />}
        />
        <AnimCard
          title="Total Applications"
          value={apps.length}
          icon={<ArticleIcon />}
        />
        <AnimCard
          title="Pending Approvals"
          value={apps.filter((a) => a.overallStatus === "PENDING").length}
          icon={<PendingActionsIcon />}
        />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4">
          <h4 className="font-semibold text-slate-800 mb-3">
            Recent Applications
          </h4>

          <div className="space-y-3 max-h-72 overflow-auto">
            {apps
              .slice()
              .reverse()
              .slice(0, 8)
              .map((a) => (
                <div
                  key={a.applicationId}
                  className="p-3 border border-slate-200 rounded-xl flex justify-between items-center hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="font-medium text-slate-800">
                      {a.staffName || a.staffId}
                    </div>
                    <div className="text-sm text-slate-500">
                      {a.type} • {a.fromDate} → {a.toDate}
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      a.overallStatus === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : a.overallStatus === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.overallStatus}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h4 className="font-semibold text-slate-800 mb-3">Quick Actions</h4>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/admin/create-user")}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Create User
            </button>

            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
              Export CSV
            </button>

            <button className="px-4 py-2 rounded-xl bg-slate-600 text-white font-medium hover:bg-slate-700 transition">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
