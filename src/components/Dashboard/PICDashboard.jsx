import React from "react";
import ApproveLeave from "../Approve/ApproveLeave";
import AnimCard from "../UI/AnimCard";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function PICDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimCard
          title="Pending With PIC"
          value="—"
          icon={<VerifiedUserIcon />}
        />
        <AnimCard
          title="Approved Today"
          value="1"
          icon={<VerifiedUserIcon />}
        />
        <AnimCard
          title="Total Approved"
          value="—"
          icon={<VerifiedUserIcon />}
        />
      </div>

      <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4">
        <h4 className="font-semibold mb-3">Final Approvals</h4>
        <ApproveLeave role="PIC" />
      </div>
    </div>
  );
}
