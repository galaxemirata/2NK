import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";


import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Comments from "./components/Comments";
import Book from "./components/Book";
import NairobiMombasa from "./components/NairobiMombasa";
import NairobiIsiolo from "./components/NairobiIsiolo";
import NairobiKaratina from "./components/NairobiKaratina";
import NairobiNanyuki from "./components/NairobiNanyuki";

import MombasaIsiolo from "./components/MombasaIsiolo";
import MombasaKaratina from "./components/MombasaKaratina";
import MombasaNairobi from "./components/MombasaNairobi";
import MombasaNanyuki from "./components/MombasaNanyuki";

import IsioloKaratina from "./components/IsioloKaratina";
import IsioloMombasa from "./components/IsioloMombasa";
import IsioloNairobi from "./components/IsioloNairobi";
import IsioloNanyuki from "./components/IsioloNanyuki";

import KaratinaIsiolo from "./components/KaratinaIsiolo";
import KaratinaMombasa from "./components/KaratinaMombasa";
import KaratinaNairobi from "./components/KaratinaNairobi";
import KaratinaNanyuki from "./components/KaratinaNanyuki";

import NanyukiKaratina from "./components/NanyukiKaratina";
import NanyukiIsiolo from "./components/NanyukiIsiolo";
import NanyukiMombasa from "./components/NanyukiMombasa";
import NanyukiNairobi from "./components/NanyukiNairobi";

import LamuNairobi from "./components/LamuNairobi";
import NairobiLamu from "./components/NairobiLamu";

import Mpesa from "./components/Mpesa";
import AdminDashboard from "./components/AdminDashboard";
import ChatBot from "./components/ChatBot";
import About from "./components/About";
import AdminSignIn from "./components/AdminSignIn";

function App() {
  const [admin, setAdmin] = useState(() => {
    return JSON.parse(localStorage.getItem("admin")) || null;
  });

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    setUser(null);
    window.location.href = "/signin";
  };

