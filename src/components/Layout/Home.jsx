import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-200 text-slate-700 overflow-x-hidden">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 w-full z-50 bg-slate-100/90 backdrop-blur border-b border-slate-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2 font-extrabold text-xl text-indigo-600">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              className="w-8"
              alt="LMS"
            />
            LMS
          </div>

          <nav className="hidden md:flex items-center gap-8 font-semibold">
            {["home", "features", "about", "contact"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="hover:text-indigo-600 transition"
              >
                {id.toUpperCase()}
              </a>
            ))}

            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-500 text-white px-6 py-2 rounded-full
                         shadow hover:bg-indigo-600 transition"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      {/* ================= HERO ================= */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center pt-26
             relative overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center mt-[75px]"
          style={{
            backgroundImage: `
      
        url("https://uffizio-iotech.com/wp-content/uploads/2022/06/leave-management.jpg")
      `,
          }}
        />

        {/* Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-4xl md:text-6xl font-black text-orange-500 mb-6">
            Leave Management System
          </h1>

          <p className="max-w-3x3 mx-auto text-lg md:text-xl text-neutral-900 mb-15">
            A simple, transparent and role-based leave workflow for educational
            institutions.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-500 text-white px-10 py-4 rounded-full
                 font-semibold shadow-md hover:scale-105 transition"
          >
            Get Started →
          </button>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-28 bg-slate-100">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-extrabold text-center mb-16"
        >
          Core Features
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          {[
            ["Digital Leave", "Apply leave without paperwork"],
            ["Approval Flow", "Staff → HOD → OS → PIC"],
            ["Live Tracking", "Real-time leave status"],
            ["Auto Balance", "Leave deduction handled automatically"],
          ].map(([title, desc], i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.15 }}
              className="bg-slate-50 rounded-2xl p-8 shadow
                         hover:-translate-y-2 transition"
            >
              <h3 className="text-xl font-bold text-indigo-600 mb-3">
                {title}
              </h3>
              <p className="text-slate-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-28 bg-indigo-100/60">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto text-center px-6"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            About LMS
          </h2>
          <p className="text-lg text-slate-600">
            LMS is a secure, role-based leave management system designed for
            colleges and institutions to simplify leave approvals and improve
            transparency.
          </p>
        </motion.div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-24 bg-slate-100 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-extrabold mb-8"
        >
          Contact Us
        </motion.h2>

        <p className="text-slate-600">📧 support@lms.edu</p>
        <p className="text-slate-600">📞 +91 98765 43210</p>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-200 border-t border-slate-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 px-6 py-14 text-slate-600">
          <div>
            <h3 className="font-bold text-indigo-600 text-lg">LMS</h3>
            <p className="mt-2">Modern Leave Management System</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Login</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login">Staff</Link>
              </li>
              <li>
                <Link to="/hod/login">HOD</Link>
              </li>
              <li>
                <Link to="/admin/login">Admin</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 py-4">
          © {new Date().getFullYear()} LMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
