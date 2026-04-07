import { useEffect, useState } from "react";
import "./EmployeeDashboard.css";

function EmployeeDashboard({ setPage }) {
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
      .then(data => {
        console.log("USER DATA:", data);
        setUser(data);
      })
      .catch(err => console.error("Error fetching user:", err));

  }, []);

  if (!user) return null;

  return (
    <div className="container">

      {/* NAVBAR */}
      <div className="navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button>Profile</button>
          <button onClick={()=>setPage("employee-projects")}>View Posts</button>
          <button>My Tasks</button>
          <button onClick={() => setPage("employee-resources")}>
            Resources
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* PROFILE TITLE */}
      <h2 className="profile-title">PROFILE</h2>

      {/* PROFILE CARD */}
      <div className="profile-card">

        {/* PROFILE IMAGE */}
        <img
          src={
            user.profile_pic
              ? `http://127.0.0.1:5000/${user.profile_pic}`
              : "/images/profile/default.png"
          }
          alt="profile"
          className="profile-img"
          onError={(e) => {
            e.target.src = "/images/profile/default.png";
          }}
        />

        {/* NAME */}
        <h3>{user.name || "User"}</h3>
        <p>{user.role}</p>

        {/* DETAILS */}
        <div className="contact">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Phone:</b> {user.phone}</p>
          <p><b>Gender:</b> {user.gender}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>User ID:</b> {user.id}</p>
        </div>

        {/* BUTTON */}
        <button
          className="btn-primary"
          onClick={() => setPage("manage-profile")}
        >
          Manage Profile
        </button>

      </div>
    </div>
  );
}

export default EmployeeDashboard;