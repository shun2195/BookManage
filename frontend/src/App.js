import React, { useState } from "react";
import BookManager from "./BookManager";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import BookStats from "./BookStats";
import Layout from "./components/Layout";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import UserManager from "./UserManager";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentPage, setCurrentPage] = useState("books");
  
  if (isLoggedIn) {
    return (
      <Layout onNavigate={setCurrentPage}>
        {currentPage === "books" && <BookManager />}
        {currentPage === "profile" && <UserProfile />}
        {currentPage === "stats" && <BookStats />}
        {currentPage === "changepassword" && <ChangePassword />}
        {currentPage === "usermanager" && <UserManager />}
      </Layout>

    );
  }

  return isRegistering ? (
    <RegisterForm onSwitchToLogin={() => setIsRegistering(false)} />
  ) : (
    <LoginForm
      onLoginSuccess={() => setIsLoggedIn(true)}
      onSwitchToRegister={() => setIsRegistering(true)}
    />
  );
}

export default App;
