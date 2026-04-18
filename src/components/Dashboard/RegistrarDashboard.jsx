import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AnimCard from "../UI/AnimCard";
import DescriptionIcon from "@mui/icons-material/Description";

export default function RegistrarDashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("/admin/leaves").then((r) => setRecords(r.data || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimCard
          title="Total Records"
          value={records.length}
          icon={<DescriptionIcon />}
        />
        <AnimCard
          title="Pending Exports"
          value="—"
          icon={<DescriptionIcon />}
        />
        <AnimCard title="Issues" value="—" icon={<DescriptionIcon />} />
      </div>

      <div className="bg-white border border-sky-200 rounded-xl shadow-sm p-4">
        <h4 className="font-semibold mb-3">Export Records</h4>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Export CSV")}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            Export CSV
          </button>
          <button
            onClick={() => alert("Export PDF")}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
