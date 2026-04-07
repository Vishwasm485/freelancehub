import { useState } from "react";
import "./PostProject.css";

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

      <div className="post-navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button onClick={() => setPage("employer")}>Profile</button>
          <button className="active">Post Project</button>
          <button >View Posts</button>
          <button>View Assigned Tasks</button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      <div className="post-card">
        <h2>Post a New Project</h2>

        <label>Project Title</label>
        <input name="title" onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" onChange={handleChange} />

        <label>Required Skills</label>
        <input name="skills" onChange={handleChange} />

        <div className="row">
          <div>
            <label>Budget</label>
            <input name="budget" type="number" onChange={handleChange} />
          </div>

          <div>
            <label>Deadline</label>
            <input name="deadline" type="date" onChange={handleChange} />
          </div>
        </div>

        {/* 🔥 FILE INPUT */}
        <label>Attach Document (No videos)</label>
        <input
          type="file"
          onChange={handleFile}
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Post Project
        </button>
      </div>
    </div>
  );
}

export default PostProject;