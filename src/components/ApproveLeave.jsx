import { useEffect, useState } from "react";
import api from "../services/api";

export default function ApproveLeave({ role }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get(`/leave/pending/${role}`).then((res) => setRequests(res.data));
  }, [role]);

  const act = async (id, action) => {
    await api.post(`/leave/${id}/${action}`);
    setRequests(requests.filter((r) => r.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Pending Approvals</h2>

      <table className="w-full border mt-3">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">From</th>
            <th className="p-2 border">To</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.staffName}</td>
              <td className="border p-2">{r.leaveType}</td>
              <td className="border p-2">{r.fromDate}</td>
              <td className="border p-2">{r.toDate}</td>
              <td className="border p-2">
                <button
                  onClick={() => act(r.id, "approve")}
                  className="bg-green-600 text-white px-2 py-1 mr-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => act(r.id, "reject")}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
