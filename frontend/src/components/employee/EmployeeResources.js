import { useEffect, useState } from "react";
import "./EmployeeResources.css";
import EmployeeNavbar from "./EmployeeNavbar";

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
      <EmployeeNavbar
        setPage={setPage}
        active="resources"
      />
      {/* header */}
      <div className="resources-header">

        <h1>Learning Resources</h1>

        <p>
          Explore tutorials, videos,
          PDFs and learning materials.
        </p>

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
          <div className="empty-state">

            <>
              <h3>No Resources Found</h3>

              <p>
                Try searching with different skills
                or titles.
              </p>
            </>

          </div>
        ) : (

          filtered.map((r) => {

            const filePath = r.file_path || "";
            const lowerPath = filePath.toLowerCase();

            return (
              <div key={r.id} className="res-card">

                {/* TITLE */}
                <h3>{r.title}</h3>
                <div className="resource-type">

                  {lowerPath.endsWith(".mp4")
                    ? "VIDEO"
                    : lowerPath.endsWith(".pdf")
                    ? "PDF"
                    : lowerPath.match(/\.(jpg|jpeg|png|gif)$/)
                    ? "IMAGE"
                    : "FILE"}

                </div>

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
                {/* FILE PREVIEW */}
                <div className="file-preview-box">

                  {lowerPath.endsWith(".mp4") ? (
                    <video className="video-preview">
                      <source
                        src={`http://127.0.0.1:5000/${filePath}`}
                        type="video/mp4"
                      />
                    </video>

                  ) : lowerPath.match(/\.(jpg|jpeg|png|gif)$/) ? (

                    <img
                      src={`http://127.0.0.1:5000/${filePath}`}
                      alt="preview"
                      className="image-preview"
                    />

                  ) : lowerPath.endsWith(".pdf") ? (

                    <div className="pdf-box">
                      PDF Document
                    </div>

                  ) : (

                    <div className="pdf-box">
                      File Attachment
                    </div>

                  )}

                </div>

                <a
                  href={`http://127.0.0.1:5000/${filePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="download-btn"
                >
                  View File
                </a>



              </div>
            );
          })
        )}

      </div>

    </div>
  );
}

export default EmployeeResources;