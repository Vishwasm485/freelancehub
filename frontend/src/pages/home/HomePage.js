import "./HomePage.css";

import Header from "../../components/home/Header";
import HeroSection from "../../components/home/HeroSection";
import AboutSection from "../../components/home/AboutSection";
import Footer from "../../components/home/Footer";

function HomePage({ setPage }) {

  return (
    <div className="home-page">

      <Header />

      <HeroSection setPage={setPage} />

      <AboutSection />

      <Footer />

    </div>
  );
}

export default HomePage;