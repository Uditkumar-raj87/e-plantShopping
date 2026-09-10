import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeItem, selectCartItems, selectCartTotal, updateQuantity } from "../redux/CartSlice";

const FREE_PACKAGING_THRESHOLD = 50;

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const progress = Math.min((total / FREE_PACKAGING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_PACKAGING_THRESHOLD - total, 0);

  return (
    <aside className={`cart-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="cart-drawer-header">
        <div>
          <p className="section-kicker">Your collection</p>
          <h2>Cart</h2>
        </div>
        <button type="button" className="inspector-close drawer-close" onClick={onClose} aria-label="Close cart">x</button>
      </div>
      <div className="shipping-progress">
        <p>{remaining ? `Add $${remaining.toFixed(2)} more for free eco-packaging` : "Free eco-packaging unlocked"}</p>
        <div><span style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="drawer-items">
        {items.length === 0 ? <p className="empty-cart">Your cart is waiting for a little green.</p> : items.map((item) => (
          <article className="drawer-item" key={item.cartKey || item.id}>
            <img src={item.image} alt="" />
            <div>
              <strong>{item.name}</strong>
              {item.pot && <small>{item.pot} pot</small>}
              <span>${item.price.toFixed(2)}</span>
              <div className="drawer-quantity">
                <button type="button" onClick={() => dispatch(updateQuantity({ id: item.cartKey || item.id, change: -1 }))}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => dispatch(updateQuantity({ id: item.cartKey || item.id, change: 1 }))}>+</button>
                <button type="button" className="drawer-remove" onClick={() => dispatch(removeItem(item.cartKey || item.id))}>Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="drawer-footer">
        <div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div>
        <Link to="/cart" className="outline-button" onClick={onClose}>View full cart</Link>
        <Link to="/checkout" className="cta-button" onClick={onClose}>Checkout</Link>
      </div>
    </aside>
  );
}