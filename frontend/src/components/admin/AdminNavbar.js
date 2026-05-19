import "./AdminNavbar.css";

function AdminNavbar({ setPage, active }) {

  const handleLogout = () => {

    localStorage.removeItem("user");

    setPage("home");

  };

  return (

    <div className="admin-navbar">

      <div className="admin-logo">

        <h2>FreelanceHub</h2>

        <span>Admin Panel</span>

      </div>

      <div className="admin-nav-links">

        <button
          className={active === "dashboard" ? "active-nav" : ""}
          onClick={() => setPage("admin")}
        >
          Dashboard
        </button>

        <button
          className={active === "post-resource" ? "active-nav" : ""}
          onClick={() => setPage("post-resource")}
        >
          Post Resource
        </button>

        <button
          className={active === "view-resources" ? "active-nav" : ""}
          onClick={() => setPage("view-resources")}
        >
          View Resources
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default AdminNavbar;