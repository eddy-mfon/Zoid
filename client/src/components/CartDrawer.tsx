import { ShoppingBag, X, ArrowDownRight } from "lucide-react";
import { useShop, formatNaira } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { bag, count, total } = useShop();
  const { isLoggedIn } = useAuth();
  const [, navigate] = useLocation();

  if (!isOpen) return null;

  function handleProceedToCheckout() {
    onClose();
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <p className="eyebrow">YOUR SELECTION</p>
            <h3>THE BAG / {count.toString().padStart(2, "0")}</h3>
          </div>
          <button onClick={onClose} aria-label="Close bag">
            <X size={20} />
          </button>
        </div>

        {count > 0 ? (
          <>
            <div className="drawer-items-scroll" style={{ maxHeight: "calc(100vh - 240px)", overflowY: "auto", margin: "16px 0" }}>
              {bag.map((item, idx) => (
                <div className="drawer-item" key={`${item.slug}-${item.size}-${idx}`}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.price}</span>
                    <small>
                      Size {item.size} · Qty {item.quantity}
                    </small>
                    {item.customization && (
                      <small style={{ color: "var(--pink)", fontWeight: 600 }}>
                        Custom: {item.customization}
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-total">
              <span>Subtotal</span>
              <strong>{formatNaira(total)}</strong>
            </div>
            <button
              className="pink-button checkout"
              onClick={handleProceedToCheckout}
            >
              Proceed to checkout <ArrowDownRight size={17} />
            </button>
          </>
        ) : (
          <div className="empty-bag">
            <ShoppingBag size={32} />
            <p>Your bag is waiting for a first selection.</p>
            <button className="line-link" onClick={onClose}>
              Explore the edit <ArrowDownRight size={16} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
