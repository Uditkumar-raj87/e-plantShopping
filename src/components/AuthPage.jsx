import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../lib/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate("/checkout");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <Navbar />
      <section className="auth-page">
        <div className="auth-card">
          <p className="section-kicker">Account</p>
          <h2>{mode === "login" ? "Welcome Back" : "Create Your Account"}</h2>
          <p>
            {mode === "login"
              ? "Sign in to complete checkout and view your order history."
              : "Register to save your details and track your orders."}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alex@email.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                minLength={6}
                required
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="cta-button" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <button
            type="button"
            className="text-link-button"
            onClick={() => {
              setMode((prev) => (prev === "login" ? "register" : "login"));
              setError("");
            }}
          >
            {mode === "login"
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </section>
    </main>
  );
}
