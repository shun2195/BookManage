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
  const [currentPage, setCurrentPage] = useState("explore");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    const role = localStorage.getItem("role");
    setCurrentPage(role === "admin" ? "books" : "explore");
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setCurrentPage("explore");
  };

  return (
    <Layout
      onNavigate={setCurrentPage}
      onLogin={() => setShowLogin(true)}
      onRegister={!isLoggedIn ? () => setShowRegister(true) : undefined}
      onLogout={handleLogout}
    >
      {currentPage === "explore" && <ExploreBooks />}
      {currentPage === "stats" && <BookStats />}
      {isLoggedIn && (
        <>
          {currentPage === "books" && <BookManager key="loggedin" />}
          {currentPage === "profile" && <UserProfile />}
          {currentPage === "changepassword" && <ChangePassword />}
          {currentPage === "usermanager" && <UserManager />}
          {currentPage === "borrowmanager" && <BorrowManager />}
          {currentPage === "myborrows" && <MyBorrowedBooks />}
          {currentPage === "moderation" && <Moderation />}
          {currentPage === "system" && <SystemManager />}
        </>
      )}

      {showLogin && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showRegister && (
        <RegisterForm
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onClose={() => setShowRegister(false)}
        />
      )}
    </Layout>
  );
}

export default App;