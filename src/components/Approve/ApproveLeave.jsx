// src/components/Approve/ApproveLeave.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "@mui/material";

export default function ApproveLeave({ role, staffId }) {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const loadPending = useCallback(async () => {
    try {
      let res;

      if (role === "HOD") {
        res = await api.get(`/applications/pending/hod/${staffId}`);
      } else if (role === "ACC") {
        // ✅ Accountant sees ONLY WITHOUT_PAY forwarded by PIC
        res = await api.get(`/applications/pending/accountant`);
      } else {
        res = await api.get(`/applications/pending/role/${role.toLowerCase()}`);
      }

      setList(res.data || []);
    } catch (err) {
      console.error("Load pending error:", err);
    }
  }, [role, staffId]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  // ✅ Helper: build download URL
  // ✅ correct public medical file URL
  const fileBaseUrl = "http://localhost:8080/api/files/medical/";
  // change if needed

  return (
    <div className="w-full flex justify-center mt-6 px-6">
      <div className="w-full max-w-7xl">
        <h2 className="text-xl font-semibold mb-4">
          Pending Leave Applications
        </h2>

        {list.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No pending applications
          </div>
        )}

        {list.length > 0 && (
          <div className="border rounded-lg shadow bg-white overflow-hidden">
            {/* ✅ TABLE HEADER */}
            <div className="grid grid-cols-10 bg-gray-100 font-semibold text-sm py-3 px-4 border-b">
              <div>Staff</div>
              <div>Application ID</div>
              <div>Department</div>
              <div>Applied On</div>
              <div>Type</div>
              <div>From</div>
              <div>To</div>
              <div className="text-center">Attachment</div>
              <div className="text-center">Details</div>
            </div>

            {/* ✅ TABLE ROWS */}
            {list.map((item) => (
              <div
                key={item.applicationId}
                className="grid grid-cols-10 items-center py-3 px-4 text-sm border-b hover:bg-gray-50"
              >
                <div className="font-medium">{item.staffName}</div>
                <div>{item.applicationId}</div>
                <div>{item.department}</div>
                <div>{item.appliedOn}</div>
                <div>{item.type}</div>
                <div>{item.fromDate}</div>
                <div>{item.toDate}</div>

                {/* ✅ MC Attachment Icon */}
                <div className="text-center">
                  {item.medicalCertificateFilename ? (
                    <a
                      href={fileBaseUrl + item.medicalCertificateFilename}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                      title="View Attachment"
                    >
                      {/* 📎 Paperclip SVG Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="blue"
                        className="w-6 h-6 cursor-pointer hover:scale-110 transition"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18.364 5.636l-7.778 7.778a4 4 0 105.657 5.657l6.364-6.364a6 6 0 10-8.485-8.485l-8.486 8.485a8 8 0 1011.314 11.314l7.071-7.071"
                        />
                      </svg>
                    </a>
                  ) : (
                    "-"
                  )}
                </div>

                {/* ✅ View Details */}
                <div className="text-center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      navigate(
                        `/${role.toLowerCase()}/approve/${item.applicationId}`,
                        {
                          state: { data: item, role },
                        }
                      )
                    }
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
