import LiveClock from "./LiveClock";

function Header() {
  return (
    <header className="header">

      <div>
        <h1 className="logo">FreelanceHub</h1>

        <p className="tagline">
          Connecting Talent With Opportunity
        </p>
      </div>

      <LiveClock />

    </header>
  );
}

export default Header;