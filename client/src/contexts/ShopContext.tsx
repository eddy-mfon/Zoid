/* ZOID Concrete Ritual: the bag is a clear, calm handoff from curation to checkout. */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/catalog";

type BagItem = Product & { size: string; quantity: number };
type ShopContextValue = { bag: BagItem[]; count: number; total: number; addToBag: (product: Product, size?: string, quantity?: number) => void; removeFromBag: (slug: string, size: string) => void; clearBag: () => void };
const ShopContext = createContext<ShopContextValue | null>(null);

function priceValue(price: string) { return Number(price.replace(/[^0-9]/g, "")) || 0; }

export function ShopProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = useState<BagItem[]>([]);
  const count = bag.reduce((total, item) => total + item.quantity, 0);
  const total = bag.reduce((sum, item) => sum + priceValue(item.price) * item.quantity, 0);
  function addToBag(product: Product, size = product.sizes[0], quantity = 1) {
    const qty = Math.max(1, quantity);
    setBag((items) => {
      const existing = items.find((item) => item.slug === product.slug && item.size === size);
      return existing ? items.map((item) => item === existing ? { ...item, quantity: item.quantity + qty } : item) : [...items, { ...product, size, quantity: qty }];
    });
    toast.success(`${product.name} added to your bag`, { description: `${size} · Qty ${qty} · Curated for the ones still rising.` });
  }
  function removeFromBag(slug: string, size: string) { setBag((items) => items.filter((item) => !(item.slug === slug && item.size === size))); }
  function clearBag() { setBag([]); }
  const value = useMemo(() => ({ bag, count, total, addToBag, removeFromBag, clearBag }), [bag, count, total]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
export function useShop() { const value = useContext(ShopContext); if (!value) throw new Error("useShop must be used inside ShopProvider"); return value; }
export type { BagItem };
export const formatNaira = (value: number) => `₦${value.toLocaleString("en-NG")}`;
