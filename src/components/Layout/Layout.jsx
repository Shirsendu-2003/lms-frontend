import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Layout (Light Mode Only)
 * - Sidebar (collapsible)
 * - Topbar
 * - Main content
 * - Footer
 */
export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ===== SIDEBAR ===== */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* ===== MAIN AREA ===== */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* TOPBAR */}
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* PAGE CONTENT */}
        <main className="p-6 flex-1 bg-slate-50">{children}</main>

        {/* FOOTER */}
        <footer className="bg-gray-100 border-t border-gray-200 text-center text-sm text-gray-600 py-3">
          © {new Date().getFullYear()} Leave Management System
        </footer>
      </div>
    </div>
  );
}
