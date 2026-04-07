import { useEffect, useState } from "react";
import "./AssignedTasks.css";

function AssignedTasks({ setPage }) {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/employer/assignments/${user.user_id}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div className="assign-page">

      <div className="navbar">
        <h2>FreelanceHub</h2>
        <div>
          <button onClick={() => setPage("employer")}>Profile</button>
          <button onClick={() => setPage("view-posts")}>View Posts</button>
          <button className="active">Assigned Tasks</button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      <div className="grid">
        {tasks.map(t => (
          <div key={t.id} className="card">

            <h3>{t.title}</h3>
            <p>{t.description}</p>

            <div className="skills">
              {(t.skills || "").split(",").map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>

            <p>📅 Deadline: {t.deadline}</p>
            <p>👤 {t.name}</p>
            <p>📧 {t.email}</p>
            <p>📞 {t.phone}</p>
            <p>💰 ₹{t.agreed_amount}</p>

            {t.file_path && (
              <a href={`http://127.0.0.1:5000/${t.file_path}`} target="_blank">
                📎 Attachment
              </a>
            )}

            <button>View Status</button>
            <button>Make Payment</button>
            <button>Chat</button>

          </div>
        ))}
      </div>

    </div>
  );
}

export default AssignedTasks;