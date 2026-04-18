import React, { useEffect, useState } from "react";
import ApproveLeave from "../Approve/ApproveLeave";
import AnimCard from "../UI/AnimCard";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import api from "../../services/api";
import { getUser } from "../../utils/auth";

export default function HODDashboard() {
  const user = getUser();
  const staffId = user?.staffId;
  const department = user?.department || "N/A";

  const [pendingCount, setPendingCount] = useState(0);

  // ✅ Fetch pending leave count for this HOD
  useEffect(() => {
    if (!staffId) return;

    api
      .get(`/applications/pending/hod/${staffId}`)
      .then((res) => setPendingCount(res.data.length))
      .catch((err) => console.error("HOD dashboard error:", err));
  }, [staffId]);

  return (
    <div className="space-y-6">
      {/* ✅ Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimCard
          title="Pending With HOD"
          value={pendingCount}
          icon={<SupervisorAccountIcon />}
        />

        <AnimCard
          title={`${department} Dept CL Balance`}
          value="—"
          icon={<SupervisorAccountIcon />}
        />

        <AnimCard
          title="Notifications"
          value="2"
          icon={<SupervisorAccountIcon />}
        />
      </div>

      {/* ✅ Pending Leave Requests */}
      <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4">
        <h4 className="font-semibold mb-3">
          Pending Approvals — {department} Department
        </h4>

        {/* ✅ Pass staffId instead of role */}
        <ApproveLeave role="HOD" staffId={staffId} />
      </div>
    </div>
  );
}
