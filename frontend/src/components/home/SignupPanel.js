import { useState } from "react";

function SignupPanel() {

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

  const [emailOtp, setEmailOtp] = useState("");

  const [emailStatus, setEmailStatus] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);

  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // EMAIL OTP

  const sendEmailOtp = () => {

    if (!formData.email) {
      setEmailStatus("Enter email first");
      return;
    }

    fetch("http://127.0.0.1:5000/api/send-otp", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email: formData.email
      })

    })

    .then(res => res.json())

    .then(data => {

      setEmailStatus(data.message);

      setShowEmailOtp(true);

    })

    .catch(err => {

      console.error(err);

      setEmailStatus("OTP failed");

    });

  };

  // VERIFY EMAIL OTP

  const verifyEmailOtp = () => {

    fetch("http://127.0.0.1:5000/api/verify-otp", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

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

  };

 
  // SIGNUP

  const handleSignup = () => {

    if (!formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.password) {

      setMessage("All fields required");
      return;

    }

    if (!emailVerified) {
      setMessage("Email not verified");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("gender", formData.gender);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("role", formData.role);
    data.append("company", formData.company);

    if (file) {
      data.append("profile_pic", file);
    }

    fetch("http://127.0.0.1:5000/api/register", {

      method: "POST",

      body: data

    })

    .then(res => res.json())

    .then(data => {

      if (data.message === "Registered successfully") {

        setMessage("Signup successful");

      }

      else {

        setMessage(data.error);

      }

    })

    .catch(err => {

      console.error(err);

      setMessage("Server error");

    });

  };

  return (

    <div className="signup-panel">

      <h2>Create Account</h2>

      {/* ROW 1 */}

      <div className="signup-row">

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <select
          name="gender"
          onChange={handleChange}
        >

          <option value="">
            Gender
          </option>

          <option value="male">
            Male
          </option>

          <option value="female">
            Female
          </option>

        </select>

      </div>

      {/* EMAIL */}

      <div className="signup-row">

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <button
          className="otp-btn"
          onClick={sendEmailOtp}
        >
          Get OTP
        </button>

      </div>

      {showEmailOtp && (

        <div className="signup-row">

          <input
            placeholder="Enter Email OTP"
            onChange={(e) => setEmailOtp(e.target.value)}
          />

          <button
            className="verify-btn"
            onClick={verifyEmailOtp}
          >
            Verify
          </button>

        </div>

      )}

      <p>{emailStatus}</p>

      {/* PHONE */}

<div className="signup-row">

  <input
    name="phone"
    placeholder="Phone Number"
    onChange={handleChange}
  />

</div>

{/* PASSWORD */}

<div className="signup-row">

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

      </div>

      {/* ROLE */}

      <div className="signup-row">

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >

          <option value="employee">
            Employee
          </option>

          <option value="employer">
            Employer
          </option>

        </select>

      </div>

      {/* COMPANY */}

      {formData.role === "employer" && (

        <div className="signup-row">

          <input
            name="company"
            placeholder="Company Name"
            onChange={handleChange}
          />

        </div>

      )}

      {/* IMAGE */}

      <div className="signup-row">

        <input
          type="file"
          onChange={handleFileChange}
        />

      </div>

      <button
        className="create-btn"
        onClick={handleSignup}
      >
        Create Workspace
      </button>

      <p className="error-text">
        {message}
      </p>

    </div>
  );
}

export default SignupPanel;