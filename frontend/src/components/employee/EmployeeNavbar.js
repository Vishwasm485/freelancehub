import "./EmployeeNavbar.css";

function EmployeeNavbar({ setPage, active }) {

  const handleLogout = () => {

    localStorage.removeItem("user");

    setPage("home");

  };

  return (

    <div className="employee-navbar">

      <div className="employee-logo">

        <h2>FreelanceHub</h2>

        <span>Employee Workspace</span>

      </div>

      <div className="employee-nav-links">

        <button
          className={active === "profile" ? "active-employee-nav" : ""}
          onClick={() => setPage("employee")}
        >
          Profile
        </button>

        <button
          className={active === "view-posts" ? "active-employee-nav" : ""}
          onClick={() => setPage("employee-projects")}
        >
          View Posts
        </button>

        <button
          className={active === "my-tasks" ? "active-employee-nav" : ""}
          onClick={() => setPage("employee-tasks")}
        >
          My Tasks
        </button>

        <button
          className={active === "resources" ? "active-employee-nav" : ""}
          onClick={() => setPage("employee-resources")}
        >
          Resources
        </button>

        <button
          className="employee-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default EmployeeNavbar;