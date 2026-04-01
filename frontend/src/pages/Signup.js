import { useState } from "react";

function Signup({ goHome }) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    company: ""
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // OTP states
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [emailStatus, setEmailStatus] = useState("");
  const [phoneStatus, setPhoneStatus] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [success, setSuccess] = useState(false);

  goHome = goHome || (() => {});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🔐 Signup
  const handleSignup = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setMessage("All fields are required");
      return;
    }
    if (!formData.gender) {
      setMessage("Select gender");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (!emailVerified) {
      setMessage("Email not verified");
      return;
    }

    if (!phoneVerified) {
      setMessage("Phone not verified");
      return;
    }

    const data = {
      ...formData
    };

    

    fetch("http://127.0.0.1:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Registered successfully") {
          setShowPopup(true);
          setSuccess(true);
          setMessage(data.message);

          // ⏳ redirect after 2 sec
          setTimeout(() => {
            goHome(); // or goLogin if you have it
          }, 2000);
        } else {
          setMessage(data.error || "Signup failed");
        }
      })
      .catch(err => {
        console.error(err);
        setMessage("Server error");
      });
  };
  {showPopup && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{
      background: "#fff",
      padding: "30px",
      borderRadius: "10px",
      textAlign: "center",
      width: "300px"
    }}>
      <h2 style={{ color: "green" }}>✔ Success</h2>
      <p>Registered successfully</p>
    </div>
  </div>
)}
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <div style={{
        width: "350px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center"
      }}>
        <h2>Signup</h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} /><br /><br />

        <div>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              onChange={handleChange}
            />
            Male
          </label>

          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="gender"
              value="female"
              onChange={handleChange}
            />
            Female
          </label>
        </div>

        <br />
        {/* 📧 EMAIL */}
        <div>
          <input name="email" placeholder="Email" onChange={handleChange} />
          <button
            onClick={() => {
              if (!formData.email) {
                setEmailStatus("Enter email first");
                return;
              }

              fetch("http://127.0.0.1:5000/api/send-otp", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
              })
                .then(res => res.json())
                .then(data => {
                  setEmailStatus(data.message);
                  setShowEmailOtp(true);
                });
            }}
            style={{ marginLeft: "10px" }}
          >
            Verify
          </button>
        </div>

        <br />

        {showEmailOtp && (
          <>
            <input
              placeholder="Enter Email OTP"
              onChange={(e) => setEmailOtp(e.target.value)}
            />

            <button
              onClick={() => {
                fetch("http://127.0.0.1:5000/api/verify-otp", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    value: formData.email,
                    otp: emailOtp
                  })
                })
                  .then(res => res.json())
                  .then(data => {
                    setEmailStatus(data.message);
                    if (data.message === "OTP verified") {
                      setEmailVerified(true);
                    }
                  });
              }}
              style={{ marginLeft: "10px" }}
            >
              Submit
            </button>
          </>
        )}

        <p>{emailStatus}</p>

        {/* 📱 PHONE */}
        <div>
          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          <button
            onClick={() => {
              if (!formData.phone) {
                setPhoneStatus("Enter phone first");
                return;
              }

              fetch("http://127.0.0.1:5000/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: formData.phone })
              })
                .then(res => res.json())
                .then(data => {
                  setPhoneStatus(data.message);
                  setShowPhoneOtp(true);
                });
            }}
            style={{ marginLeft: "10px" }}
          >
            Verify
          </button>
        </div>

        <br />

        {showPhoneOtp && (
          <>
            <input
              placeholder="Enter Phone OTP"
              onChange={(e) => setPhoneOtp(e.target.value)}
            />

            <button
              onClick={() => {
                fetch("http://127.0.0.1:5000/api/verify-otp", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    value: formData.phone,
                    otp: phoneOtp
                  })
                })
                  .then(res => res.json())
                  .then(data => {
                    setPhoneStatus(data.message);
                    if (data.message === "OTP verified") {
                      setPhoneVerified(true);
                    }
                  });
              }}
              style={{ marginLeft: "10px" }}
            >
              Submit
            </button>
          </>
        )}

        <p>{phoneStatus}</p>

        <input type="password" name="password" placeholder="Password" onChange={handleChange} /><br /><br />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} /><br /><br />

        {/* 📸 Profile Pic */}
        <input type="file" onChange={handleFileChange} /><br /><br />

        {/* ROLE */}
        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="employee"
              checked={formData.role === "employee"}
              onChange={handleChange}
            />
            Employee
          </label>

          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="role"
              value="employer"
              checked={formData.role === "employer"}
              onChange={handleChange}
            />
            Employer
          </label>
        </div>

        <br />

        {formData.role === "employer" && (
          <>
            <input name="company" placeholder="Company Name" onChange={handleChange} /><br /><br />
          </>
        )}

        <button onClick={handleSignup} style={{ width: "100%" }}>
          Signup
        </button>

        {success ? (
          <div style={{ color: "green", marginTop: "10px" }}>
            <h3>✔ {message}</h3>
          </div>
        ) : (
          <p style={{ color: "red" }}>{message}</p>
        )}

        <button onClick={goHome} style={{ marginTop: "10px" }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Signup;