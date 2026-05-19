import { useEffect, useState } from "react";
import "./EmployeeDashboard.css";
import EmployeeNavbar from "./EmployeeNavbar";

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
      <EmployeeNavbar
        setPage={setPage}
        active="profile"
      />

      {/* PROFILE TITLE */}
      <h2 className="profile-title">PROFILE</h2>

      {/* PROFILE CARD */}
      <div className="profile-card">

        {/* PROFILE IMAGE */}
        <img
          src={
            user.profile_pic
              ? `http://127.0.0.1:5000/${user.profile_pic}`
              : "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
          }
          alt="profile"
          className="profile-img"
          onError={(e) => {
            e.target.src = "/profile/default.png";
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