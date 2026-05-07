import { useState } from "react";
import "./PostResource.css";

function PostResource({ setPage }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skill: "",
    file: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      console.log("Selected file:", files[0]); // 👈 ADD THIS
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user); // 👈 ADD HERE

    if (!form.title || !form.skill || !form.file || !form.description) {
      alert("Please fill all fields");
      return;
    }
  
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("skill", form.skill);
    data.append("file", form.file);
    data.append("uploaded_by", user.user_id);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/admin/add-resource", {
        method: "POST",
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Resource added successfully");
        setForm({
          title: "",
          description: "",
          skill: "",
          file: null
        });
      } else {
        alert(result.error);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="post-container">

      {/* NAVBAR */}
      <div className="admin-navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button onClick={() => setPage("admin")}>Dashboard</button>
          <button onClick={() => setPage("view-resources")}>View Resources</button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      <h1 className="page-title">Post a New Resource</h1>

      {/* FORM CARD */}
      <div className="form-card">
        <h2>Post Resource</h2>

        <form onSubmit={handleSubmit}>

          <label>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter resource title"
          />
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter resource description"
            rows="3"
          />

          <label>For Skills (comma separated)</label>
          <input
            type="text"
            name="skill"
            value={form.skill}
            onChange={handleChange}
            placeholder="e.g. HTML, CSS, JS"
          />

          <label>Attach File</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn">
            Save Resource
          </button>

        </form>
      </div>

    </div>
  );
}

export default PostResource;