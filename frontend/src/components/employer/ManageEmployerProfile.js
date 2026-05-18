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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />
        <button onClick={uploadProfilePic}>
          Upload Profile Picture
        </button>
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