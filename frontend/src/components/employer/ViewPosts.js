import { useEffect, useState } from "react";
import "./ViewPosts.css";

function ViewPosts({ setPage }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedBid, setSelectedBid] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // ==============================
  // LOAD PROJECTS
  // ==============================
  useEffect(() => {
    if (!user?.user_id) return;

    fetch(`http://127.0.0.1:5000/api/employer/projects/${user.user_id}`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));

  }, [user?.user_id]);

  // ==============================
  // DELETE PROJECT
  // ==============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/employer/delete-project/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      console.log(data);

      setProjects(prev => prev.filter(p => p.id !== id));

    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Failed to delete project");
    }
  };

  // ==============================
  // VIEW LOWEST BID
  // ==============================
  const handleViewBid = async (projectId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/api/employer/bids/${projectId}`
      );

      const data = await res.json();
      console.log("BID DATA:", data); // DEBUG

      if (data.error) {
        alert("No bids yet");
        return;
      }

      // ✅ FIX: attach project_id manually
      data.project_id = projectId;

      setSelectedBid(data);
      setShowPopup(true);

    } catch (err) {
      console.error("BID ERROR:", err);
    }
  };

  // ==============================
  // ASSIGN TASK
  // ==============================
  const handleAssign = async () => {
    const confirmAssign = window.confirm("Are you sure to assign this task?");
    if (!confirmAssign) return;
    
    try {
      const res = await fetch("http://127.0.0.1:5000/api/employer/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          project_id: selectedBid.project_id,
          employee_id: selectedBid.employee_id,
          bid_amount: selectedBid.bid_amount
        })
      });
      console.log("SENDING DATA:", {
        project_id: selectedBid.project_id,
        employee_id: selectedBid.employee_id,
        bid_amount: selectedBid.bid_amount
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert(data.message);

      // ✅ REMOVE PROJECT FROM LIST
      setProjects(prev =>
        prev.filter(p => p.id !== selectedBid.project_id)
      );

      setShowPopup(false);

    } catch (err) {
      console.error("ASSIGN ERROR:", err);
      alert("Failed to assign project");
    }
  };

  // ==============================
  // SEARCH FILTER
  // ==============================
  const filtered = projects.filter(p =>
    (p.title || "").toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // UI
  // ==============================
  return (
    <div className="vp-page">

      {/* NAVBAR */}
      <div className="vp-navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button onClick={() => setPage("employer")}>Profile</button>
          <button onClick={() => setPage("post-project")}>Post Project</button>
          <button className="active">View Posts</button>
          <button onClick={() => setPage("assigned-tasks")}>
            View Assigned Tasks
          </button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="vp-search">
        <input
          placeholder="Search by project title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* PROJECT GRID */}
      <div className="vp-grid">
        {filtered.map(p => (
          <div key={p.id} className="vp-card">

            <h3>{p.title}</h3>

            <p className="desc">{p.description}</p>

            <div className="skills">
              {(p.skills || "").split(",").map((s, i) => (
                <span key={i}>{s.trim()}</span>
              ))}
            </div>

            <p>💰 Budget: ₹{p.budget}</p>
            <p>📅 Deadline: {p.deadline}</p>
            <p>🕒 Posted: {p.created_at}</p>

            {/* ATTACHMENT */}
            {p.file_path && (
              <a
                href={`http://127.0.0.1:5000/${p.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="attach"
              >
                📎 View Attachment
              </a>
            )}

            {/* ACTIONS */}
            <div className="actions">

              <button
                className="delete"
                onClick={() => handleDelete(p.id)}
              >
                Delete Project
              </button>

              <button
                className="bids"
                onClick={() => handleViewBid(p.id)}
              >
                View Bids
              </button>

            </div>

          </div>
        ))}
      </div>

      {/* ==============================
          BID POPUP
      ============================== */}
      {showPopup && selectedBid && (
        <div className="popup">
          <div className="popup-box">

            <h3>Lowest Bid Details</h3>

            <p><b>Name:</b> {selectedBid?.name || "-"}</p>
            <p><b>Gender:</b> {selectedBid?.gender || "-"}</p>
            <p><b>Email:</b> {selectedBid?.email || "-"}</p>
            <p><b>Phone:</b> {selectedBid?.phone || "-"}</p>
            <p><b>Bid Amount:</b> ₹{selectedBid?.bid_amount || 0}</p>

            <div className="popup-actions">
              <button onClick={() => setShowPopup(false)}>Close</button>

              <button className="assign" onClick={handleAssign} disabled={!selectedBid}>
                Assign Task
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ViewPosts;