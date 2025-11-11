import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Films from "./pages/Films";
import FilmDetail from "./pages/FilmDetail";
import CartPage from "./pages/CartPage";
import About from "./pages/About";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import LoginSuccess from "./components/LoginSuccess";
import CheckoutPage from "./pages/CheckoutPage"; // Added import for CheckoutPage

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/films" element={<Films />} />
            <Route path="/film/:id" element={<FilmDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Added route for CheckoutPage */}
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Protected Profile Route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* OAuth redirect handler */}
            <Route path="/login/success" element={<LoginSuccess />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
