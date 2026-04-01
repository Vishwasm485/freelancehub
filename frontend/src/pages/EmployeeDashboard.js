import { useEffect, useState } from "react";

function EmployeeDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("Please login first");
      window.location.href = "/";
      return;
    }

    setUser(storedUser);
  }, []);

  if (!user) return null;

  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      
      {/* 🔷 NAVBAR */}
      <div style={{
        background: "#2f6fed",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <h2>FreelanceHub</h2>

        <div>
          <button style={navBtn}>Profile</button>
          <button style={navBtn}>View Posts</button>
          <button style={navBtn}>My Tasks</button>
          <button style={navBtn}>Resources</button>
          <button style={navBtn} onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}>Logout</button>
        </div>
      </div>

      {/* 🔷 PROFILE SECTION */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "#2f6fed" }}>PROFILE</h2>

        <div style={{
          width: "500px",
          margin: "auto",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          marginTop: "20px"
        }}>

          {/* Profile Image */}
          <img
            src="https://via.placeholder.com/100"
            alt="profile"
            style={{
              borderRadius: "50%",
              border: "3px solid #2f6fed"
            }}
          />

          {/* Name */}
          <h3>{user.name || "User"}</h3>
          <p>{user.role}</p>

          {/* Contact Info */}
          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <h4>Contact Info</h4>
            <p><b>Email:</b> {user.email || "Not available"}</p>
            <p><b>User ID:</b> {user.user_id}</p>
          </div>

          <button style={{
            background: "#2f6fed",
            color: "white",
            border: "none",
            padding: "10px 15px",
            marginTop: "10px",
            borderRadius: "5px"
          }}>
            Manage Profile
          </button>

        </div>
      </div>
    </div>
  );
}

// Button style
const navBtn = {
  marginLeft: "10px",
  padding: "8px 12px",
  border: "none",
  background: "#1e4fd1",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer"
};

export default EmployeeDashboard;