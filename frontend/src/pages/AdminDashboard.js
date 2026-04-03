import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ setPage }) {
  const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning ☀️, Admin!";
  if (hour < 18) return "Good Afternoon 🌤️, Admin!";
  return "Good Evening 🌙, Admin!";
};

  // ✅ Hooks MUST be inside component
  const [stats, setStats] = useState({
    employees: 0,
    employers: 0,
    active_projects: 0,
    unassigned_projects: 0,
    resources: 0
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div className="admin-container">

      {/* NAVBAR */}
      <div className="admin-navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button onClick={() => setPage("post-resource")}>Post Resource</button>
          <button onClick={() => setPage("view-resources")}>View Resources</button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      <div className="admin-content">

        {/* Greeting Section */}
        <div className="welcome-box">
          <h2>{getGreeting()}</h2>
          <p>Here’s what’s happening on your platform today</p>
        </div>

        {/* Grid */}
        <div className="grid">
          <div className="card">
            <h3>{stats.employees}</h3>
            <p>Total Employees</p>
          </div>

          <div className="card">
            <h3>{stats.employers}</h3>
            <p>Total Employers</p>
          </div>

          <div className="card">
            <h3>{stats.active_projects}</h3>
            <p>Active Projects</p>
          </div>

          <div className="card">
            <h3>{stats.unassigned_projects}</h3>
            <p>Unassigned Projects</p>
          </div>

          <div className="card">
            <h3>{stats.resources}</h3>
            <p>Total Resources</p>
          </div>
        </div>

      </div>
    <div className="footer">
  <p>© 2026 FreelanceHub | Admin Panel</p>
  <p>{new Date().toLocaleString()}</p>
</div>
    </div>
  );
}

export default AdminDashboard;