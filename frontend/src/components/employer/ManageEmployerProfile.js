import { useState } from "react";
import "./ManageEmployerProfile.css";

function ManageEmployerProfile({ setPage }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const [profilePic, setProfilePic] = useState(null);

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
  const uploadProfilePic = async () => {
  if (!profilePic) {
    alert("Select image first");
    return;
  }

  const formData = new FormData();

  formData.append("file", profilePic);
  formData.append("user_id", user.user_id);

  try {
    const res = await fetch(
      "http://127.0.0.1:5000/api/upload-profile",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Profile image updated");
      window.location.reload();
    } else {
      alert(data.error);
    }

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
 };

  return (
    <div className="mp-container">

      <div className="mp-card">

        <h2>Manage Profile</h2>

        <label>Profile Picture</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />

        <button
          className="upload-btn"
          onClick={uploadProfilePic}
        >
          Upload Profile Picture
        </button>

        <label>Phone Number</label>

        <input
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>New Password</label>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password</label>

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          className="update-btn"
          onClick={handleUpdate}
        >
          Update Profile
        </button>

        <button
          className="back-btn"
          onClick={() => setPage("employer")}
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default ManageEmployerProfile;