import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./components/admin/AdminDashboard";
import PostResource from "./components/admin/PostResource";
import ViewResources from "./components/admin/ViewResources";

import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import Home from "./pages/Home";
import ManageProfile from "./components/employee/ManageProfile";
import ManageEmployerProfile from "./components/employer/ManageEmployerProfile";
import EmployeeResources from "./components/employee/EmployeeResources";
import EmployeeProjects from "./components/employee/EmployeeProjects";
import EmployeeTasks from "./components/employee/EmployeeTasks";

import EmployerDashboard from "./components/employer/EmployerDashboard";
import PostProject from "./components/employer/PostProject";
import ViewPosts from "./components/employer/ViewPosts";

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
        return <EmployeeDashboard setPage={setPage} />;
      case "manage-profile":
        return <ManageProfile setPage={setPage} />;
      case "employee-resources":
        return <EmployeeResources setPage={setPage} />;
      case "employee-projects":
        return <EmployeeProjects setPage={setPage} />;
      case "employee-tasks":
        return <EmployeeTasks setPage={setPage} />;
      case "employer":
        return <EmployerDashboard setPage={setPage} />;

      case "manage-employer":
        return <ManageEmployerProfile setPage={setPage} />;
      case "post-project":
        return <PostProject setPage={setPage} />;
      case "view-posts":
        return <ViewPosts setPage={setPage} />;
      default:
        return <Home setPage={setPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;