import { useEffect, useState } from "react";
import "./EmployeeProjects.css";
import EmployeeNavbar from "./EmployeeNavbar";

function EmployeeProjects({ setPage }) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [lowestBid, setLowestBid] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/employee/projects")
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  const openBid = async (project) => {
    setSelected(project);

    const res = await fetch(
      `http://127.0.0.1:5000/api/employee/lowest-bid/${project.id}`
    );
    const data = await res.json();

    setLowestBid(data.lowest || 0);
  };

const submitBid = async () => {

  if (!bidAmount || isNaN(bidAmount)) {
    alert("Enter valid bid amount");
    return;
  }

  const res = await fetch("http://127.0.0.1:5000/api/employee/bid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      project_id: selected.id,
      employee_id: user.user_id,
      bid_amount: Number(bidAmount)
    })
  });

  const data = await res.json();
  console.log(data);

  if (data.error) {
    alert(data.error);
    return;
  }

  alert("Bid placed successfully");
  setSelected(null);
};

  return (
    <div className="emp-page">

      {/* NAVBAR */}
      <EmployeeNavbar
        setPage={setPage}
        active="view-posts"
      />
      <div className="projects-header">

      <h1>Available Projects</h1>

      <p>
        Browse active projects and place
        competitive bids to get hired.
      </p>

    </div>

      {/* GRID */}
      <div className="emp-grid">
        {projects.map(p => (
          <div key={p.id} className="emp-card">

            <h3>{p.title}</h3>
            <p>{p.description}</p>

            <div className="skills">
              {(p.skills || "").split(",").map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>

            <div className="project-meta">

            <p>
              <b>Budget:</b> ₹{p.budget}
            </p>

            <p>
              <b>Deadline:</b> {p.deadline}
            </p>

          </div>

            {p.file_path && (
             <a
                className="attachment-link"
                href={`http://127.0.0.1:5000/${p.file_path}`}
                target="_blank"
                rel="noreferrer"
              >
                View Attachment
              </a>
            )}

            <button onClick={() => openBid(p)} className="bid-btn">
              Bid Project
            </button>

          </div>
        ))}
      </div>

      {/* BID POPUP */}
      {selected && (
        <div className="popup">
          <div className="popup-box">

            <h3>Place Your Bid</h3>

            <p>📊 Current Lowest Bid: ₹{lowestBid}</p>
            <p>💰 Project Budget: ₹{selected.budget}</p>

            <input
              type="number"
              min="1"
              placeholder="Enter your bid"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />

            <button onClick={submitBid}>Submit Bid</button>

            <span onClick={() => setSelected(null)} className="close">✖</span>

          </div>
        </div>
      )}

    </div>
  );
}

export default EmployeeProjects;