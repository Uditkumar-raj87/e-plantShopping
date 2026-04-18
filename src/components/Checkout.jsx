import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { api } from "../lib/api";
import {
  clearCart,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal
} from "../redux/CartSlice";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  zipCode: "",
  country: "",
  paymentMethod: "card",
  cardNumber: "",
  expiry: "",
  cvv: "",
  upiId: ""
};

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartItemCount);
  const subtotal = useSelector(selectCartTotal);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = useMemo(() => (subtotal > 0 ? 8 : 0), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.address ||
      !form.city ||
      !form.zipCode ||
      !form.country
    ) {
      return "Please complete all shipping details.";
    }

    if (form.paymentMethod === "card") {
      if (!form.cardNumber || !form.expiry || !form.cvv) {
        return "Please complete all card payment fields.";
      }
    }

    if (form.paymentMethod === "upi" && !form.upiId) {
      return "Please enter your UPI ID.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add plants before checkout.");
      return;
    }

    const message = validateForm();
    if (message) {
      setError(message);
      return;
    }

    try {
      setError("");
      setIsProcessing(true);

      await api.createPaymentIntent({
        amount: total,
        currency: "usd",
        paymentMethod: form.paymentMethod
      });

      const orderResponse = await api.createOrder({
        items: cartItems,
        totals: {
          subtotal,
          shipping,
          total,
          totalItems
        },
        shipping: {
          fullName: form.fullName,
          email: form.email,
          address: form.address,
          city: form.city,
          zipCode: form.zipCode,
          country: form.country
        },
        paymentMethod: form.paymentMethod
      });

      dispatch(clearCart());
      navigate("/confirmation", {
        state: {
          orderId: `PN-${String(orderResponse.order.id).padStart(6, "0")}`,
          total,
          totalItems,
          paymentMethod: form.paymentMethod,
          fullName: form.fullName,
          email: form.email,
          placedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="checkout-page">
        <div className="section-heading">
          <p className="section-kicker">Secure Checkout</p>
          <h2>Payment & Delivery</h2>
          <p>Complete your order with secure payment and tracked delivery.</p>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Shipping Details</h3>
            <div className="form-grid">
              <label>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@email.com"
                />
              </label>
              <label className="full-width">
                Street Address
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="145 Green Avenue"
                />
              </label>
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                />
              </label>
              <label>
                Zip Code
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  placeholder="560001"
                />
              </label>
              <label className="full-width">
                Country
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="India"
                />
              </label>
            </div>

            <h3>Payment Method</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={form.paymentMethod === "card"}
                  onChange={handleChange}
                />
                Credit / Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={form.paymentMethod === "upi"}
                  onChange={handleChange}
                />
                UPI
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === "cod"}
                  onChange={handleChange}
                />
                Cash on Delivery
              </label>
            </div>

            {form.paymentMethod === "card" && (
              <div className="form-grid payment-grid">
                <label className="full-width">
                  Card Number
                  <input
                    type="text"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="4111 1111 1111 1111"
                  />
                </label>
                <label>
                  Expiry
                  <input
                    type="text"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                  />
                </label>
                <label>
                  CVV
                  <input
                    type="password"
                    name="cvv"
                    value={form.cvv}
                    onChange={handleChange}
                    placeholder="123"
                  />
                </label>
              </div>
            )}

            {form.paymentMethod === "upi" && (
              <div className="form-grid payment-grid">
                <label className="full-width">
                  UPI ID
                  <input
                    type="text"
                    name="upiId"
                    value={form.upiId}
                    onChange={handleChange}
                    placeholder="name@bank"
                  />
                </label>
              </div>
            )}

            {error && <p className="form-error">{error}</p>}

            <div className="checkout-actions">
              <button type="submit" className="cta-button" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Pay Now"}
              </button>
              <Link to="/cart" className="outline-button">
                Back to Cart
              </Link>
            </div>
          </form>

          <aside className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.length === 0 ? (
              <p className="empty-cart">No items in cart.</p>
            ) : (
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-row">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="summary-total-row">
              <span>Items ({totalItems})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-total-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-total-row grand-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}