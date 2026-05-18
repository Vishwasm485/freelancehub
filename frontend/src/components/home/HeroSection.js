import { useState } from "react";

import Suitcase from "./Suitcase";
import LoginPanel from "./LoginPanel";
import SignupPanel from "./SignupPanel";

function HeroSection({setPage}) {

  const [mode, setMode] = useState("closed");

  return (
    <section className="hero-section">

      <img
        src="/home/dots.png"
        alt="dots"
        className="dots"
      />

      <img
        src="/home/glow.png"
        alt="glow"
        className="glow"
      />

      <div className="hero-content">

        <h1 className="hero-title">
          Your Professional Freelancing Workspace
        </h1>

        <p className="hero-subtitle">
          Hire talent, manage projects,
          track payments and collaborate professionally.
        </p>

        <Suitcase mode={mode} />

        <div className="hero-buttons">

          <button
            className="login-btn"
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>

        </div>

        {mode === "login" && (
          <LoginPanel setPage={setPage} />
        )}

        {mode === "signup" && (
          <SignupPanel setPage={setPage} />
        )}

      </div>

    </section>
  );
}

export default HeroSection;