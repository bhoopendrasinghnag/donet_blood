import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import handle from "../Connection/LoginConnection.jsx";
import "../CSS/WelcomePage.css";
import Popup from "../PopUP/Popup.jsx";
import locationImage from "../assets/location-find-donation.png";
import calanderImage from "../assets/donation-blood.png";
import bloodIcon from "../assets/blood.png";
import facebook from "../assets/facebook (1).png";
import instagram from "../assets/instagram.png";
import youtube from "../assets/youtube.png";
import logIn from "../assets/login.png";
import user from "../assets/user.png";
import lock from "../assets/lock.png";

export const WelcomePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [popup, setPopup] = useState({ msg: "", type: "" });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    getUserLocation();
  }, []);
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setPopup({ msg: "Geolocation not supported by your browser", type: "error" });
      return;
    }


    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation({ lat, lng });

        // console.log("Latitude:", lat);
        // console.log("Longitude:", lng);
        localStorage.setItem("userLocation", JSON.stringify({ lat, lng }));
      },
      (error) => {
        if (error.code === 1) {
          setPopup({
            msg: "Please allow location access to find nearby blood donors.",
            type: "error"
          });
        }
      })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await handle(formData);
      if (response && response.success) {
        setPopup({ msg: response.message, type: "success" });
        setTimeout(() => navigate("/homePage"), 500);
      } else {
        setPopup({ msg: response.message || "Login failed", type: "error" });
      }
    } catch (error) {
      setPopup({ msg: "Connection error. Is the server running?", type: "error" });
    }
  };

  const [updates] = useState([]);
  const [heroes] = useState([]);

  return (
    <section className="welcome-page-wrapper">
      <Popup
        message={popup.msg}
        type={popup.type}
        onClose={() => setPopup({ msg: "", type: "" })}
      />

      <div className="welcome-container">
        <div className="welcome-card">
          <h1 className="welcome-title">Save Lives,<br />Donate Blood</h1>
          <p className="welcome-subtitle">
            Your small contribution can be someone’s second chance at life.
            Join our blood donation community today.
          </p>
          <div className="welcome-btn-group">
            <button className="get-started-btn" onClick={() => setOpenLogin(true)}>
              Get Started
            </button>
            {/* <p className="reg-prompt">
              Do not have account ? </p> */}
            <Link className="signup-btn" to="/signUp">Sign Up</Link>
          </div>
        </div>
      </div>


      <section className="info-container">
        <div className="info-grid">
          <div className="info-visual">
            <img src={calanderImage} alt="Schedule" />
            <div className="info-text-content">
              <h1>Why Donate Blood?</h1>
              <ul>
                <li>❤️ Save up 3 lives with one donation.</li>
                <li>❤️ Reduce risk of heart disease.</li>
                <li>❤️ Get free health check up.</li>
              </ul>
            </div>
          </div>

          <div className="info-visual">
            <img src={locationImage} alt="Map" />
            <div className="find-donation-center">
              <h2>Find a Donation Center Near You</h2>
              <p>Browse our interactive map to find nearby blood banks and mobile donation drives.</p>
              
              <button className="outline-btn" onClick={() => navigate("/search-map")}>Find Centers</button>
            </div>
          </div>
        </div>
      </section>

      <section className="extra-content">
        <div className="content-grid">
          <div className="news-heroes">
            <div className="news-card">
              <h3>Latest Updates</h3>
              <div className="news-list">
                {updates.length > 0 ? (
                  updates.map((item, index) => (
                    <div className="news-item" key={item._id || index}>
                      <span className="news-date">{item.date}</span>
                      <p>{item.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="loading-text">Loading updates...</p>
                )}
              </div>
              <button className="text-link-btn">View All News →</button>
            </div>

            <div className="donors-card">
              <h3>Community Heroes</h3>
              <div className="hero-list">
                {heroes.length > 0 ? (
                  heroes.map((hero, index) => (
                    <div className="donor-row" key={hero._id || index}>
                      <div className="donor-info">
                        <div className="donor-avatar">
                          {hero.name.charAt(0)}
                        </div>
                        <span>{hero.name}</span>
                      </div>
                      <span className="donation-count">{hero.units} Units</span>
                    </div>
                  ))
                ) : (
                  <p className="loading-text">Loading heroes...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>







      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={bloodIcon} alt="blood" />
            <span > Blood Donation Portal</span>
          </div>
          <div className="footer-col">
            <h4>About Us</h4>
            <ul><li>Our Mission</li><li>Team</li></ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul><li>Help Center</li><li>Careers</li></ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul><li>Contact</li><li>Privacy Policy</li></ul>
          </div>
          <div className="footer-icon">
            <h4>Connect</h4>
            <div className="footer-logo">
              <img alt="" className="social-icons" src={facebook} />
              <img alt="" className="social-icons" src={instagram} />
              <img alt="" className="social-icons" src={youtube} />
            </div>

          </div>
        </div>
        <p className="copyright">© 2026 All rights reserved.</p>
      </footer>






      {/* LOGIN PANEL OVERLAY */}
      <div className={`login-panel ${openLogin ? "active" : ""}`}>
        <div className="login-content">
          {/* <h1 className="site-content">Blood Donation <span>Portal</span>  <span>🩸</span> </h1> */}
          {/* <h2 className="welcome-note">Welcome Back</h2> */}
          {/* <h3 className="save-lives"><span className="save-content">Login to continue saving lives</span> ❤️</h3> */}
          <img src={logIn} alt="Login Logo" className="avatar-circle" />

          <form onSubmit={handleLogin}>

            <div className="input-container-box">
              <img src={user} alt="user" className="inner-icon" />
              <input
                name="email"
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-container-box">
              <img src={lock} alt="lock" className="inner-icon" />
              <input
                name="password"
                type="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>



            <div className="login-options-header">
              <div className="login-options">
                <div className="remambring-things">
                  <label className="remember-me"><input type="checkbox" /> Remember me</label>
                  <a className="remember-note" onClick={(e) => {
                    e.preventDefault();
                    navigate("/forget-Password");
                  }}>
                    Forgot Password?
                  </a>
                </div>

              </div>
              <div className="btn-contenir">
                <button type="submit" className="primary-login-btn">Login</button>
                <button type="button" className="close-btn" onClick={() => setOpenLogin(false)}>Back</button>
              </div>
            </div>




          </form>
        </div>
      </div>
    </section>
  );
};