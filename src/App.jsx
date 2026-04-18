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
        <p className="eyebrow">Welcome To</p>
        <h1>Paradise Nursery</h1>
        <p className="subtitle">
          Brighten every corner with hand-picked indoor plants delivered fresh.
        </p>
        <button
          type="button"
          className="cta-button"
          onClick={handleGetStartedClick}
        >
          Get Started
        </button>
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