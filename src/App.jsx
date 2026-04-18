import { Suspense, lazy, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AboutUs from "./components/AboutUs";
import ProductList from "./components/ProductList";
import CartItem from "./components/CartItem";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import AuthPage from "./components/AuthPage";
import OrderHistory from "./components/OrderHistory";
import { useAuth } from "./lib/AuthContext";

const BackgroundScene = lazy(() => import("./components/BackgroundScene"));

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function LandingPage() {
  const [showProductList, setShowProductList] = useState(false);
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    setShowProductList(true);
    navigate("/plants");
  };

  return (
    <section className="landing-page background-image">
      <div className="landing-overlay" />
      <div className="home-plants-layer" aria-hidden="true">
        <img
          className="home-plant plant-left"
          src="https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=1000&q=80"
          alt=""
        />
        <img
          className="home-plant plant-right"
          src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80"
          alt=""
        />
        <img
          className="home-plant plant-bottom"
          src="https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1000&q=80"
          alt=""
        />
      </div>
      <div className="landing-content">
        <p className="eyebrow">Curated Botanical Living</p>
        <h1>Paradise Nursery</h1>
        <p className="subtitle">
          Elevate your interior with hand-selected houseplants, premium pots,
          and care guidance tailored for modern homes.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="cta-button"
            onClick={handleGetStartedClick}
          >
            Get Started
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-chip">
            <strong>50K+</strong>
            <span>Plants Delivered</span>
          </div>
          <div className="stat-chip">
            <strong>4.9/5</strong>
            <span>Customer Rating</span>
          </div>
          <div className="stat-chip">
            <strong>24/7</strong>
            <span>Care Support</span>
          </div>
        </div>
        {showProductList && <p className="subtitle">Loading product listing...</p>}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <BackgroundScene />
      </Suspense>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/plants" element={<ProductList />} />
        <Route path="/cart" element={<CartItem />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}