import "./EmployerNavbar.css";

function EmployerNavbar({ setPage, active }) {

  const logout = () => {
    localStorage.removeItem("user");
    setPage("home");
  };

  return (

    <div className="employer-navbar">

      <div className="employer-logo">

        <h2>FreelanceHub</h2>

        <span>Employer Workspace</span>

      </div>

      <div className="employer-nav-links">

        <button
          className={active === "profile" ? "active-employer-nav" : ""}
          onClick={() => setPage("employer")}
        >
          Profile
        </button>

        <button
          className={active === "post-project" ? "active-employer-nav" : ""}
          onClick={() => setPage("post-project")}
        >
          Post Project
        </button>

        <button
          className={active === "view-posts" ? "active-employer-nav" : ""}
          onClick={() => setPage("view-posts")}
        >
          View Posts
        </button>

        <button
          className={active === "assigned" ? "active-employer-nav" : ""}
          onClick={() => setPage("assigned-tasks")}
        >
          Assigned Tasks
        </button>

        <button
          className="employer-logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default EmployerNavbar;