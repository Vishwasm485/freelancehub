import { useState } from "react";
import "./ManageEmployerProfile.css";

function ManageEmployerProfile({ setPage }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpdate = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/api/employer/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.user_id,
        phone,
        password
      })
    });

    const data = await res.json();

    alert(data.message || "Updated");
    setPage("employer");
  };

  return (
    <div className="mp-container">

      <div className="mp-card">
        <h2>Manage Profile</h2>

        <input
          placeholder="Phone Number"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button onClick={handleUpdate}>
          Update Profile
        </button>

        <button onClick={() => setPage("employer")}>
          Back
        </button>

      </div>
    </div>
  );
}

export default ManageEmployerProfile;