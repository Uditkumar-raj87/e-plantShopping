import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import {
  updateQuantity,
  removeItem,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal
} from "../redux/CartSlice";

export default function CartItem() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartItemCount);
  const totalCost = useSelector(selectCartTotal);

  const checkout = () => {
    alert("Coming Soon");
  };

  const handleIncrement = (id) => {
    dispatch(updateQuantity({ id, change: 1 }));
  };

  const handleDecrement = (id) => {
    dispatch(updateQuantity({ id, change: -1 }));
  };

  return (
    <main className="page-shell">
      <Navbar />

      <section className="cart-page">
        <div className="section-heading">
          <p className="section-kicker">Your Basket</p>
          <h2>Shopping Cart</h2>
        </div>

        <div className="cart-summary-shell">
          <p className="cart-meta">Total Plants: {totalAmount}</p>
          <p className="cart-meta">Grand Total: ${totalCost.toFixed(2)}</p>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => {
              const itemTotal = item.quantity * item.price;

              return (
                <article key={item.id} className="cart-card">
                  <img src={item.image} alt={item.name} />

                  <div className="cart-details">
                    <h3>{item.name}</h3>
                    <p>Unit Price: ${item.price.toFixed(2)}</p>
                    <p className="item-total">Total Cost: ${itemTotal.toFixed(2)}</p>

                    <div className="quantity-row">
                      <button
                        type="button"
                        onClick={() => handleDecrement(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() => dispatch(removeItem(item.id))}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="cart-actions">
          <button type="button" className="cta-button small" onClick={checkout}>
            Checkout
          </button>
          <Link to="/plants" className="outline-button">
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}