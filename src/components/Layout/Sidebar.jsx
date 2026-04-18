import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { getRole } from "../../utils/auth";

const menuByRole = {
  ADMIN: [
    { label: "Dashboard", to: "/admin", icon: <HomeIcon /> },
    { label: "Users", to: "/admin/users", icon: <PeopleIcon /> },
    { label: "Applications", to: "/admin/leaves", icon: <AssignmentIcon /> },
  ],

  STAFF: [
    { label: "Apply Leave", to: "/staff", icon: <AssignmentIcon /> },
    { label: "Leave History", to: "/staff/history", icon: <DescriptionIcon /> },
    {
      label: "Pending Status",
      to: "/staff/pending-leave-status",
      icon: <AssignmentIcon />,
    },
  ],

  HOD: [
    { label: "Approve Dept", to: "/hod", icon: <AssignmentIcon /> },
    { label: "HOD History", to: "/hod/history", icon: <DescriptionIcon /> },

    { label: "Incharge", to: "/hod/incharge", icon: <PeopleIcon /> },
  ],

  AR: [{ label: "Approve Dept", to: "/hod", icon: <AssignmentIcon /> }],

  OS: [
    { label: "Forward & Track", to: "/os", icon: <AssignmentIcon /> },

    {
      label: "Processed History",
      to: "/os/history",
      icon: <DescriptionIcon />,
    },

    {
      label: "Monthly Statement",
      to: "/os/monthly-leave",
      icon: <DescriptionIcon />,
    },
  ],

  PIC: [
    { label: "Final Approval", to: "/pic", icon: <AssignmentIcon /> },
    { label: "Page In-Charge", to: "/pic/incharge", icon: <PeopleIcon /> },
  ],

  ACC: [
    {
      label: "Payroll Dashboard",
      to: "/accountant",
      icon: <MonetizationOnIcon />,
    },
    {
      label: "Pending Without Pay",
      to: "/accountant/approve",
      icon: <AssignmentIcon />,
    },
  ],

  REGISTRAR: [
    { label: "Records", to: "/registrar", icon: <BarChartIcon /> },
    { label: "Export", to: "/registrar/export", icon: <DescriptionIcon /> },
  ],

  PRINCIPAL: [{ label: "Analytics", to: "/principal", icon: <BarChartIcon /> }],
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const role = getRole();
  const menu = menuByRole[role] || menuByRole["STAFF"];
  const loc = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-sky-200 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } shadow-sm`}
    >
      {/* HEADER */}
      <div className="p-4 flex items-center gap-3 border-b border-sky-100">
        <div className="w-9 h-9 rounded-md overflow-hidden flex items-center justify-center bg-white border border-sky-200">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl3F4wDYUdpq8ip-LyYCMRYX3Wku28pvDyWQ&s"
            alt="LMS Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {!collapsed && (
          <span className="font-semibold text-lg text-slate-800">LMS</span>
        )}
      </div>

      {/* MENU */}
      <nav className="p-3 space-y-1">
        {menu.map((item) => {
          const active = loc.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                active
                  ? "bg-sky-100 text-sky-700 font-medium"
                  : "text-slate-600 hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
