// src/utils/auth.js

// ✅ Save token + full backend user + LMS minimal profile
export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);

  // Raw backend user
  localStorage.setItem("user", JSON.stringify(user));

  // Role
  localStorage.setItem("role", user.role);

  // ✅ Perfect minimal LMS user for daily use
  localStorage.setItem(
    "lms_user",
    JSON.stringify({
      staffId: user.staffId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      doj: user.doj,
    })
  );
};

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("lms_user"));
  } catch {
    return null;
  }
};

export const getRole = () => localStorage.getItem("role");

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
