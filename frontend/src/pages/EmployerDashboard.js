import { useEffect, useState } from "react";

function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const employer_id = user?.user_id;

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: ""
  });

  // 🔐 Protect route + load projects
  useEffect(() => {
    if (!user) {
      alert("Please login first");
      window.location.href = "/";
      return;
    }

    fetch(`http://127.0.0.1:5000/api/employer/projects/${employer_id}`)
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  // 📝 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ Create project
  const createProject = async () => {
    if (!form.title || !form.description || !form.budget) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/api/employer/create-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        employer_id
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Project created successfully ✅");

      // refresh projects
      setProjects([...projects, data.project]);
      setForm({ title: "", description: "", budget: "" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employer Dashboard</h2>

      {/* ➕ Create Project */}
      <div style={{ marginBottom: "20px", border: "1px solid black", padding: "10px" }}>
        <h3>Create Project</h3>

        <input
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
        /><br /><br />

        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
        /><br /><br />

        <input
          name="budget"
          placeholder="Budget"
          value={form.budget}
          onChange={handleChange}
        /><br /><br />

        <button onClick={createProject}>Create Project</button>
      </div>

      {/* 📂 Project List */}
      <h3>Your Projects</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {projects.map((p) => (
          <div key={p.id} style={{ border: "1px solid black", padding: "10px" }}>
            <h4>{p.title}</h4>
            <p>{p.description}</p>
            <p><b>Budget:</b> ₹{p.budget}</p>

            <h5>Bids:</h5>
            {p.bids && p.bids.length > 0 ? (
              p.bids.map((b) => (
                <div key={b.id}>
                  <p>💰 ₹{b.bid_amount} - Employee {b.employee_id}</p>
                </div>
              ))
            ) : (
              <p>No bids yet</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard;