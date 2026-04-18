import { useEffect, useState } from "react";
import api from "../services/api";

export default function LeaveHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/leave/my").then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-4 mt-4">
      <h2 className="text-xl font-bold mb-3">Leave History</h2>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="p-2 border">Type</th>
            <th className="p-2 border">From</th>
            <th className="p-2 border">To</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((l) => (
            <tr key={l.id}>
              <td className="border p-2">{l.leaveType}</td>
              <td className="border p-2">{l.fromDate}</td>
              <td className="border p-2">{l.toDate}</td>
              <td className="border p-2">{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
