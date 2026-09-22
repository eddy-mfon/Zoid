/* ZOID Storefront — Login & Sign Up Dialog Component */
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Lock, Mail, Phone, ShieldCheck, User, X } from "lucide-react";

const MARK = "/zoid-logo.svg";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, login, signup } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isAuthModalOpen) return null;

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email, password);
  }

  function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    signup(name, email, phone, password);
  }

  function handleQuickDemoLogin() {
    login("tunde@zoid.co", "password");
  }

  return (
    <div className="drawer-backdrop" onClick={closeAuthModal} style={{ zIndex: 999 }}>
      <aside
        className="cart-drawer"
        style={{
          width: "min(460px, 100%)",
          background: "#121212",
          color: "#fff",
          borderLeft: "1px solid #282828",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-head" style={{ borderBottom: "1px solid #222", paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={MARK} alt="ZOID" style={{ height: 18 }} />
            <div>
              <p className="eyebrow" style={{ color: "var(--pink)", margin: 0 }}>ACCOUNT PORTAL</p>
              <h3 style={{ fontFamily: "Anton", fontSize: 24, margin: 0, color: "#fff" }}>
                {authModalMode === "login" ? "LOG IN TO ZOID" : "CREATE YOUR ACCOUNT"}
              </h3>
            </div>
          </div>
          <button onClick={closeAuthModal} style={{ color: "#fff" }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: "flex", background: "#181818", padding: 4, borderRadius: 4, margin: "20px 0 24px", border: "1px solid #2a2a2a" }}>
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            style={{
              flex: 1, padding: "9px 0", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              fontWeight: 700, borderRadius: 3,
              background: authModalMode === "login" ? "var(--pink)" : "transparent",
              color: authModalMode === "login" ? "#fff" : "#888",
              transition: "all 0.2s ease"
            }}
          >
            LOG IN
          </button>
          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            style={{
              flex: 1, padding: "9px 0", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
              fontWeight: 700, borderRadius: 3,
              background: authModalMode === "signup" ? "var(--pink)" : "transparent",
              color: authModalMode === "signup" ? "#fff" : "#888",
              transition: "all 0.2s ease"
            }}
          >
            SIGN UP
          </button>
        </div>

        {/* LOGIN FORM */}
        {authModalMode === "login" && (
          <form onSubmit={handleLoginSubmit} style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Email Address *
              </label>
              <div style={{ display: "flex", alignItems: "center", background: "#181818", border: "1px solid #333", borderRadius: 4, padding: "0 12px" }}>
                <Mail size={16} color="#666" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tunde@example.com"
                  style={{ width: "100%", padding: 12, background: "transparent", border: "none", color: "#fff", fontSize: 13, outline: "none" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Password *
              </label>
              <div style={{ display: "flex", alignItems: "center", background: "#181818", border: "1px solid #333", borderRadius: 4, padding: "0 12px" }}>
                <Lock size={16} color="#666" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: 12, background: "transparent", border: "none", color: "#fff", fontSize: 13, outline: "none" }}
                />
              </div>
            </div>

            <button type="submit" className="pink-button" style={{ marginTop: 10, justifyContent: "center", minHeight: 48, fontSize: 11 }}>
              Log In to ZOID <ArrowRight size={16} />
            </button>

            {/* Quick Demo Login Option */}
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px dashed #282828", textAlign: "center" }}>
              <span style={{ fontSize: 10, color: "#666", display: "block", marginBottom: 8 }}>FOR TESTING & DEMO:</span>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                style={{
                  width: "100%", padding: "10px", background: "rgba(231,25,75,0.08)",
                  border: "1px solid rgba(231,25,75,0.3)", borderRadius: 4,
                  color: "var(--pink)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                <ShieldCheck size={14} /> Quick Log In as Tunde O. (Demo Profile)
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {authModalMode === "signup" && (
          <form onSubmit={handleSignupSubmit} style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Full Name *
              </label>
              <div style={{ display: "flex", alignItems: "center", background: "#181818", border: "1px solid #333", borderRadius: 4, padding: "0 12px" }}>
                <User size={16} color="#666" />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Bello"
                  style={{ width: "100%", padding: 12, background: "transparent", border: "none", color: "#fff", fontSize: 13, outline: "none" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Email Address *
              </label>
              <div style={{ display: "flex", alignItems: "center", background: "#181818", border: "1px solid #333", borderRadius: 4, padding: "0 12px" }}>
                <Mail size={16} color="#666" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: "100%", padding: 12, background: "transparent", border: "none", color: "#fff", fontSize: 13, outline: "none" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Phone Number
              </label>
              <div style={{ display: "flex", alignItems: "center", background: "#181818", border: "1px solid #333", borderRadius: 4, padding: "0 12px" }}>
                <Phone size={16} color="#666" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  style={{ width: "100%", padding: 12, background: "transparent", border: "none", color: "#fff", fontSize: 13, outline: "none" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 10, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Password *
              </label>
              <div style={{ display: "flex", alignItems: "center", background: "#181818", border: "1px solid #333", borderRadius: 4, padding: "0 12px" }}>
                <Lock size={16} color="#666" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  style={{ width: "100%", padding: 12, background: "transparent", border: "none", color: "#fff", fontSize: 13, outline: "none" }}
                />
              </div>
            </div>

            <button type="submit" className="pink-button" style={{ marginTop: 10, justifyContent: "center", minHeight: 48, fontSize: 11 }}>
              Create Account & Join <ArrowRight size={16} />
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
