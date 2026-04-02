import { useState } from "react";

function Login({ setPage }) {
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
        } else {
          setMessage(data.message);

          // ✅ store session (important)
          localStorage.setItem("user", JSON.stringify(data));

          // 🚀 redirect based on role
          if (data.role === "employee") {
            setPage("employee");
          } else if (data.role === "employer") {
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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <div>
        <label>
          <input
            type="radio"
            value="employee"
            checked={role === "employee"}
            onChange={(e) => setRole(e.target.value)}
          />
          Employee
        </label>

        <label style={{ marginLeft: "15px" }}>
          <input
            type="radio"
            value="employer"
            checked={role === "employer"}
            onChange={(e) => setRole(e.target.value)}
          />
          Employer
        </label>

        <label style={{ marginLeft: "15px" }}>
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
      /><br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />


      <br />

      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>

      <button onClick={() => setPage("home")}>Back</button>
    </div>
  );
}

export default Login;