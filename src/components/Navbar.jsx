import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartItemCount } from "../redux/CartSlice";
import { useAuth } from "../lib/AuthContext";

export default function Navbar() {
  const itemCount = useSelector(selectCartItemCount);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="brand-wrap">
        <Link to="/" className="brand">
          Paradise Nursery
        </Link>
        <p className="brand-subtitle">Indoor Plant Studio</p>
      </div>

      <nav className="nav-links">
        <Link className="nav-link" to="/">
          Home
        </Link>
        <Link className="nav-link" to="/plants">
          Plants
        </Link>
        <Link to="/cart" className="cart-link" aria-label="Shopping cart">
          Cart
          <span className="cart-count">{itemCount}</span>
        </Link>
        {isAuthenticated ? (
          <>
            <Link className="nav-link" to="/orders">
              Orders
            </Link>
            <button type="button" className="nav-link nav-button" onClick={logout}>
              Logout ({user?.name?.split(" ")[0] || "User"})
            </button>
          </>
        ) : (
          <Link className="nav-link" to="/auth">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}