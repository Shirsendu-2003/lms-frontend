import React from "react";
import ApproveLeave from "../Approve/ApproveLeave";
import AnimCard from "../UI/AnimCard";
import ShieldIcon from "@mui/icons-material/Shield";

export default function OSDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimCard title="Pending With OS" value="—" icon={<ShieldIcon />} />
        <AnimCard title="Forwarded to PIC" value="—" icon={<ShieldIcon />} />
        <AnimCard title="Records Today" value="3" icon={<ShieldIcon />} />
      </div>

      <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4">
        <h4 className="font-semibold mb-3">Pending Approvals</h4>
        <ApproveLeave role="OS" />
      </div>
    </div>
  );
}
