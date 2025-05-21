import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import BookDetail from "./BookDetail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Layout
        onLogin={() => setShowLogin(true)}
        onRegister={!isLoggedIn ? () => setShowRegister(true) : undefined}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<ExploreBooks />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/stats" element={<BookStats />} />
          <Route path="/books" element={<BookManager />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/usermanager" element={<UserManager />} />
          <Route path="/borrowmanager" element={<BorrowManager />} />
          <Route path="/myborrows" element={<MyBorrowedBooks />} />
          <Route path="/moderation" element={<Moderation />} />
          <Route path="/system" element={<SystemManager />} />
        </Routes>

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
    </Router>
  );
}

export default App;