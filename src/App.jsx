import { Link, Route, Routes } from "react-router-dom";
import AboutUs from "./components/AboutUs";
import ProductList from "./components/ProductList";
import CartItem from "./components/CartItem";

function LandingPage() {
  return (
    <section className="landing-page">
      <div className="landing-overlay" />
      <div className="landing-content">
        <p className="eyebrow">Welcome To</p>
        <h1>Paradise Nursery</h1>
        <p className="subtitle">
          Brighten every corner with hand-picked indoor plants delivered fresh.
        </p>
        <Link to="/plants" className="cta-button">
          Get Started
        </Link>
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