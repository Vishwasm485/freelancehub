import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./components/admin/AdminDashboard";
import PostResource from "./components/admin/PostResource";
import ViewResources from "./components/admin/ViewResources";

import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import EmployerDashboard from "./components/employer/EmployerDashboard";
function App() { 
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "login":
        return <Login setPage={setPage} />;
      case "signup":
        return <Signup goHome={() => setPage("home")} />;
      case "admin":
        return <AdminDashboard setPage={setPage} />;

      case "post-resource":
        return <PostResource setPage={setPage} />;

      case "view-resources":
        return <ViewResources setPage={setPage} />;
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