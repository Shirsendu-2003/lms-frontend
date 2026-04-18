import React, { useEffect, useState } from "react";
import ApplyLeave from "../Apply/ApplyLeave";
import LeaveHistory from "../Leave/LeaveHistory";
import AnimCard from "../UI/AnimCard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { getUser } from "../../utils/auth";
import api from "../../services/api";

export default function StaffDashboard() {
  const [stats, setStats] = useState({ CL: 0, PL: 0, ML: 0, EL: 0 });
  const user = getUser();

  useEffect(() => {
    if (!user?.staffId) {
      console.warn("⚠ staffId missing in user object");
      return;
    }

    api
      .get(`/auth/${user.staffId}/balance`)
      .then((res) => {
        const b = res.data || {};
        setStats({
          CL: b.CL ?? 0,
          PL: b.PL ?? 0,
          ML: b.ML ?? 0,
          EL: b.EL ?? 0,
        });
      })
      .catch((err) => console.error("Dashboard load error:", err));
  }, [user]);

  return (
    <div className="space-y-6">
      {/* LEAVE BALANCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
          <AnimCard
            title="Available CL"
            value={stats.CL}
            icon={<EventAvailableIcon className="text-sky-600" />}
          />
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
          <AnimCard
            title="Available PL"
            value={stats.PL}
            icon={<EventAvailableIcon className="text-sky-600" />}
          />
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
          <AnimCard
            title="Available ML"
            value={stats.ML}
            icon={<EventAvailableIcon className="text-sky-600" />}
          />
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
          <AnimCard
            title="Available EL"
            value={stats.EL}
            icon={<EventAvailableIcon className="text-sky-600" />}
          />
        </div>
      </div>

      {/* APPLY + HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* APPLY LEAVE */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Apply for Leave</h4>
          <ApplyLeave user={user} />
        </div>

        {/* LEAVE HISTORY */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 h-[360px] overflow-y-auto">
          <h4 className="font-semibold text-gray-800 mb-3">My Leave History</h4>
          <LeaveHistory />
        </div>
      </div>
    </div>
  );
}