const changeProfilePicture = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  // Allow only image files
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image.");
    return;
  }

  // Limit image size to 5MB
  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be less than 5MB.");
    return;
  }

  setUploadingProfile(true);

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const response = await axios.post(
        "https://collins.alwaysdata.net/api/update-profile-pic",
        {
          email: user.email,
          profilePic: reader.result,
        }
      );



      const updatedUser = {
        ...user,
        profilePic: response.data.profilePic,
      };

      // Update React state
      setUser(updatedUser);

      // Update local storage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Update comments
      const comments =
        JSON.parse(localStorage.getItem("comments")) || [];

      const updatedComments = comments.map((comment) =>
        comment.owner === updatedUser.email
          ? {
              ...comment,
              imageUrl: updatedUser.profilePic,
            }
          : comment
      );

      localStorage.setItem(
        "comments",
        JSON.stringify(updatedComments)
      );

      // Update notifications
      const notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

      const updatedNotifications = notifications.map((notification) =>
        notification.from === updatedUser.email
          ? {
              ...notification,
              fromProfilePic: updatedUser.profilePic,
            }
          : notification
      );

      localStorage.setItem(
        "notifications",
        JSON.stringify(updatedNotifications)
      );

      setShowProfileMenu(false);

      alert("✅ Profile picture updated successfully!");

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message || "Server error.");
      } else {
        alert("Unable to connect to the server.");
      }
    } finally {
      setUploadingProfile(false);

      // Allows selecting the same image again
      e.target.value = "";
    }
  };

  reader.readAsDataURL(file);
};
  return (
    <div className="App">
      <Router>

        {/* NAVBAR */}
        <nav className="navbar-custom">

          {/* LEFT */}
          <div className="nav-left">
            <Link to="/" className="logo-link">
              <video
                style={{ borderRadius: "50%" }}
                src="images/elite movers (1).mp4"
                autoPlay
                loop
                muted
                playsInline
                width={80}
              />
            </Link>

            <ChatBot user={user} />
          </div>

          {/* CENTER */}
          <div className="nav-center">
            <h1 id="h1main">ELITE MOVERS SACCO</h1>
          </div>

          {/* MENU WRAPPER FIXED */}
          <div ref={menuRef} className="menu-wrapper">

            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            <div className={`nav-right ${menuOpen ? "show-menu" : ""}`}>

              <Link to="/" className="btn btn-info text-white" style={{ borderRadius: 40 }}>
                Book Now
              </Link>

              <Link to="/about" className="navlink text-info">About</Link>
              <Link to="/comments" className="navlink text-info">Comments</Link>

              {!user ? (
                <Link to="/signin" className="navlink text-info">Log In</Link>
              ) : (
                <div ref={profileRef} style={{ position: "static" }}>

                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: "2px solid red",
                      }}
                    />
                  ) : (
                    <div
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: "50%",
                        background: "red",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

{showProfileMenu && (
  <div
    style={{
      position: "fixed",
      top: "200px",
      right: "200px",
      background: "black",
      padding: "10px",
      borderRadius: "10px",
      minWidth: "220px",
      boxShadow: "0 5px 20px rgba(0,0,0,.3)",
      zIndex: 999999,
    }}
  >
    

    <img
                      src={user.profilePic}
                      alt="Profile"
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: "2px solid red",
                      }}
                    />
                      <p className="text-info mb-2">{user.username}</p>

<button
  className="btn btn-info btn-sm w-100 mb-2"
  disabled={uploadingProfile}
  onClick={() =>
    document.getElementById("profile-upload").click()
  }
>
  {uploadingProfile ? (
    <>
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
      ></span>
      Uploading...
    </>
  ) : (
    "Change Profile Picture"
  )}
</button>

                      <button
                        onClick={logout}
                        className="btn btn-danger btn-sm w-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}

                </div>
              )}

              <Link to="/admin" className="admin-link">Admin</Link>
            </div>
          </div>

          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={changeProfilePicture}
          />

          

        </nav>

        <br /><br /><br />

        <Routes>
          <Route path="/" element={<Book />} />
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/mpesa" element={<Mpesa />} />

          <Route path="/nairobi-karatina" element={<NairobiKaratina />} />
          <Route path="/nairobi-isiolo" element={<NairobiIsiolo />} />
          <Route path="/nairobi-mombasa" element={<NairobiMombasa />} />
          <Route path="/nairobi-nanyuki" element={<NairobiNanyuki />} />
          <Route path="/nairobi-lamu" element={<NairobiLamu />} />

          <Route path="/mombasa-nairobi" element={<MombasaNairobi />} />
          <Route path="/mombasa-nanyuki" element={<MombasaNanyuki />} />
          <Route path="/mombasa-isiolo" element={<MombasaIsiolo />} />
          <Route path="/mombasa-karatina" element={<MombasaKaratina />} />

          <Route path="/isiolo-karatina" element={<IsioloKaratina />} />
          <Route path="/isiolo-mombasa" element={<IsioloMombasa />} />
          <Route path="/isiolo-nairobi" element={<IsioloNairobi />} />
          <Route path="/isiolo-nanyuki" element={<IsioloNanyuki />} />

          <Route path="/karatina-nanyuki" element={<KaratinaNanyuki />} />
          <Route path="/karatina-nairobi" element={<KaratinaNairobi />} />
          <Route path="/karatina-mombasa" element={<KaratinaMombasa />} />
          <Route path="/karatina-isiolo" element={<KaratinaIsiolo />} />

          <Route path="/nanyuki-isiolo" element={<NanyukiIsiolo />} />
          <Route path="/nanyuki-karatina" element={<NanyukiKaratina />} />
          <Route path="/nanyuki-nairobi" element={<NanyukiNairobi />} />
          <Route path="/nanyuki-mombasa" element={<NanyukiMombasa />} />

          <Route path="/comments" element={<Comments />} />
          <Route path="/lamu-nairobi" element={<LamuNairobi />} />

          <Route
            path="/adminsignin"
            element={<AdminSignIn setAdmin={setAdmin} />}
          />

          <Route
            path="/admin"
            element={
              admin ? <AdminDashboard /> : <AdminSignIn setAdmin={setAdmin} />
            }
          />

        </Routes>

      </Router>
    </div>
  );
}

export default App;