import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function OrderConfirmation() {
  const { state } = useLocation();

  const orderId = state?.orderId ?? "PN-000000";
  const total = state?.total ?? 0;
  const totalItems = state?.totalItems ?? 0;
  const paymentMethod = state?.paymentMethod ?? "card";
  const fullName = state?.fullName ?? "Customer";
  const placedAt = state?.placedAt ? new Date(state.placedAt).toLocaleString() : "Just now";

  const paymentLabel =
    paymentMethod === "upi"
      ? "UPI"
      : paymentMethod === "cod"
        ? "Cash on Delivery"
        : "Credit / Debit Card";

  return (
    <main className="page-shell">
      <Navbar />

      <section className="confirmation-page">
        <div className="confirmation-card">
          <p className="section-kicker">Order Confirmed</p>
          <h2>Thank You, {fullName}!</h2>
          <p>
            Your order has been placed successfully. A confirmation email has
            been sent with shipping updates.
          </p>

          <div className="confirmation-meta">
            <p>
              <strong>Order ID:</strong> {orderId}
            </p>
            <p>
              <strong>Placed:</strong> {placedAt}
            </p>
            <p>
              <strong>Items:</strong> {totalItems}
            </p>
            <p>
              <strong>Payment:</strong> {paymentLabel}
            </p>
            <p>
              <strong>Total Paid:</strong> ${Number(total).toFixed(2)}
            </p>
          </div>

          <div className="confirmation-actions">
            <Link to="/plants" className="cta-button">
              Continue Shopping
            </Link>
            <Link to="/about" className="outline-button">
              About Paradise Nursery
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}