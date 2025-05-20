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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("books");
  };

  return (
    <Layout
      onNavigate={setCurrentPage}
      onLogin={() => setIsRegistering(false)}
      onRegister={() => setIsRegistering(true)}
    >
      {isLoggedIn ? (
        <>
          {currentPage === "books" && <BookManager />}
          {currentPage === "profile" && <UserProfile />}
          {currentPage === "stats" && <BookStats />}
          {currentPage === "changepassword" && <ChangePassword />}
          {currentPage === "usermanager" && <UserManager />}
          {currentPage === "borrowmanager" && <BorrowManager />}
          {currentPage === "myborrows" && <MyBorrowedBooks />}
          {currentPage === "moderation" && <Moderation />}
          {currentPage === "system" && <SystemManager />}
        </>
      ) : (
        <>
          <ExploreBooks />
          {isRegistering ? (
            <RegisterForm onSwitchToLogin={() => setIsRegistering(false)} />
          ) : (
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setIsRegistering(true)}
            />
          )}
        </>
      )}
    </Layout>
  );
}

export default App;
