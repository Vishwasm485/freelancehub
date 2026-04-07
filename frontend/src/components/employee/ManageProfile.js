import { useEffect, useState } from "react";
import "./ManageProfile.css";

function ManageProfile({ setPage }) {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("Login first");
      window.location.href = "/";
      return;
    }

    setUser(storedUser);
    setPhone(storedUser.phone || "");
  }, []);

const handleUpdate = async () => {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/employee/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.user_id,
        phone: phone,
        password: password
      })
    });

    const data = await res.json();

    if (data.message) {
      alert("Profile updated successfully");
      setPage("employee");
    } else {
      alert("Update failed");
    }

  } catch (err) {
    console.error(err);
  }
};
  if (!user) return null;

  return (
    <div className="manage-container">

      {/* NAVBAR */}
      <div className="navbar">
        <h2>FreelanceHub</h2>

        <div>
          <button onClick={() => setPage("employee")}>
            Back to Profile
          </button>
          <button
            className="logout"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* CARD */}
      <div className="manage-card">
        <h2>Manage Profile</h2>

        <label>Phone Number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="update-btn" onClick={handleUpdate}>
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default ManageProfile;