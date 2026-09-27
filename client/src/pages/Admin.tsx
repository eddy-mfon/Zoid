/* ZOID Admin Dashboard — High-Aesthetic Management Console (Frontend Only) */
import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { products, type Product } from "@/lib/catalog";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Eye,
  Flame,
  Layers,
  LayoutGrid,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  AlertTriangle,
  X,
  Clock,
  Truck,
  CheckCircle2,
  Save,
  Upload,
  Image as ImageIcon,
  Minus,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const MARK = "/zoid-logo.svg";

// ── TYPES & INTERFACES ────────────────────────────────────────────────────────
interface SalesOrderItem {
  productSlug: string;
  productName: string;
  category: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
}

interface SalesOrder {
  orderId: string;
  date: string;
  customerName: string;
  status: "Processing" | "In Transit" | "Delivered";
  items: SalesOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  formattedTotal: string;
  deliveryAddress: string;
}

// Initial Mock Orders (Frontend State)
const INITIAL_ORDERS: SalesOrder[] = [
  {
    orderId: "ZD-A7K2M1",
    date: "2026-09-24",
    customerName: "Tunde Okonkwo",
    status: "Processing",
    items: [
      {
        productSlug: "ac-milan-2526",
        productName: "AC Milan / 25—26",
        category: "CURATED JERSEY",
        size: "L",
        quantity: 1,
        unitPrice: 58500,
        lineTotal: 58500,
        image: "/manus-storage/ac-milan-2526_b917ea29.jpg",
      },
    ],
    subtotal: 58500,
    deliveryFee: 3500,
    total: 62000,
    formattedTotal: "₦62,000",
    deliveryAddress: "12 Adeola Odeku St, Victoria Island, Lagos",
  },
  {
    orderId: "ZD-B3P9N4",
    date: "2026-09-23",
    customerName: "Amina Bello",
    status: "In Transit",
    items: [
      {
        productSlug: "barcelona-away",
        productName: "Barcelona / Away",
        category: "ARCHIVE EDITION",
        size: "M",
        quantity: 1,
        unitPrice: 62000,
        lineTotal: 62000,
        image: "/manus-storage/barcelona_9a244f02.jpg",
      },
      {
        productSlug: "manchester-united-2526",
        productName: "Manchester United / 25—26",
        category: "CURATED JERSEY",
        size: "XL",
        quantity: 1,
        unitPrice: 60500,
        lineTotal: 60500,
        image: "/manus-storage/manchester-united-2526_2aca202f.jpg",
      },
    ],
    subtotal: 122500,
    deliveryFee: 3500,
    total: 126000,
    formattedTotal: "₦126,000",
    deliveryAddress: "5 Ajose Adeogun St, Victoria Island, Lagos",
  },
  {
    orderId: "ZD-C6R1Q8",
    date: "2026-09-22",
    customerName: "Chidi Eze",
    status: "Delivered",
    items: [
      {
        productSlug: "liverpool-2526",
        productName: "Liverpool / 25—26",
        category: "HERITAGE DROP",
        size: "L",
        quantity: 2,
        unitPrice: 61500,
        lineTotal: 123000,
        image: "/manus-storage/liverpool-2526_78e5ffc7.jpg",
      },
    ],
    subtotal: 123000,
    deliveryFee: 3500,
    total: 126500,
    formattedTotal: "₦126,500",
    deliveryAddress: "38 Ozumba Mbadiwe Ave, Lekki Phase 1, Lagos",
  },
  {
    orderId: "ZD-D4T7W5",
    date: "2026-09-21",
    customerName: "Fatima Suleiman",
    status: "Delivered",
    items: [
      {
        productSlug: "inter-milan-2526",
        productName: "Inter Milan / 25—26",
        category: "CURATED JERSEY",
        size: "M",
        quantity: 1,
        unitPrice: 59500,
        lineTotal: 59500,
        image: "/manus-storage/inter-milan-2526_65e7cadc.jpg",
      },
      {
        productSlug: "newcastle-2526",
        productName: "Newcastle / 25—26",
        category: "HERITAGE DROP",
        size: "L",
        quantity: 1,
        unitPrice: 57500,
        lineTotal: 57500,
        image: "/manus-storage/newcastle-2526_802db4b3.jpg",
      },
    ],
    subtotal: 117000,
    deliveryFee: 3500,
    total: 120500,
    formattedTotal: "₦120,500",
    deliveryAddress: "21 Awolowo Rd, Ikoyi, Lagos",
  },
  {
    orderId: "ZD-E9S3L2",
    date: "2026-09-20",
    customerName: "Emeka Okafor",
    status: "Delivered",
    items: [
      {
        productSlug: "manchester-city-2324",
        productName: "Manchester City / 23—24",
        category: "ARCHIVE EDITION",
        size: "XL",
        quantity: 1,
        unitPrice: 55000,
        lineTotal: 55000,
        image: "/manus-storage/manchester-city-2324_a2693d41.jpg",
      },
    ],
    subtotal: 55000,
    deliveryFee: 3500,
    total: 58500,
    formattedTotal: "₦58,500",
    deliveryAddress: "7 Bisola Durosinmi-Etti St, Lekki Phase 1, Lagos",
  },
];

// Curated stock images presets
const imagePresets = [
  { label: "AC Milan 25-26", url: "/manus-storage/ac-milan-2526_b917ea29.jpg" },
  { label: "Barcelona Away", url: "/manus-storage/barcelona_9a244f02.jpg" },
  { label: "Inter Milan", url: "/manus-storage/inter-milan-2526_65e7cadc.jpg" },
  { label: "Liverpool 25-26", url: "/manus-storage/liverpool-2526_78e5ffc7.jpg" },
  { label: "Man United 25-26", url: "/manus-storage/manchester-united-2526_2aca202f.jpg" },
  { label: "Brazil 1998", url: "/jerseys/National/Brazil 1998 home vintage jersey.jpg" },
  { label: "Japan 2026 Special", url: "/jerseys/National/Japan 26 WCC.jpg" },
  { label: "ZOID Gym Set Detail", url: "/manus-storage/zoid-jersey-detail_0ef688bb.jpg" },
];

