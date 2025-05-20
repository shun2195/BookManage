import React, { useState } from "react";
import BookManager from "./BookManager";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import BookStats from "./BookStats";
import Layout from "./components/Layout";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import UserManager from "./UserManager";
import BorrowManager from "./BorrowManager";
import MyBorrowedBooks from "./MyBorrowedBooks";
import ExploreBooks from "./ExploreBooks";
import Moderation from "./Moderation";
import SystemManager from "./SystemManager";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentPage, setCurrentPage] = useState("books");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("books");
  };

  return (
    <Layout
      onNavigate={setCurrentPage}
      onLogin={() => setShowLogin(true)}
      onRegister={() => setShowRegister(true)}
    >
      <ExploreBooks />
      {showLogin && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
            <LoginForm
              onLoginSuccess={() => {
                setIsLoggedIn(true);
                setCurrentPage("books");
              }}
              onSwitchToRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            />
          </div>
        </div>
      )}
      {showRegister && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
            <RegisterForm
              onSwitchToLogin={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      )}
    </Layout>

  );
}

export default App;
