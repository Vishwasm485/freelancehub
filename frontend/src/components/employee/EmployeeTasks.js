import { useEffect, useState } from "react";
import "./EmployeeDashboard.css";

function EmployeeTasks({ setPage }) {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/employee/assigned/${user.user_id}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div className="task-page">

      {/* ✅ NAVBAR (ADD HERE) */}
      <div className="navbar">
        <h2>FreelanceHub</h2>
        <div>
          <button onClick={() => setPage("employee")}>Profile</button>
          <button onClick={() => setPage("employee-projects")}>View Posts</button>
          <button className="active">My Tasks</button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      {/* ✅ PAGE CONTENT */}
      <div style={{ padding: "20px" }}>
        <h2>My Tasks</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px"
        }}>
          {tasks.map(t => (
            <div key={t.assignment_id} style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px"
            }}>

              <h3>{t.title}</h3>
              <p>{t.description}</p>

              <p><b>Skills:</b> {t.skills}</p>
              <p>📅 Deadline: {t.deadline}</p>

              <p>👤 {t.employer_name}</p>
              <p>📧 {t.email}</p>
              <p>📞 {t.phone}</p>

              <p>💰 ₹{t.agreed_amount}</p>

              {t.file_path && (
                <a
                  href={`http://127.0.0.1:5000/${t.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📎 Attachment
                </a>
              )}

              <div style={{ marginTop: "10px" }}>
                <button style={{ width: "100%", marginBottom: "5px" }}>
                  View Status
                </button>

                <button style={{
                  width: "100%",
                  marginBottom: "5px",
                  background: "green",
                  color: "white"
                }}>
                  View Payment
                </button>

                <button style={{
                  width: "100%",
                  background: "#4f46e5",
                  color: "white"
                }}>
                  Chat
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default EmployeeTasks;