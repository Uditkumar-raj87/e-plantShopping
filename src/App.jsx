import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AboutUs from "./components/AboutUs";
import ProductList from "./components/ProductList";
import CartItem from "./components/CartItem";

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
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/plants" element={<ProductList />} />
      <Route path="/cart" element={<CartItem />} />
    </Routes>
  );
}