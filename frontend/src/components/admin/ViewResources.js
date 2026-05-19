import { useEffect, useState } from "react";
import "./ViewResources.css";
import AdminNavbar from "./AdminNavbar";

function ViewResources({ setPage }) {

  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");

  /* LOAD DATA */

  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/admin/resources")

      .then((res) => res.json())

      .then((data) => setResources(data))

      .catch((err) =>
        console.error("Error fetching resources:", err)
      );

  }, []);

  /* DELETE */

  const deleteResource = async (id) => {

    const confirmDelete =
      window.confirm("Delete this resource?");

    if (!confirmDelete) return;

    try {

      await fetch(
        `http://127.0.0.1:5000/api/admin/delete-resource/${id}`,
        {
          method: "DELETE"
        }
      );

      setResources((prev) =>
        prev.filter((r) => r.id !== id)
      );

    } catch (err) {

      console.error("Delete Error:", err);

    }

  };

  /* SEARCH FILTER */

  const filtered = resources.filter((r) =>

    (r.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())

    ||

    (r.skill || "")
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  return (

    <div className="view-container">

      {/* NAVBAR */}

      <AdminNavbar
        setPage={setPage}
        active="view-resources"
      />

      {/* HEADER */}

      <div className="view-header">

        <h1>Platform Resources</h1>

        <p>
          Manage tutorials, guides,
          videos and learning resources.
        </p>

      </div>

      {/* SEARCH */}

      <div className="search-bar">

        <input
          type="text"
          placeholder="Search by title or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* EMPTY */}

      {filtered.length === 0 ? (

        <div className="empty-box">

          <p>No resources found.</p>

        </div>

      ) : (

        <div className="card-container">

          {filtered.map((r) => (

            <div
              key={r.id}
              className="card"
            >

              {/* TITLE */}

              <h3>{r.title}</h3>

              {/* DESCRIPTION */}

              <p className="desc">
                {r.description}
              </p>

              {/* SKILLS */}

              <div className="skills">

                {(r.skill || "")
                  .split(",")
                  .map((s, i) => (

                    <span key={i}>
                      {s.trim()}
                    </span>

                ))}

              </div>

              {/* FILE */}

              <div className="file-preview">

                {r.file_type?.toLowerCase() === "mp4" ? (

                  <video
                    className="resource-video"
                    controls
                  >

                    <source
                      src={`http://127.0.0.1:5000/${r.file_path}`}
                    />

                  </video>

                ) : (

                  <a
                    className="download-btn"
                    href={`http://127.0.0.1:5000/${r.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download Resource
                  </a>

                )}

              </div>

              {/* ACTIONS */}

              <div className="card-actions">

                <button
                  className="delete-btn"
                  onClick={() => deleteResource(r.id)}
                >
                  Delete Resource
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default ViewResources;