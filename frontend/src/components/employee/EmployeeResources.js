import { useEffect, useState } from "react";
import "./EmployeeResources.css";

function EmployeeResources({ setPage }) {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/admin/resources")
      .then(res => res.json())
      .then(data => {
        console.log("RESOURCES:", data);
        setResources(data);
      })
      .catch(err => console.error(err));
  }, []);

  const filtered = resources.filter(r =>
    (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.skill || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="res-page">

      {/* NAVBAR */}
      <div className="res-navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button onClick={() => setPage("employee")}>Profile</button>
          <button>View Posts</button>
          <button>My Tasks</button>
          <button className="active">Video Resources</button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          placeholder="Search by title or skills (java, python...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="res-grid">

        {filtered.length === 0 ? (
          <p style={{ textAlign: "center" }}>No resources found</p>
        ) : (

          filtered.map((r) => {

            const filePath = r.file_path || "";
            const lowerPath = filePath.toLowerCase();

            return (
              <div key={r.id} className="res-card">

                {/* TITLE */}
                <h3>{r.title}</h3>

                {/* DESCRIPTION */}
                <p className="desc">
                  {r.description || "No description available"}
                </p>

                {/* SKILLS */}
                <div className="skills">
                  {(r.skill || "").split(",").map((s, i) => (
                    <span key={i}>{s.trim()}</span>
                  ))}
                </div>

                {/* PREVIEW SECTION */}

                {/* VIDEO */}
                {lowerPath.endsWith(".mp4") ? (
                  <video
                    controls
                    className="video-preview"
                    style={{
                      width: "100%",
                      height: "160px",
                      borderRadius: "10px",
                      background: "#000"
                    }}
                  >
                    <source
                      src={`http://127.0.0.1:5000/${filePath}`}
                      type="video/mp4"
                    />
                  </video>

                ) : lowerPath.match(/\.(jpg|jpeg|png|gif)$/) ? (

                  /* IMAGE */
                  <img
                    src={`http://127.0.0.1:5000/${filePath}`}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "10px"
                    }}
                    className="image-preview"
                  />

                ) : lowerPath.endsWith(".pdf") ? (

                  /* PDF */
                  <iframe
                    src={`http://127.0.0.1:5000/${filePath}`}
                    title="pdf"
                    style={{
                      width: "100%",
                      height: "150px",
                      borderRadius: "10px"
                    }}
                    className="pdf-preview"
                  />

                ) : (
                  
                  /* DOWNLOAD */
                  <a
                    href={`http://127.0.0.1:5000/${filePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="download-btn"
                  >
                    Download File
                  </a>

                )}

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default EmployeeResources;