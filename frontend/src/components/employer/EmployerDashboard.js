import { useEffect, useState } from "react";
import "./EmployerDashboard.css";

function EmployerDashboard({ setPage }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("Please login first");
      window.location.href = "/";
      return;
    }

    fetch(`http://127.0.0.1:5000/api/user/${storedUser.user_id}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  if (!user) return null;

  return (
    <div className="emp-container">

      {/* NAVBAR */}
      <div className="emp-navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button>Profile</button>
          <button onClick={() => setPage("post-project")}>
            Post Project
          </button>
          <button onClick={()=> setPage("view-posts")}>View Posts</button>
          <button onClick={()=> setPage("assign-tasks")}>View Assigned Tasks</button>
          <button onClick={() => setPage("home")}>Logout</button>
        </div>
      </div>

      {/* PROFILE */}
      <h2 className="emp-title">PROFILE</h2>

      <div className="emp-card">

        <img
          src={
            user.profile_pic
              ? `http://127.0.0.1:5000/${user.profile_pic}`
              : "/images/profile/default.png"
          }
          className="emp-img"
          alt="profile"
        />

        <h3>{user.name}</h3>
        <p>{user.role}</p>

        <div className="emp-info">
          <p><b>Email:</b> {user.email}</p>
          <p><b>Phone:</b> {user.phone}</p>
          <p><b>Gender:</b> {user.gender}</p>
        </div>

        <button
          className="emp-btn"
          onClick={() => setPage("manage-employer")}
        >
          Manage Profile
        </button>

      </div>
    </div>
  );
}

export default EmployerDashboard;