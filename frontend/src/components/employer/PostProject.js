import { useState } from "react";
import "./PostProject.css";
import EmployerNavbar from "./EmployerNavbar";

function PostProject({ setPage }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    deadline: ""
  });

  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    // ❌ block video files
    if (selected.type.startsWith("video")) {
      alert("Video files not allowed");
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("employer_id", user.user_id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("skills", form.skills);
    formData.append("budget", form.budget);
    formData.append("deadline", form.deadline);

    if (file) {
      formData.append("file", file);
    }

    const res = await fetch("http://127.0.0.1:5000/api/employer/projects", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Project posted successfully");
    setPage("employer");
  };

  return (
    <div className="post-container">

      {/* NAVBAR */}

      <EmployerNavbar
        setPage={setPage}
        active="post-project"
      />

      <div className="post-wrapper">

        {/* HERO */}

        <div className="post-hero">

          <h1>Post Your Project</h1>

          <p>
            Publish projects, hire freelancers
            and collaborate professionally.
          </p>

        </div>

        {/* CARD */}

        <div className="post-card">

          <h2>Create New Project</h2>

          {/* TITLE */}

          <label>Project Title</label>

          <input
            name="title"
            placeholder="Enter project title"
            onChange={handleChange}
          />

          {/* DESCRIPTION */}

          <label>Project Description</label>

          <textarea
            name="description"
            placeholder="Describe your project requirements..."
            onChange={handleChange}
          />

          {/* SKILLS */}

          <label>Required Skills</label>

          <input
            name="skills"
            placeholder="React, Python, UI/UX..."
            onChange={handleChange}
          />

          {/* ROW */}

          <div className="row">

            <div>

              <label>Budget (₹)</label>

              <input
                name="budget"
                type="number"
                placeholder="Enter budget"
                onChange={handleChange}
              />

            </div>

            <div>

              <label>Deadline</label>

              <input
                name="deadline"
                type="date"
                onChange={handleChange}
              />

            </div>

          </div>

          {/* FILE */}

          <label>Attach Document</label>

          <input
            type="file"
            onChange={handleFile}
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          />

          <p className="file-note">
            Supported:
            PDF, DOC, DOCX, TXT, JPG, PNG
          </p>

          {/* BUTTON */}

          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            Post Project
          </button>

        </div>

      </div>

    </div>
  );
}

export default PostProject;