function Suitcase({ mode }) {

  let image = "/home/suitcase.png";

  if (mode === "login") {
    image = "/home/bag-login.png";
  }

  if (mode === "signup") {
    image = "/home/bag-signup.png";
  }

  return (
    <div className="bag-wrapper">

      <img
        src={image}
        alt="bag"
        className="bag-image"
      />

    </div>
  );
}

export default Suitcase;