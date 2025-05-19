import React, { useState } from "react";
import BookManager from "./BookManage";
import LoginForm from "./LoginForm";
import Layout from "./components/Layout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return isLoggedIn ? (
    <Layout>
      <BookManager />
    </Layout>
  ) : (
    <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
  );
}

export default App;
