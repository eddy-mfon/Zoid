/* ZOID Storefront — Centralized Search Experience with Blurred Backdrop */
import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, ArrowRight, Sparkles, Tag, Shirt } from "lucide-react";
import { searchProducts, type Product } from "@/lib/catalog";

interface CentralSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "AC Milan",
  "Brazil 1998",
  "Gym Kit",
  "Special Kits",
  "Heritage",
  "Lagos",
  "Liverpool",
  "Barcelona",
];

export default function CentralSearchModal({ isOpen, onClose }: CentralSearchModalProps) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and lock body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query);
  }, [query]);

  // Handle Enter key to navigate to first result
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      const firstResult = searchResults[0];
      onClose();
      navigate(`/product/${firstResult.slug}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="central-search-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Search ZOID Catalog"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "clamp(8px, 4vw, 40px) clamp(6px, 3vw, 16px)",
        paddingTop: "clamp(12px, 6vh, 80px)",
        background: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        animation: "searchFadeIn 0.2s ease-out",
        overflowY: "auto",
      }}
    >
      <div
        className="central-search-card"
        style={{
          position: "relative",
          width: "min(100%, 680px)",
          maxHeight: "min(92vh, 720px)",
          background: "#131313",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 14,
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(179, 13, 13, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "searchCardPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top Header Bar */}
        <div
          className="central-search-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 22px 14px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(22, 22, 22, 0.7)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "Anton",
                fontSize: 16,
                letterSpacing: "0.08em",
                color: "#fff",
                textTransform: "uppercase",
              }}
            >
              SEARCH
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontSize: 10,
                color: "#777",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              ESC to close
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              style={{
                background: "transparent",
                border: "none",
                color: "#888",
                cursor: "pointer",
                padding: 4,
                display: "grid",
                placeItems: "center",
                borderRadius: 4,
                transition: "color 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#888";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <div
          className="central-search-input-wrap"
          style={{
            padding: "18px 22px 14px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#181818",
              border: "1.5px solid rgba(179, 13, 13, 0.45)",
              borderRadius: 8,
              padding: "12px 16px",
              boxShadow: "0 0 16px rgba(179, 13, 13, 0.12)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <Search size={20} color="var(--pink)" style={{ flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search jerseys, kits, clubs, nations..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 16,
                color: "#fff",
                letterSpacing: "0.01em",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: 12,
                  padding: "2px 6px",
                  borderRadius: 3,
                }}
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          {/* Popular Tag Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              marginTop: 14,
            }}
          >
            <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#666", textTransform: "uppercase", marginRight: 4 }}>
              POPULAR:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  inputRef.current?.focus();
                }}
                style={{
                  background: query.toLowerCase() === term.toLowerCase() ? "var(--pink)" : "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.09)",
                  color: query.toLowerCase() === term.toLowerCase() ? "#fff" : "#aaa",
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 20,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (query.toLowerCase() !== term.toLowerCase()) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (query.toLowerCase() !== term.toLowerCase()) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.color = "#aaa";
                  }
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Results Area */}
        <div
          className="central-search-results"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 22px 22px",
            minHeight: "180px",
            maxHeight: "calc(min(92vh, 720px) - 240px)",
          }}
        >
          {query.trim() === "" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "36px 16px",
                textAlign: "center",
                color: "#666",
              }}
            >
              <Shirt size={32} color="#444" style={{ marginBottom: 12 }} />
              <strong style={{ fontSize: 13, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Type to start searching
              </strong>
              <small style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                Find vintage kits, new drops, national editions, and gym gear.
              </small>
            </div>
          ) : searchResults.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "#777",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                <span>MATCHING PIECES ({searchResults.length})</span>
                <span>PRESS ENTER TO VIEW TOP MATCH</span>
              </div>

              {searchResults.map((product, idx) => (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 14px",
                    background: idx === 0 ? "rgba(179, 13, 13, 0.06)" : "rgba(255, 255, 255, 0.03)",
                    border: idx === 0 ? "1px solid rgba(179, 13, 13, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: "#fff",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(179, 13, 13, 0.12)";
                    e.currentTarget.style.borderColor = "var(--pink)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = idx === 0 ? "rgba(179, 13, 13, 0.06)" : "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = idx === 0 ? "rgba(179, 13, 13, 0.25)" : "rgba(255, 255, 255, 0.06)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: 48,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 4,
                      background: "#222",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <strong
                        style={{
                          fontSize: 13,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.name}
                      </strong>
                      {product.isBestseller && (
                        <span
                          style={{
                            fontSize: 8,
                            padding: "1px 5px",
                            background: "rgba(179, 13, 13, 0.2)",
                            color: "var(--pink)",
                            border: "1px solid var(--pink)",
                            borderRadius: 2,
                            fontWeight: 700,
                          }}
                        >
                          BESTSELLER
                        </span>
                      )}
                      {product.isSpecial && (
                        <span
                          style={{
                            fontSize: 8,
                            padding: "1px 5px",
                            background: "rgba(59, 130, 246, 0.2)",
                            color: "#60a5fa",
                            border: "1px solid #3b82f6",
                            borderRadius: 2,
                            fontWeight: 700,
                          }}
                        >
                          SPECIAL
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: "#888" }}>{product.category}</span>
                      <span style={{ fontSize: 11, color: "var(--pink)", fontWeight: 700 }}>{product.price}</span>
                      {product.discountBadge && (
                        <span style={{ fontSize: 10, color: "#29a36a" }}>{product.discountBadge}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={16} color="#777" style={{ flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "36px 16px",
                textAlign: "center",
              }}
            >
              <Search size={28} color="#666" style={{ marginBottom: 12 }} />
              <p style={{ margin: "0 0 6px", color: "#ddd", fontSize: 14 }}>
                Nothing matched "<strong>{query}</strong>"
              </p>
              <small style={{ color: "#777", fontSize: 11, marginBottom: 16 }}>
                Try searching for a team (Milan, Brazil), kit type (Retro, Gym Kit), or style.
              </small>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #444",
                  color: "#aaa",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  padding: "6px 14px",
                  borderRadius: 4,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes searchFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes searchCardPop {
          from { opacity: 0; transform: scale(0.96) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        /* ── Responsive: Tablet ── */
        @media (max-width: 640px) {
          .central-search-card {
            border-radius: 12px !important;
            margin: 0 8px !important;
            width: calc(100% - 16px) !important;
            max-height: 90vh !important;
          }
          .central-search-header {
            padding: 14px 16px 12px !important;
          }
          .central-search-input-wrap {
            padding: 14px 16px 12px !important;
          }
          .central-search-results {
            padding: 12px 16px 18px !important;
            max-height: calc(90vh - 220px) !important;
          }
        }
        /* ── Responsive: Small Phone ── */
        @media (max-width: 400px) {
          .central-search-card {
            border-radius: 10px !important;
            margin: 0 4px !important;
            width: calc(100% - 8px) !important;
            max-height: 92vh !important;
          }
          .central-search-header {
            padding: 10px 12px 8px !important;
          }
          .central-search-input-wrap {
            padding: 12px 12px 10px !important;
          }
          .central-search-results {
            padding: 10px 12px 14px !important;
            max-height: calc(92vh - 210px) !important;
            min-height: 120px !important;
          }
        }
      `}</style>
    </div>
  );
}
