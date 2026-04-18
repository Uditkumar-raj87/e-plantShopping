import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { api } from "../lib/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="page-shell">
      <Navbar />
      <section className="orders-page">
        <div className="section-heading">
          <p className="section-kicker">Customer Area</p>
          <h2>Order History</h2>
        </div>

        {isLoading && <p className="empty-cart">Loading orders...</p>}
        {!isLoading && error && <p className="form-error">{error}</p>}

        {!isLoading && !error && orders.length === 0 && (
          <div className="empty-cart">
            <p>No previous orders found.</p>
            <Link to="/plants" className="outline-button">
              Shop Plants
            </Link>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-head">
                  <h3>Order #{order.id}</h3>
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Payment:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Total:</strong> ${Number(order.totals?.total || 0).toFixed(2)}
                </p>
                <div className="summary-items">
                  {(order.items || []).map((item) => (
                    <div className="summary-row" key={`${order.id}-${item.id}`}>
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
