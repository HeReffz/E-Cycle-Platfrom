import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DropPoints from "./pages/DropPoints";
import Estimator from "./pages/Estimator";
import Impact from "./pages/Impact";
import Footer from "./components/Footer";
import PickupSchedule from "./pages/PickupSchedule";
import LoadingScreen from "./components/LoadingScreen";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/dashboard/DasboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import "./styles/auth.css";

// ── Scroll to top on every route change ──────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  const [loading, setLoading] = useState(true);
  const handleLoadingFinish = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <LoadingScreen onFinish={handleLoadingFinish} />}
      <Router>
        <ScrollToTop />
        <div
          className="app"
          style={{ opacity: loading ? 0 : 1, transition: "opacity 0.4s ease" }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/drop-points" element={<DropPoints />} />
              <Route path="/estimator" element={<Estimator />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/pickup" element={<PickupSchedule />} />
              <Route path="/LoginPage" element={<LoginPage />} />
              <Route path="/SignUpPage" element={<SignUpPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
