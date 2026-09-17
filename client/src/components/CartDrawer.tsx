import { ShoppingBag, X, ArrowDownRight } from "lucide-react";
import { useShop, formatNaira } from "@/contexts/ShopContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { bag, count, total } = useShop();

  if (!isOpen) return null;

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
            <div className="drawer-items-scroll">
              {bag.map((item) => (
                <div className="drawer-item" key={`${item.slug}-${item.size}`}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.price}</span>
                    <small>Size {item.size} · Qty {item.quantity}</small>
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
              onClick={() => window.location.assign("/checkout")}
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
