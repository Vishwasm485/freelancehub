import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "login":
        return <Login setPage={setPage} />;
      case "signup":
        return <Signup goHome={() => setPage("home")} />;
      case "employee":
        return <EmployeeDashboard />;
      case "employer":
        return <EmployerDashboard />;
      default:
        return (
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>FreelanceHub</h1>
            <p>Find the Best Freelancers</p>

            <button onClick={() => setPage("login")}>Login</button>
            <button onClick={() => setPage("signup")} style={{ marginLeft: "10px" }}>
              Signup
            </button>
          </div>
        );
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;