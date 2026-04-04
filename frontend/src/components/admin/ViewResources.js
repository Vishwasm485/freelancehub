import { useEffect, useState } from "react";
import "./ViewResources.css";

function ViewResources({ setPage }) {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");

  // LOAD DATA
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/admin/resources")
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(err => console.error("Error fetching resources:", err));
  }, []);

  // DELETE
  const deleteResource = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    await fetch(`http://127.0.0.1:5000/api/admin/delete-resource/${id}`, {
      method: "DELETE"
    });

    setResources(prev => prev.filter(r => r.id !== id));
  };

  // SEARCH FILTER
  const filtered = resources.filter(r =>
    (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.skill || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-container">

      {/* NAVBAR */}
      <div className="admin-navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button onClick={() => setPage("post-resource")}>Post Resource</button>
          <button className="active">View Resources</button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          placeholder="Search by title or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CARDS */}
      <div className="card-container">
        {filtered.map((r) => (
          <div key={r.id} className="card">

            <h3>{r.title}</h3>

            <p className="desc">{r.description}</p>

      <p className="skills">
        Skills:
        {(r.skill || "").split(",").map((s, i) => (
          <span key={i}>{s.trim()}</span>
        ))}
      </p>
      const filtered = resources.filter{r =>
        (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.skill || "").toLowerCase().includes(search.toLowerCase())
      };
      {/* FILE PREVIEW */}
            {r.file_type?.toLowerCase() === "mp4" ? (
              <video width="100%" controls>
                <source src={`http://127.0.0.1:5000/${r.file_path}`} />
              </video>
            ) : (
              <a
                href={`http://127.0.0.1:5000/${r.file_path}`}
                target="_blank"
                rel="noreferrer"
              >
                📥 Download File
              </a>
            )}

            <button
              className="delete-btn"
              onClick={() => deleteResource(r.id)}
            >
              Delete Resource
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ViewResources;