/* ── Custom Status Dropdown Component (No white space / fully styled) ── */
function StatusDropdown({
  currentStatus,
  onSelect,
}: {
  currentStatus: "Processing" | "In Transit" | "Delivered";
  onSelect: (status: "Processing" | "In Transit" | "Delivered") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const config = {
    Processing: {
      color: "#e7a619",
      bg: "rgba(231,166,25,0.12)",
      border: "rgba(231,166,25,0.35)",
      icon: <Clock size={12} />,
    },
    "In Transit": {
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.12)",
      border: "rgba(59,130,246,0.35)",
      icon: <Truck size={12} />,
    },
    Delivered: {
      color: "#29a36a",
      bg: "rgba(41,163,106,0.12)",
      border: "rgba(41,163,106,0.35)",
      icon: <CheckCircle2 size={12} />,
    },
  }[currentStatus];

  const options: Array<"Processing" | "In Transit" | "Delivered"> = ["Processing", "In Transit", "Delivered"];

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: config.bg,
          color: config.color,
          border: `1px solid ${config.border}`,
          borderRadius: 4,
          padding: "5px 9px",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        {config.icon}
        <span>{currentStatus.toUpperCase()}</span>
        <ChevronDown size={12} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 4px)",
              background: "#161616",
              border: "1px solid #2e2e2e",
              borderRadius: 6,
              padding: 4,
              boxShadow: "0 12px 32px rgba(0,0,0,0.8)",
              zIndex: 50,
              minWidth: 140,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {options.map((opt) => {
              const isSelected = opt === currentStatus;
              const optColor = opt === "Processing" ? "#e7a619" : opt === "In Transit" ? "#3b82f6" : "#29a36a";
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onSelect(opt);
                    setIsOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    border: "none",
                    cursor: "pointer",
                    background: isSelected ? "rgba(255,255,255,0.08)" : "transparent",
                    color: isSelected ? "#fff" : optColor,
                    textAlign: "left",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ color: optColor }}>{opt.toUpperCase()}</span>
                  {isSelected && <Check size={12} color="var(--pink)" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Admin() {
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [stockStatusFilter, setStockStatusFilter] = useState<"all" | "in-stock" | "low-stock" | "out-of-stock">("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | "Processing" | "In Transit" | "Delivered">("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"inventory" | "add" | "sales">("inventory");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // New product form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("CURATED JERSEY");
  const [newPriceAmount, setNewPriceAmount] = useState("55000");
  const [newImage, setNewImage] = useState("/manus-storage/ac-milan-2526_b917ea29.jpg");
  const [imageInputMode, setImageInputMode] = useState<"upload" | "preset" | "url">("upload");
  const [newTone, setNewTone] = useState("Red / Black");
  const [newDetails, setNewDetails] = useState("");
  const [newIsBestseller, setNewIsBestseller] = useState(false);
  const [newIsSpecial, setNewIsSpecial] = useState(false);

  // Size & Stock Builder State
  const [sizeEntries, setSizeEntries] = useState<Array<{ size: string; stock: number }>>([
    { size: "M", stock: 5 },
    { size: "L", stock: 8 },
    { size: "XL", stock: 5 },
  ]);
  const [customSizeName, setCustomSizeName] = useState("");
  const [customSizeStock, setCustomSizeStock] = useState("5");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── INVENTORY ANALYTICS ──────────────────────────────────────────
  const analytics = useMemo(() => {
    let totalItems = catalog.length;
    let totalUnits = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let bestsellerCount = 0;
    let specialCount = 0;

    catalog.forEach((p) => {
      const units = Object.values(p.stock).reduce((a, b) => a + b, 0);
      const numericPrice = Number(p.price.replace(/[^0-9]/g, "")) || 0;
      totalUnits += units;
      totalValue += units * numericPrice;
      if (units === 0) outOfStockCount++;
      else if (units <= 5) lowStockCount++;

      if (p.isBestseller) bestsellerCount++;
      if (p.isSpecial) specialCount++;
    });

    return { totalItems, totalUnits, totalValue, lowStockCount, outOfStockCount, bestsellerCount, specialCount };
  }, [catalog]);

  // ── SALES ANALYTICS ──────────────────────────────────────────────
  const salesAnalytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const processingCount = orders.filter((o) => o.status === "Processing").length;
    const inTransitCount = orders.filter((o) => o.status === "In Transit").length;
    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

    return {
      totalRevenue,
      formattedRevenue: `₦${totalRevenue.toLocaleString("en-NG")}`,
      totalOrders,
      averageOrderValue,
      formattedAvgOrderValue: `₦${averageOrderValue.toLocaleString("en-NG")}`,
      processingCount,
      inTransitCount,
      deliveredCount,
    };
  }, [orders]);

  // ── FILTERED CATALOG ─────────────────────────────────────────────
  const filteredCatalog = useMemo(() => {
    return catalog.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategoryFilter === "All" || p.category === selectedCategoryFilter;

      const totalUnits = Object.values(p.stock).reduce((a, b) => a + b, 0);
      let matchesStock = true;
      if (stockStatusFilter === "in-stock") matchesStock = totalUnits > 5;
      if (stockStatusFilter === "low-stock") matchesStock = totalUnits > 0 && totalUnits <= 5;
      if (stockStatusFilter === "out-of-stock") matchesStock = totalUnits === 0;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [catalog, searchQuery, selectedCategoryFilter, stockStatusFilter]);

  // ── FILTERED ORDERS ──────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      const matchesSearch =
        !orderSearchQuery ||
        o.orderId.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.items.some((item) => item.productName.toLowerCase().includes(orderSearchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // ── HANDLERS ─────────────────────────────────────────────────────
  function handleStockChange(slug: string, size: string, newCount: number) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          return { ...p, stock: { ...p.stock, [size]: Math.max(0, newCount) } };
        }
        return p;
      })
    );
    toast.success(`Size ${size} stock updated to ${newCount}`);
  }

  function handlePriceAmountChange(slug: string, amount: string) {
    const numeric = amount.replace(/[^0-9]/g, "");
    const formatted = numeric ? `₦${Number(numeric).toLocaleString("en-NG")}` : "₦0";
    setCatalog((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, price: formatted } : p))
    );
    toast.success("Price updated");
  }

  function toggleBestseller(slug: string) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const nextState = !p.isBestseller;
          toast.success(nextState ? `Marked as Bestseller` : `Removed Bestseller tag`);
          return { ...p, isBestseller: nextState };
        }
        return p;
      })
    );
  }

  function toggleSpecial(slug: string) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const nextState = !p.isSpecial;
          toast.success(nextState ? `Marked as Special Kit` : `Removed Special Kit tag`);
          return { ...p, isSpecial: nextState };
        }
        return p;
      })
    );
  }

  function handleAddSizeToExisting(slug: string, size: string, stock: number = 5) {
    if (!size.trim()) return;
    const normalized = size.trim().toUpperCase();
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug && !p.sizes.includes(normalized)) {
          return {
            ...p,
            sizes: [...p.sizes, normalized],
            stock: { ...p.stock, [normalized]: stock },
          };
        }
        return p;
      })
    );
    toast.success(`Size ${normalized} added with initial stock of ${stock}`);
  }

  function handleRemoveSize(slug: string, size: string) {
    setCatalog((prev) =>
      prev.map((p) => {
        if (p.slug === slug) {
          const newSizes = p.sizes.filter((s) => s !== size);
          const newStock = { ...p.stock };
          delete newStock[size];
          return { ...p, sizes: newSizes, stock: newStock };
        }
        return p;
      })
    );
    toast.success(`Size ${size} removed`);
  }

  function handleDelete(slug: string, name: string) {
    if (confirm(`Remove "${name}" from storefront live catalog?`)) {
      setCatalog((prev) => prev.filter((p) => p.slug !== slug));
      toast.success(`${name} removed from storefront`);
    }
  }

  function handleUpdateOrderStatus(orderId: string, newStatus: "Processing" | "In Transit" | "Delivered") {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order ${orderId} status set to ${newStatus}`);
  }

  function toggleOrderExpanded(orderId: string) {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  }

  // Handle Image File Upload via FileReader
  function handleImageFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      if (typeof loadEvent.target?.result === "string") {
        setNewImage(loadEvent.target.result);
        toast.success("Image uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  }

  // Size & Stock Builder Handlers
  function handleAddSizeEntry() {
    const sz = customSizeName.trim().toUpperCase();
    if (!sz) {
      toast.error("Please enter a size name (e.g. S, M, XL, 2XL)");
      return;
    }
    if (sizeEntries.some((e) => e.size === sz)) {
      toast.error(`Size ${sz} is already added`);
      return;
    }
    const count = parseInt(customSizeStock) || 0;
    setSizeEntries([...sizeEntries, { size: sz, stock: count }]);
    setCustomSizeName("");
    setCustomSizeStock("5");
    toast.success(`Size ${sz} with ${count} stock added`);
  }

  function handleUpdateSizeEntryStock(sizeName: string, newStock: number) {
    setSizeEntries((prev) =>
      prev.map((e) => (e.size === sizeName ? { ...e, stock: Math.max(0, newStock) } : e))
    );
  }

  function handleRemoveSizeEntry(sizeName: string) {
    setSizeEntries((prev) => prev.filter((e) => e.size !== sizeName));
  }

  function handleApplyPreset(preset: "standard" | "extended" | "one") {
    if (preset === "standard") {
      setSizeEntries([
        { size: "M", stock: 5 },
        { size: "L", stock: 8 },
        { size: "XL", stock: 5 },
      ]);
    } else if (preset === "extended") {
      setSizeEntries([
        { size: "S", stock: 4 },
        { size: "M", stock: 8 },
        { size: "L", stock: 10 },
        { size: "XL", stock: 6 },
        { size: "XXL", stock: 3 },
      ]);
    } else {
      setSizeEntries([{ size: "ONE SIZE", stock: 12 }]);
    }
    toast.success("Preset applied");
  }

  function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (sizeEntries.length === 0) {
      toast.error("Please add at least one size with stock quantity");
      return;
    }

    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const formattedPrice = `₦${Number(newPriceAmount.replace(/[^0-9]/g, "") || 0).toLocaleString("en-NG")}`;

    const sizesList = sizeEntries.map((e) => e.size);
    const stockMap: Record<string, number> = {};
    sizeEntries.forEach((e) => {
      stockMap[e.size] = e.stock;
    });

    const newProduct: Product = {
      slug,
      name: newName.trim(),
      category: newCategory,
      price: formattedPrice,
      image: newImage,
      gallery: [{ label: "Front", image: newImage, treatment: "front" }],
      tone: newTone,
      style: newCategory.includes("GYM") ? "Gym Kit" : "Jersey",
      color: "Black",
      sizes: sizesList,
      stock: stockMap,
      fit: "True to size",
      fitNote: "Choose your usual size for a relaxed match-day fit.",
      details: newDetails.trim() || "Curated piece from the ZOID archive.",
      delivery: "Delivered in 2 weeks",
      isBestseller: newIsBestseller,
      isSpecial: newIsSpecial,
    };

    setCatalog([newProduct, ...catalog]);
    toast.success(`${newName} published to storefront!`);
    setNewName("");
    setNewDetails("");
    setNewIsBestseller(false);
    setNewIsSpecial(false);
    setSizeEntries([
      { size: "M", stock: 5 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 5 },
    ]);
    setActiveTab("inventory");
  }

  return (
    <main
      className="zoid-shell"
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#f4f0ea",
        position: "relative",
      }}
    >
      {/* ── TOP ADMIN HEADER ────────────────────────────────────────── */}
      <header
        style={{
          height: 60,
          background: "rgba(14, 14, 14, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0 clamp(16px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 60,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <img src={MARK} alt="ZOID" style={{ height: 18 }} />
            <span style={{ fontFamily: "Anton", fontSize: 18, letterSpacing: "0.16em", color: "#fff" }}>ZOID</span>
          </Link>
          <span style={{ height: 14, width: 1, background: "rgba(255,255,255,0.14)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#ded8d0",
              }}
            >
              ADMIN DASHBOARD
            </span>
            <span
              style={{
                fontSize: 9,
                background: "rgba(231,25,75,0.12)",
                border: "1px solid rgba(231,25,75,0.4)",
                color: "var(--pink)",
                padding: "2px 7px",
                borderRadius: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              STORE MANAGER
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/collection"
            className="ghost-button"
            style={{
              fontSize: 10,
              padding: "6px 12px",
              height: 32,
              gap: 5,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Eye size={13} /> View Storefront
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 10,
              padding: "6px 12px",
              height: 32,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#ded8d0",
              borderRadius: 4,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={13} /> Exit
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTAINER ────────────────────────────────────────── */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "28px clamp(16px, 4vw, 40px) 80px" }}>
        {/* ── TOP KPI CARDS (Clearer subtitle contrast & high readability) ── */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {/* Card 1: Revenue */}
          <div
            style={{
              background: "linear-gradient(145deg, rgba(26,26,26,0.7) 0%, rgba(14,14,14,0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              padding: "18px 20px",
              borderRadius: 8,
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#aaa69d", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                TOTAL REVENUE
              </span>
              <DollarSign size={16} color="var(--pink)" />
            </div>
            <strong style={{ fontFamily: "Anton", fontSize: 26, color: "var(--pink)", display: "block", letterSpacing: "0.02em" }}>
              {salesAnalytics.formattedRevenue}
            </strong>
            <span style={{ fontSize: 11, color: "#ded8d0", marginTop: 4, display: "block", fontWeight: 500 }}>
              {salesAnalytics.totalOrders} total store orders recorded
            </span>
          </div>

          {/* Card 2: Catalog Products */}
          <div
            style={{
              background: "linear-gradient(145deg, rgba(26,26,26,0.7) 0%, rgba(14,14,14,0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              padding: "18px 20px",
              borderRadius: 8,
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#aaa69d", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                LIVE CATALOG
              </span>
              <PackageCheck size={16} color="#3b82f6" />
            </div>
            <strong style={{ fontFamily: "Anton", fontSize: 26, color: "#fff", display: "block", letterSpacing: "0.02em" }}>
              {analytics.totalItems} Items
            </strong>
            <span style={{ fontSize: 11, color: "#ded8d0", marginTop: 4, display: "block", fontWeight: 500 }}>
              {analytics.bestsellerCount} Bestsellers · {analytics.specialCount} Special Kits
            </span>
          </div>

          {/* Card 3: Stock Units */}
          <div
            style={{
              background: "linear-gradient(145deg, rgba(26,26,26,0.7) 0%, rgba(14,14,14,0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              padding: "18px 20px",
              borderRadius: 8,
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#aaa69d", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                UNITS IN STOCK
              </span>
              <Layers size={16} color="#29a36a" />
            </div>
            <strong style={{ fontFamily: "Anton", fontSize: 26, color: "#29a36a", display: "block", letterSpacing: "0.02em" }}>
              {analytics.totalUnits} Units
            </strong>
            <span style={{ fontSize: 11, color: "#ded8d0", marginTop: 4, display: "block", fontWeight: 500 }}>
              Est. inventory value: ₦{analytics.totalValue.toLocaleString("en-NG")}
            </span>
          </div>

          {/* Card 4: Low Stock Alert */}
          <div
            style={{
              background: analytics.lowStockCount > 0 ? "rgba(231,166,25,0.08)" : "linear-gradient(145deg, rgba(26,26,26,0.7) 0%, rgba(14,14,14,0.9) 100%)",
              border: analytics.lowStockCount > 0 ? "1px solid rgba(231,166,25,0.35)" : "1px solid rgba(255,255,255,0.09)",
              padding: "18px 20px",
              borderRadius: 8,
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#aaa69d", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                STOCK ALERTS
              </span>
              <AlertTriangle size={16} color={analytics.lowStockCount > 0 ? "#e7a619" : "#888"} />
            </div>
            <strong style={{ fontFamily: "Anton", fontSize: 26, color: analytics.lowStockCount > 0 ? "#e7a619" : "#fff", display: "block", letterSpacing: "0.02em" }}>
              {analytics.lowStockCount} Low
            </strong>
            <span style={{ fontSize: 11, color: "#ded8d0", marginTop: 4, display: "block", fontWeight: 500 }}>
              {analytics.outOfStockCount} completely sold out variants
            </span>
          </div>
        </section>

        {/* ── SLEEK TABS NAVIGATION ─────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: 14,
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Tab Selector */}
          <div
            style={{
              display: "flex",
              background: "rgba(18,18,18,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6,
              padding: 3,
              gap: 2,
            }}
          >
            {[
              { id: "inventory", label: "Catalog Inventory", count: catalog.length, icon: <LayoutGrid size={14} /> },
              { id: "add", label: "Add Product", icon: <Plus size={14} /> },
              { id: "sales", label: "Orders & Sales", count: orders.length, icon: <ShoppingBag size={14} /> },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    position: "relative",
                    padding: "7px 16px",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    background: active ? "var(--pink)" : "transparent",
                    color: active ? "#fff" : "#888",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      style={{
                        fontSize: 9,
                        background: active ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.08)",
                        color: active ? "#fff" : "#aaa",
                        padding: "1px 6px",
                        borderRadius: 10,
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: 10, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ZOID LAGOS CONSOLE • LIVE STORE CONTROL
          </span>
        </div>

        {/* ── TAB 1: INVENTORY MANAGEMENT ───────────────────────────── */}
        {activeTab === "inventory" && (
          <div>
            {/* Filter & Search Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(18,18,18,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "12px 16px",
                borderRadius: 8,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              {/* Search */}
              <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: 11, color: "#666" }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog by name, category, tone..."
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 34px",
                    background: "#141414",
                    border: "1px solid #282828",
                    color: "#fff",
                    fontSize: 12,
                    borderRadius: 4,
                    outline: "none",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{ position: "absolute", right: 8, top: 8, color: "#888", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Select */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                style={{
                  background: "#141414",
                  border: "1px solid #282828",
                  color: "#fff",
                  padding: "8px 12px",
                  fontSize: 11,
                  borderRadius: 4,
                  outline: "none",
                }}
              >
                <option value="All">All Categories</option>
                <option value="CURATED JERSEY">CURATED JERSEY</option>
                <option value="ARCHIVE EDITION">ARCHIVE EDITION</option>
                <option value="GYM KITS">GYM KITS</option>
                <option value="SPECIAL KIT">SPECIAL KIT</option>
                <option value="HERITAGE DROP">HERITAGE DROP</option>
                <option value="NATIONAL TEAM">NATIONAL TEAM</option>
              </select>

              {/* Stock Filter Chips */}
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { id: "all", label: "All" },
                  { id: "in-stock", label: "In Stock" },
                  { id: "low-stock", label: "Low (≤5)" },
                  { id: "out-of-stock", label: "Out of Stock" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStockStatusFilter(st.id as any)}
                    style={{
                      padding: "6px 10px",
                      fontSize: 10,
                      borderRadius: 4,
                      background: stockStatusFilter === st.id ? "rgba(231,25,75,0.15)" : "#141414",
                      border: stockStatusFilter === st.id ? "1px solid var(--pink)" : "1px solid #242424",
                      color: stockStatusFilter === st.id ? "var(--pink)" : "#888",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards List */}
            <div style={{ display: "grid", gap: 10 }}>
              {filteredCatalog.map((product) => {
                const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
                const isExpanded = editingSlug === product.slug;

                return (
                  <div
                    key={product.slug}
                    style={{
                      background: "rgba(18, 18, 18, 0.8)",
                      border: isExpanded ? "1px solid var(--pink)" : "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: 8,
                      overflow: "hidden",
                      transition: "border-color 0.2s ease, background 0.2s ease",
                    }}
                  >
                    {/* Main Row */}
                    <div
                      style={{
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: 48,
                          height: 56,
                          objectFit: "cover",
                          borderRadius: 4,
                          background: "#0c0c0c",
                          flexShrink: 0,
                        }}
                      />

                      {/* Product Name & Category */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                            {product.category}
                          </span>
                          <span style={{ color: "#444" }}>·</span>
                          <span style={{ fontSize: 10, color: "#888" }}>{product.tone}</span>
                        </div>
                        <h4 style={{ fontFamily: "Anton", fontSize: 17, margin: 0, color: "#fff", letterSpacing: "0.02em" }}>
                          {product.name}
                        </h4>
                      </div>

                      {/* Price Editor */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#141414",
                            border: "1px solid #282828",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <span style={{ padding: "4px 8px", color: "var(--pink)", fontWeight: 700, fontSize: 12, background: "#181818" }}>
                            ₦
                          </span>
                          <input
                            value={product.price.replace(/[^0-9,]/g, "")}
                            onChange={(e) => handlePriceAmountChange(product.slug, e.target.value)}
                            title="Edit price"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#fff",
                              padding: "4px 8px",
                              fontSize: 12,
                              width: 85,
                              outline: "none",
                              fontWeight: 600,
                            }}
                          />
                        </div>
                      </div>

                      {/* Badge Toggles */}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => toggleBestseller(product.slug)}
                          style={{
                            padding: "4px 8px",
                            fontSize: 9,
                            borderRadius: 4,
                            background: product.isBestseller ? "rgba(231,25,75,0.18)" : "transparent",
                            border: product.isBestseller ? "1px solid var(--pink)" : "1px solid #282828",
                            color: product.isBestseller ? "#fff" : "#888",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            cursor: "pointer",
                            fontWeight: product.isBestseller ? 700 : 400,
                          }}
                        >
                          <Flame size={11} color={product.isBestseller ? "var(--pink)" : "#666"} />
                          {product.isBestseller ? "Bestseller" : "Mark Hot"}
                        </button>

                        <button
                          onClick={() => toggleSpecial(product.slug)}
                          style={{
                            padding: "4px 8px",
                            fontSize: 9,
                            borderRadius: 4,
                            background: product.isSpecial ? "rgba(168,85,247,0.18)" : "transparent",
                            border: product.isSpecial ? "1px solid #a855f7" : "1px solid #282828",
                            color: product.isSpecial ? "#fff" : "#888",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            cursor: "pointer",
                            fontWeight: product.isSpecial ? 700 : 400,
                          }}
                        >
                          <Sparkles size={11} color={product.isSpecial ? "#a855f7" : "#666"} />
                          {product.isSpecial ? "Special" : "Mark Special"}
                        </button>
                      </div>

                      {/* Compact Stock by Size */}
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                          background: "#141414",
                          padding: "6px 10px",
                          borderRadius: 4,
                          border: "1px solid #242424",
                        }}
                      >
                        {product.sizes.map((sz) => (
                          <div key={sz} style={{ textAlign: "center" }}>
                            <span style={{ display: "block", fontSize: 8, color: "#888", fontWeight: 700 }}>{sz}</span>
                            <input
                              type="number"
                              min="0"
                              value={product.stock[sz] ?? 0}
                              onChange={(e) => handleStockChange(product.slug, sz, parseInt(e.target.value) || 0)}
                              style={{
                                width: 34,
                                padding: "2px 0",
                                background: "#0c0c0c",
                                border: "1px solid #2a2a2a",
                                color: (product.stock[sz] ?? 0) === 0 ? "var(--pink)" : "#fff",
                                textAlign: "center",
                                fontSize: 11,
                                borderRadius: 3,
                                outline: "none",
                                fontWeight: 700,
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Stock Pill */}
                      <div style={{ minWidth: 80, textAlign: "right" }}>
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 8,
                            padding: "3px 7px",
                            borderRadius: 3,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            background: totalStock > 5 ? "rgba(41,163,106,0.12)" : totalStock > 0 ? "rgba(231,166,25,0.12)" : "rgba(231,25,75,0.12)",
                            color: totalStock > 5 ? "#29a36a" : totalStock > 0 ? "#e7a619" : "var(--pink)",
                          }}
                        >
                          {totalStock > 5 ? "IN STOCK" : totalStock > 0 ? "LOW STOCK" : "SOLD OUT"}
                        </span>
                        <span style={{ display: "block", color: "#888", fontSize: 9, marginTop: 2 }}>{totalStock} units</span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => setPreviewProduct(product)}
                          style={{
                            border: "1px solid #282828",
                            background: "#161616",
                            color: "#aaa",
                            padding: "6px 8px",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          title="Preview Product"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => setEditingSlug(isExpanded ? null : product.slug)}
                          style={{
                            border: "1px solid #282828",
                            background: isExpanded ? "var(--pink)" : "#161616",
                            color: isExpanded ? "#fff" : "#ccc",
                            padding: "6px 10px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                          }}
                        >
                          Sizes & Stock
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug, product.name)}
                          style={{
                            border: "1px solid #282828",
                            background: "#161616",
                            color: "#777",
                            padding: "6px 8px",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Inline Size Manager Drawer (Both Size & Stock input by admin) */}
                    {isExpanded && (
                      <div
                        style={{
                          borderTop: "1px solid #222",
                          background: "#141414",
                          padding: "16px 20px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                          <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
                            MANAGE SIZES & STOCK FOR {product.name}
                          </span>
                          <span style={{ fontSize: 10, color: "#aaa" }}>Admin can add new sizes and specify unit quantities</span>
                        </div>

                        {/* Current Sizes Table / List */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                          {product.sizes.map((sz) => (
                            <div
                              key={sz}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "#1c1c1c",
                                border: "1px solid #333",
                                borderRadius: 4,
                                padding: "6px 10px",
                              }}
                            >
                              <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>Size {sz}:</span>
                              <input
                                type="number"
                                min="0"
                                value={product.stock[sz] ?? 0}
                                onChange={(e) => handleStockChange(product.slug, sz, parseInt(e.target.value) || 0)}
                                style={{
                                  width: 44,
                                  padding: "2px 4px",
                                  background: "#0c0c0c",
                                  border: "1px solid #383838",
                                  color: "var(--pink)",
                                  fontWeight: 700,
                                  fontSize: 11,
                                  borderRadius: 3,
                                  textAlign: "center",
                                }}
                              />
                              <span style={{ fontSize: 9, color: "#888" }}>units</span>
                              <button
                                onClick={() => handleRemoveSize(product.slug, sz)}
                                style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: "2px 4px", marginLeft: 4 }}
                                title={`Delete size ${sz}`}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Size & Stock inputs by Admin */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", background: "#181818", padding: "10px 14px", borderRadius: 6, border: "1px solid #282828" }}>
                          <span style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase" }}>ADD SIZE & STOCK:</span>
                          <input
                            placeholder="Size (e.g. 2XL, UK 10)"
                            id={`add-size-name-${product.slug}`}
                            style={{
                              padding: "6px 10px",
                              background: "#0c0c0c",
                              border: "1px solid #333",
                              color: "#fff",
                              fontSize: 11,
                              borderRadius: 4,
                              width: 130,
                              outline: "none",
                            }}
                          />
                          <input
                            type="number"
                            min="0"
                            defaultValue="5"
                            placeholder="Stock"
                            id={`add-size-stock-${product.slug}`}
                            style={{
                              padding: "6px 8px",
                              background: "#0c0c0c",
                              border: "1px solid #333",
                              color: "#fff",
                              fontSize: 11,
                              borderRadius: 4,
                              width: 70,
                              textAlign: "center",
                              outline: "none",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const nameEl = document.getElementById(`add-size-name-${product.slug}`) as HTMLInputElement;
                              const stockEl = document.getElementById(`add-size-stock-${product.slug}`) as HTMLInputElement;
                              if (nameEl && nameEl.value.trim()) {
                                const stockVal = parseInt(stockEl?.value || "5") || 0;
                                handleAddSizeToExisting(product.slug, nameEl.value, stockVal);
                                nameEl.value = "";
                              } else {
                                toast.error("Please enter a size name");
                              }
                            }}
                            className="pink-button small"
                            style={{ fontSize: 10, padding: "5px 12px" }}
                          >
                            <Plus size={12} /> Add Size & Stock
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: ADD PRODUCT FORM ──────────────────────────────── */}
        {activeTab === "add" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)", gap: 24 }}>
            {/* Form */}
            <form
              onSubmit={handleAddProduct}
              style={{
                background: "rgba(18,18,18,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "28px 24px",
                borderRadius: 8,
                display: "grid",
                gap: 18,
              }}
            >
              <div>
                <h3 style={{ fontFamily: "Anton", fontSize: 20, margin: "0 0 4px", color: "#fff", letterSpacing: "0.04em" }}>
                  ADD NEW PRODUCT
                </h3>
                <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>
                  Input product details, upload product image, and configure custom sizes and stock amounts.
                </p>
              </div>

              {/* Product Name */}
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#aaa69d", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
                  Product Name *
                </label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Real Madrid 2026/27 Gold Edition"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#141414",
                    border: "1px solid #282828",
                    color: "#fff",
                    fontSize: 12,
                    borderRadius: 4,
                    outline: "none",
                  }}
                />
              </div>

              {/* Category & Price */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, color: "#aaa69d", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#141414",
                      border: "1px solid #282828",
                      color: "#fff",
                      fontSize: 12,
                      borderRadius: 4,
                      outline: "none",
                    }}
                  >
                    <option value="CURATED JERSEY">CURATED JERSEY</option>
                    <option value="ARCHIVE EDITION">ARCHIVE EDITION</option>
                    <option value="GYM KITS">GYM KITS</option>
                    <option value="SPECIAL KIT">SPECIAL KIT</option>
                    <option value="HERITAGE DROP">HERITAGE DROP</option>
                    <option value="NATIONAL TEAM">NATIONAL TEAM</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 10, color: "#aaa69d", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
                    Price (₦ Naira)
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#141414",
                      border: "1px solid #282828",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ padding: "10px 12px", color: "var(--pink)", fontWeight: 700, fontSize: 13, background: "#181818" }}>
                      ₦
                    </span>
                    <input
                      value={newPriceAmount}
                      onChange={(e) => setNewPriceAmount(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="55000"
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: 12,
                        outline: "none",
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tone Description */}
              <div>
                <label style={{ display: "block", fontSize: 10, color: "#aaa69d", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
                  Tone & Colorway Description
                </label>
                <input
                  value={newTone}
                  onChange={(e) => setNewTone(e.target.value)}
                  placeholder="e.g. Obsidian / Gold Accents"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#141414",
                    border: "1px solid #282828",
                    color: "#fff",
                    fontSize: 12,
                    borderRadius: 4,
                    outline: "none",
                  }}
                />
              </div>

              {/* ── IMAGE SOURCE: Direct File Upload + Presets + URL ── */}
              <div style={{ background: "#141414", padding: 14, borderRadius: 6, border: "1px solid #282828" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <label style={{ fontSize: 10, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
                    PRODUCT IMAGE
                  </label>
                  {/* Mode switcher */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {[
                      { id: "upload", label: "Upload File" },
                      { id: "preset", label: "Presets" },
                      { id: "url", label: "URL Input" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setImageInputMode(m.id as any)}
                        style={{
                          padding: "3px 8px",
                          fontSize: 9,
                          borderRadius: 3,
                          background: imageInputMode === m.id ? "var(--pink)" : "#202020",
                          color: imageInputMode === m.id ? "#fff" : "#aaa",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload File Mode */}
                {imageInputMode === "upload" && (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: "2px dashed rgba(231,25,75,0.4)",
                        borderRadius: 6,
                        padding: "20px 16px",
                        textAlign: "center",
                        background: "rgba(231,25,75,0.04)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--pink)";
                        e.currentTarget.style.background = "rgba(231,25,75,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(231,25,75,0.4)";
                        e.currentTarget.style.background = "rgba(231,25,75,0.04)";
                      }}
                    >
                      <Upload size={22} color="var(--pink)" style={{ margin: "0 auto 8px" }} />
                      <strong style={{ fontSize: 12, color: "#fff", display: "block", marginBottom: 2 }}>
                        Click to Browse & Upload Image
                      </strong>
                      <span style={{ fontSize: 10, color: "#aaa" }}>Supports PNG, JPG, WEBP from your device</span>
                    </div>
                  </div>
                )}

                {/* Presets Mode */}
                {imageInputMode === "preset" && (
                  <div>
                    <span style={{ fontSize: 9, color: "#aaa", display: "block", marginBottom: 8 }}>
                      SELECT A CURATED STOCK KIT PRESET:
                    </span>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {imagePresets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setNewImage(preset.url);
                            toast.success(`Selected ${preset.label}`);
                          }}
                          style={{
                            padding: "5px 9px",
                            fontSize: 10,
                            borderRadius: 4,
                            background: newImage === preset.url ? "var(--pink)" : "#202020",
                            color: newImage === preset.url ? "#fff" : "#aaa",
                            border: "1px solid #333",
                            cursor: "pointer",
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* URL Mode */}
                {imageInputMode === "url" && (
                  <input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Enter image URL or local storage path"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#0c0c0c",
                      border: "1px solid #282828",
                      color: "#fff",
                      fontSize: 12,
                      borderRadius: 4,
                      outline: "none",
                    }}
                  />
                )}

                {/* Active Image Preview Strip */}
                {newImage && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, paddingTop: 10, borderTop: "1px solid #222" }}>
                    <img
                      src={newImage}
                      alt="Active Preview"
                      style={{ width: 42, height: 50, objectFit: "cover", borderRadius: 4, border: "1px solid var(--pink)" }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <span style={{ fontSize: 9, color: "#29a36a", display: "block", fontWeight: 700 }}>IMAGE ATTACHED</span>
                      <small style={{ fontSize: 10, color: "#888", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {newImage.startsWith("data:") ? "Custom device upload (Data URL)" : newImage}
                      </small>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div style={{ display: "flex", gap: 16, background: "#141414", padding: 12, borderRadius: 4, border: "1px solid #222" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11, color: "#ccc" }}>
                  <input
                    type="checkbox"
                    checked={newIsBestseller}
                    onChange={(e) => setNewIsBestseller(e.target.checked)}
                    style={{ accentColor: "var(--pink)" }}
                  />
                  <span>Tag Bestseller</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11, color: "#ccc" }}>
                  <input
                    type="checkbox"
                    checked={newIsSpecial}
                    onChange={(e) => setNewIsSpecial(e.target.checked)}
                    style={{ accentColor: "#a855f7" }}
                  />
                  <span>Tag Special Kit</span>
                </label>
              </div>

              {/* ── SIZES & STOCK (Admin input for both Size and Stock Amount) ── */}
              <div style={{ background: "#141414", padding: 16, borderRadius: 6, border: "1px solid #242424" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 10, color: "var(--pink)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
                      SIZES & STOCK AMOUNTS
                    </span>
                    <span style={{ fontSize: 10, color: "#aaa" }}>Specify each size and its starting stock quantity</span>
                  </div>
                  {/* Quick Presets */}
                  <div style={{ display: "flex", gap: 5 }}>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("standard")}
                      style={{ padding: "3px 7px", fontSize: 9, background: "#202020", border: "1px solid #333", color: "#aaa", borderRadius: 3 }}
                    >
                      M, L, XL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("extended")}
                      style={{ padding: "3px 7px", fontSize: 9, background: "#202020", border: "1px solid #333", color: "#aaa", borderRadius: 3 }}
                    >
                      S—XXL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("one")}
                      style={{ padding: "3px 7px", fontSize: 9, background: "#202020", border: "1px solid #333", color: "#aaa", borderRadius: 3 }}
                    >
                      One Size
                    </button>
                  </div>
                </div>

                {/* Active Size & Stock Chips */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {sizeEntries.map((entry) => (
                    <div
                      key={entry.size}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#1c1c1c",
                        border: "1px solid #383838",
                        borderRadius: 4,
                        padding: "6px 10px",
                      }}
                    >
                      <strong style={{ fontSize: 11, color: "#fff" }}>{entry.size}</strong>
                      <span style={{ color: "#666" }}>:</span>
                      <input
                        type="number"
                        min="0"
                        value={entry.stock}
                        onChange={(e) => handleUpdateSizeEntryStock(entry.size, parseInt(e.target.value) || 0)}
                        style={{
                          width: 40,
                          padding: "2px 4px",
                          background: "#0c0c0c",
                          border: "1px solid #333",
                          color: "var(--pink)",
                          textAlign: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          borderRadius: 3,
                          outline: "none",
                        }}
                      />
                      <span style={{ fontSize: 9, color: "#888" }}>qty</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSizeEntry(entry.size)}
                        style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: "0 2px" }}
                        title={`Remove ${entry.size}`}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Size and Stock Input Row */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", background: "#181818", padding: "10px 12px", borderRadius: 4 }}>
                  <input
                    value={customSizeName}
                    onChange={(e) => setCustomSizeName(e.target.value)}
                    placeholder="Size name (e.g. XXL, 3XL, UK 12)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSizeEntry();
                      }
                    }}
                    style={{
                      flex: 1,
                      minWidth: 140,
                      padding: "7px 10px",
                      background: "#0c0c0c",
                      border: "1px solid #333",
                      color: "#fff",
                      fontSize: 11,
                      borderRadius: 4,
                      outline: "none",
                    }}
                  />
                  <input
                    type="number"
                    min="0"
                    value={customSizeStock}
                    onChange={(e) => setCustomSizeStock(e.target.value)}
                    placeholder="Stock Qty"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSizeEntry();
                      }
                    }}
                    style={{
                      width: 80,
                      padding: "7px 8px",
                      background: "#0c0c0c",
                      border: "1px solid #333",
                      color: "#fff",
                      fontSize: 11,
                      textAlign: "center",
                      borderRadius: 4,
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSizeEntry}
                    className="pink-button small"
                    style={{ fontSize: 10, padding: "5px 12px" }}
                  >
                    <Plus size={12} /> Add Size & Stock
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="pink-button"
                style={{ justifyContent: "center", height: 46, fontSize: 11, letterSpacing: "0.14em" }}
              >
                Publish Product to Storefront <Save size={14} />
              </button>
            </form>

            {/* Live Interactive Preview Card */}
            <div
              style={{
                background: "rgba(18,18,18,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "28px 24px",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: 9, color: "#aaa", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
                LIVE STOREFRONT CARD PREVIEW
              </span>
              <div style={{ background: "#111", border: "1px solid #262626", borderRadius: 6, overflow: "hidden", maxWidth: 320, margin: "0 auto", width: "100%" }}>
                <div style={{ height: 260, background: "#0c0c0c", position: "relative" }}>
                  <img
                    src={newImage}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }}
                  />
                  {newIsBestseller && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "var(--pink)", color: "#fff", fontSize: 8, padding: "3px 6px", borderRadius: 3, fontWeight: 700 }}>
                      BESTSELLER
                    </span>
                  )}
                  {newIsSpecial && !newIsBestseller && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#a855f7", color: "#fff", fontSize: 8, padding: "3px 6px", borderRadius: 3, fontWeight: 700 }}>
                      SPECIAL
                    </span>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <span style={{ fontSize: 8, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
                    {newCategory}
                  </span>
                  <strong style={{ display: "block", fontSize: 14, color: "#fff", margin: "4px 0 8px", textTransform: "uppercase" }}>
                    {newName || "Product Name Preview"}
                  </strong>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #222", paddingTop: 10 }}>
                    <strong style={{ fontSize: 14, color: "var(--pink)" }}>
                      ₦{Number(newPriceAmount || 0).toLocaleString("en-NG")}
                    </strong>
                    <span style={{ fontSize: 10, color: "#aaa" }}>
                      {sizeEntries.map((e) => e.size).join(", ") || "No sizes yet"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: SALES & ORDERS ─────────────────────────────────── */}
        {activeTab === "sales" && (
          <div>
            {/* Sales Subheader & Status Pipeline */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(18,18,18,0.7)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "12px 16px",
                borderRadius: 8,
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {/* Order Search */}
              <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: 11, color: "#666" }} />
                <input
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, customer name, or kit..."
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 34px",
                    background: "#141414",
                    border: "1px solid #282828",
                    color: "#fff",
                    fontSize: 12,
                    borderRadius: 4,
                    outline: "none",
                  }}
                />
              </div>

              {/* Status Filters */}
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { id: "all", label: `All (${orders.length})` },
                  { id: "Processing", label: `Processing (${salesAnalytics.processingCount})`, color: "#e7a619" },
                  { id: "In Transit", label: `In Transit (${salesAnalytics.inTransitCount})`, color: "#3b82f6" },
                  { id: "Delivered", label: `Delivered (${salesAnalytics.deliveredCount})`, color: "#29a36a" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id as any)}
                    style={{
                      padding: "6px 10px",
                      fontSize: 10,
                      borderRadius: 4,
                      background: orderStatusFilter === st.id ? "rgba(231,25,75,0.15)" : "#141414",
                      border: orderStatusFilter === st.id ? "1px solid var(--pink)" : "1px solid #242424",
                      color: orderStatusFilter === st.id ? "var(--pink)" : st.color || "#888",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div style={{ display: "grid", gap: 10 }}>
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrders.has(order.orderId);

                return (
                  <div
                    key={order.orderId}
                    style={{
                      background: "rgba(18, 18, 18, 0.8)",
                      border: isExpanded ? "1px solid rgba(231,25,75,0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: 8,
                      overflow: "visible",
                    }}
                  >
                    {/* Order Bar */}
                    <div
                      style={{
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Order ID */}
                      <div style={{ minWidth: 100 }}>
                        <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", display: "block" }}>
                          ORDER ID
                        </span>
                        <strong style={{ fontFamily: "Anton", fontSize: 15, color: "var(--pink)", letterSpacing: "0.04em" }}>
                          {order.orderId}
                        </strong>
                      </div>

                      {/* Date */}
                      <div style={{ minWidth: 80 }}>
                        <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", display: "block" }}>
                          DATE
                        </span>
                        <span style={{ fontSize: 11, color: "#ded8d0" }}>{order.date}</span>
                      </div>

                      {/* Customer */}
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", display: "block" }}>
                          CUSTOMER
                        </span>
                        <strong style={{ fontSize: 12, color: "#fff" }}>{order.customerName}</strong>
                      </div>

                      {/* Items Preview */}
                      <div style={{ minWidth: 100 }}>
                        <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", display: "block" }}>
                          ITEMS
                        </span>
                        <span style={{ fontSize: 11, color: "#ded8d0" }}>
                          {order.items.length} piece{order.items.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Total */}
                      <div style={{ minWidth: 110, textAlign: "right" }}>
                        <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", display: "block" }}>
                          TOTAL
                        </span>
                        <strong style={{ fontFamily: "Anton", fontSize: 16, color: "#fff" }}>{order.formattedTotal}</strong>
                      </div>

                      {/* Custom Status Dropdown (Zero White Space / Dark Theme) */}
                      <div>
                        <StatusDropdown
                          currentStatus={order.status}
                          onSelect={(newStatus) => handleUpdateOrderStatus(order.orderId, newStatus)}
                        />
                      </div>

                      {/* Expand Toggle */}
                      <button
                        onClick={() => toggleOrderExpanded(order.orderId)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#888",
                          cursor: "pointer",
                          padding: 4,
                        }}
                      >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </div>

                    {/* Order Details Accordion */}
                    {isExpanded && (
                      <div style={{ borderTop: "1px solid #222", padding: "16px 20px", background: "#141414" }}>
                        <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
                          ORDER LINE ITEMS
                        </span>
                        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                background: "#181818",
                                padding: "8px 12px",
                                borderRadius: 4,
                              }}
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  style={{ width: 36, height: 44, objectFit: "cover", borderRadius: 3 }}
                                />
                              )}
                              <div style={{ flex: 1 }}>
                                <strong style={{ fontSize: 12, color: "#fff", display: "block" }}>{item.productName}</strong>
                                <span style={{ fontSize: 10, color: "#888" }}>
                                  {item.category} · Size {item.size} · Qty {item.quantity}
                                </span>
                              </div>
                              <span style={{ fontFamily: "Anton", fontSize: 13, color: "var(--pink)" }}>
                                ₦{item.lineTotal.toLocaleString("en-NG")}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: "1px solid #222", paddingTop: 12 }}>
                          <div>
                            <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                              DELIVERY ADDRESS
                            </span>
                            <p style={{ margin: 0, fontSize: 11, color: "#ded8d0" }}>{order.deliveryAddress}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                              FINANCIAL SUMMARY
                            </span>
                            <span style={{ fontSize: 11, color: "#aaa", display: "block" }}>
                              Subtotal: ₦{order.subtotal.toLocaleString("en-NG")} · Delivery: ₦{order.deliveryFee.toLocaleString("en-NG")}
                            </span>
                            <strong style={{ fontSize: 14, color: "var(--pink)", display: "block", marginTop: 2 }}>
                              Total Paid: {order.formattedTotal}
                            </strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── LIVE PREVIEW MODAL DRAWER ─────────────────────────────── */}
      {previewProduct && (
        <div className="drawer-backdrop" onClick={() => setPreviewProduct(null)}>
          <aside
            className="cart-drawer"
            style={{ width: "min(440px, 100%)", background: "#111", color: "#fff" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-head" style={{ borderColor: "#222" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--pink)", margin: 0 }}>STOREFRONT PREVIEW</p>
                <h3 style={{ fontSize: 20, color: "#fff", margin: 0 }}>{previewProduct.name}</h3>
              </div>
              <button onClick={() => setPreviewProduct(null)} style={{ color: "#fff", background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px 0" }}>
              <img
                src={previewProduct.image}
                alt={previewProduct.name}
                style={{ width: "100%", height: 280, objectFit: "contain", background: "#0c0c0c", borderRadius: 6, marginBottom: 16 }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 9, color: "var(--pink)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700 }}>
                  {previewProduct.category}
                </span>
                <strong style={{ fontSize: 18, color: "var(--pink)" }}>{previewProduct.price}</strong>
              </div>

              <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>{previewProduct.details}</p>

              <div style={{ padding: 12, background: "#181818", border: "1px solid #282828", borderRadius: 4 }}>
                <span style={{ fontSize: 8, color: "#888", letterSpacing: "0.12em", display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                  STOCK BY SIZE
                </span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {previewProduct.sizes.map((sz) => (
                    <span key={sz} style={{ padding: "3px 8px", background: "#222", border: "1px solid #333", fontSize: 10, borderRadius: 3, color: "#fff" }}>
                      {sz}: {previewProduct.stock[sz] ?? 0}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
