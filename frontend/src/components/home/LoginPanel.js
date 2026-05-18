import { useState } from "react";

function LoginPanel({ setPage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [message, setMessage] = useState("");

  const handleLogin = () => {

    if (!email || !password) {
      setMessage("Enter all fields");
      return;
    }

    fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        password,
        role
      })
    })

    .then(res => res.json())

    .then(data => {

      if (data.error) {
        setMessage(data.error);
      }

      else {

        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );

        if (data.role === "employee") {
          setPage("employee");
        }

        else if (data.role === "employer") {
          setPage("employer");
        }

        else if (data.role === "admin") {
          setPage("admin");
        }

      }

    })

    .catch(err => {
      console.error(err);
      setMessage("Server error");
    });

  };

  return (

    <div className="login-panel">

      <h2>Login</h2>

      <div className="role-box">

        <label>
          <input
            type="radio"
            value="employee"
            checked={role === "employee"}
            onChange={(e) => setRole(e.target.value)}
          />
          Employee
        </label>

        <label>
          <input
            type="radio"
            value="employer"
            checked={role === "employer"}
            onChange={(e) => setRole(e.target.value)}
          />
          Employer
        </label>

        <label>
          <input
            type="radio"
            value="admin"
            checked={role === "admin"}
            onChange={(e) => setRole(e.target.value)}
          />
          Admin
        </label>

      </div>

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <p className="error-text">
        {message}
      </p>

    </div>
  );
}

export default LoginPanel;