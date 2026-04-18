import React from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { getUser, logout } from "../../utils/auth";

export default function Topbar({ collapsed, setCollapsed, onToggle }) {
  const user = getUser();

  // Toggle function: prefer setCollapsed (react state setter),
  // else accept an onToggle callback prop, else fallback to a no-op.
  const toggleSidebar = (ev) => {
    if (typeof setCollapsed === "function") {
      // call as functional update
      setCollapsed((s) => !s);
      return;
    }
    if (typeof onToggle === "function") {
      onToggle();
      return;
    }
    // Defensive fallback: don't crash — log to console to help debugging
    console.warn(
      "Topbar: toggleSidebar called but no setCollapsed or onToggle function was provided."
    );
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-blue-800 border-b dark:border-gray-700">
      <div className="flex items-center gap-3">
        <IconButton
          size="small"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MenuIcon />
        </IconButton>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Leave Management
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700 dark:text-gray-200 mr-4">
          {user?.name} ({user?.role}
          {user?.department ? ` • ${user?.department}` : ""})
        </div>

        <button
          onClick={logout}
          className="px-3 py-1 bg-red-600 text-white rounded"
          aria-label="logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
