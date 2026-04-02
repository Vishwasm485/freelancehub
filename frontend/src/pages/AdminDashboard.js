import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ setPage }) {

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

      {/* DASHBOARD */}
      <div className="admin-content">
        <h2>Welcome Admin 👋</h2>

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

    </div>
  );
}

export default AdminDashboard;