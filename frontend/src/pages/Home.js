import "./Home.css";

function Home({ setPage }) {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>FreelanceHub</h1>
        <p>Find the Best Freelancers</p>

        <button className="home-btn" onClick={() => setPage("login")}>
          Login
        </button>

        <button className="home-btn" onClick={() => setPage("signup")}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default Home;