/* ZOID Authentication Portal: Log In / Sign Up with Accent Striped Background & Smooth Transitions */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const MARK = "/zoid-logo.svg";

export default function Auth() {
  const [location, navigate] = useLocation();
  const { isLoggedIn, login, signup } = useAuth();

  // Parse query params for mode and redirect
  const queryParams = new URLSearchParams(window.location.search);
  const isSignupRoute = location === "/signup" || queryParams.get("mode") === "signup";
  const redirectPath = queryParams.get("redirect") || "/profile";

  const [mode, setMode] = useState<"login" | "signup">(isSignupRoute ? "signup" : "login");
  const [showPassword, setShowPassword] = useState(false);

  // Sync mode if route changes externally
  useEffect(() => {
    if (location === "/signup") {
      setMode("signup");
    } else if (location === "/login") {
      setMode("login");
    }
  }, [location]);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect to target path
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectPath);
    }
  }, [isLoggedIn, navigate, redirectPath]);

  function switchMode(newMode: "login" | "signup") {
    setMode(newMode);
    const newPath = newMode === "signup" ? "/signup" : "/login";
    const query = redirectPath && redirectPath !== "/profile" ? `?redirect=${encodeURIComponent(redirectPath)}` : "";
    window.history.replaceState(null, "", `${newPath}${query}`);
  }

  function handleBack() {
    if (redirectPath === "/checkout") {
      navigate("/checkout");
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/collection");
    }
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }
    setIsSubmitting(true);
    const success = login(email, password);
    setIsSubmitting(false);
    if (success) {
      navigate(redirectPath);
    }
  }

  function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setIsSubmitting(true);
    const success = signup(fullName, email, phone, password);
    setIsSubmitting(false);
    if (success) {
      navigate(redirectPath);
    }
  }

  function handleQuickDemoLogin() {
    setIsSubmitting(true);
    const success = login("tunde@zoid.co", "password");
    setIsSubmitting(false);
    if (success) {
      navigate(redirectPath);
    }
  }

  const inputWrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    background: "#0c0c0c",
    border: "1px solid #282828",
    borderRadius: 6,
    padding: "0 12px",
    height: 46,
    gap: 10,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#f2f0eb",
    fontSize: 13,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 10,
    color: "#aaa",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
  };

  return (
    <main
      className="zoid-shell"
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(8, 8, 8, 0.52) 0%, rgba(4, 4, 4, 0.82) 100%),
          repeating-linear-gradient(
            135deg,
            #080808 0px,
            #080808 36px,
            #b30d0d 36px,
            #b30d0d 48px,
            #080808 48px,
            #080808 84px,
            #ffffff 84px,
            #ffffff 90px
          )
        `,
        color: "#f4f0ea",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Atmospheric Accent Ambient Flare */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 90vw)",
          height: "400px",
          background: "radial-gradient(circle, rgba(179, 13, 13,0.18) 0%, rgba(8,8,8,0) 72%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Form Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "clamp(80px, 12vh, 110px) clamp(16px, 4vw, 32px) 48px",
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        {/* Back Button (Present on both Log In and Sign Up) */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ width: "100%", maxWidth: 440, marginBottom: 14 }}
        >
          <button
            type="button"
            onClick={handleBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#aaa",
              background: "rgba(14,14,14,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              padding: "6px 12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "var(--pink)";
              e.currentTarget.style.transform = "translateX(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#aaa";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <ArrowLeft size={13} />
            <span>{redirectPath === "/checkout" ? "Back to Checkout" : "Back to Store"}</span>
          </button>
        </motion.div>

        {/* Auth Card with Smooth Layout & Spring Transitions */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%",
            maxWidth: 440,
            background: "rgba(16, 16, 16, 0.88)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 10,
            padding: "clamp(26px, 5vw, 36px) clamp(18px, 5vw, 32px)",
            boxShadow: "0 30px 70px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(179, 13, 13, 0.15)",
          }}
        >
          {/* Brand Mark & Dynamic Title */}
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "rgba(179, 13, 13,0.12)",
                border: "1px solid rgba(179, 13, 13,0.4)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 12px",
                boxShadow: "0 0 20px rgba(179, 13, 13,0.25)",
              }}
            >
              <img src={MARK} alt="ZOID" style={{ height: 17, width: "auto" }} />
            </div>

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div
                  key="title-login"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1
                    style={{
                      fontFamily: "Anton",
                      fontSize: 32,
                      color: "#fff",
                      margin: "0 0 6px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    LOG IN
                  </h1>
                  <p style={{ margin: 0, fontSize: 12, color: "#8e8982", lineHeight: 1.4 }}>
                    Welcome back. Access your saved kits and orders.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="title-signup"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1
                    style={{
                      fontFamily: "Anton",
                      fontSize: 32,
                      color: "#fff",
                      margin: "0 0 6px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                    }}
                  >
                    SIGN UP
                  </h1>
                  <p style={{ margin: 0, fontSize: 12, color: "#8e8982", lineHeight: 1.4 }}>
                    Join ZOID for exclusive drops, tracked orders & saved kits.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Smooth Mode Switcher Tabs (Log In & Sign Up) */}
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "#0c0c0c",
              border: "1px solid #242424",
              borderRadius: 6,
              padding: 3,
              marginBottom: 22,
            }}
          >
            <button
              type="button"
              onClick={() => switchMode("login")}
              style={{
                position: "relative",
                zIndex: 2,
                padding: "9px 0",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: mode === "login" ? "#fff" : "#777",
                transition: "color 0.2s ease",
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              style={{
                position: "relative",
                zIndex: 2,
                padding: "9px 0",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                background: "transparent",
                color: mode === "signup" ? "#fff" : "#777",
                transition: "color 0.2s ease",
              }}
            >
              Sign Up
            </button>

            {/* Sliding Pill Indicator */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
              style={{
                position: "absolute",
                top: 3,
                bottom: 3,
                left: mode === "login" ? 3 : "50%",
                width: "calc(50% - 3px)",
                background: "var(--pink)",
                borderRadius: 4,
                zIndex: 1,
                boxShadow: "0 2px 10px rgba(179, 13, 13,0.4)",
              }}
            />
          </div>

          {/* Form Area with AnimatePresence for Smooth Switching */}
          <AnimatePresence mode="wait" initial={false}>
            {mode === "login" ? (
              <motion.form
                key="form-login"
                initial={{ opacity: 0, x: -14, filter: "blur(2px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 14, filter: "blur(2px)" }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onSubmit={handleLoginSubmit}
                style={{ display: "grid", gap: 15 }}
              >
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputWrapStyle}>
                    <Mail size={15} color="#666" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={inputWrapStyle}>
                    <Lock size={15} color="#666" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: "none", border: "none", color: "#666", padding: 4, cursor: "pointer", display: "flex" }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="pink-button"
                  disabled={isSubmitting}
                  style={{
                    marginTop: 4,
                    justifyContent: "center",
                    minHeight: 46,
                    fontSize: 11,
                    width: "100%",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                  }}
                >
                  {isSubmitting ? "Logging In…" : "Log In"} <ArrowRight size={14} />
                </button>

                {/* Bottom Toggle Note */}
                <p style={{ margin: "6px 0 0", textAlign: "center", fontSize: 12, color: "#888" }}>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--pink)",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 12,
                      padding: 0,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Sign Up
                  </button>
                </p>

                {/* Demo Account Shortcut */}
                <div style={{ marginTop: 6, paddingTop: 14, borderTop: "1px solid #222", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #282828",
                      borderRadius: 4,
                      color: "#999",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(179, 13, 13,0.1)";
                      e.currentTarget.style.borderColor = "rgba(179, 13, 13,0.35)";
                      e.currentTarget.style.color = "#f4f0ea";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "#282828";
                      e.currentTarget.style.color = "#999";
                    }}
                  >
                    <ShieldCheck size={13} color="var(--pink)" /> Fast Demo Access (Tunde O.)
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="form-signup"
                initial={{ opacity: 0, x: 14, filter: "blur(2px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -14, filter: "blur(2px)" }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onSubmit={handleSignupSubmit}
                style={{ display: "grid", gap: 14 }}
              >
                {/* First Name & Last Name (Responsive Auto-fit) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <div style={inputWrapStyle}>
                      <User size={14} color="#666" />
                      <input
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Tunde"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <div style={inputWrapStyle}>
                      <input
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Okafor"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={inputWrapStyle}>
                    <Mail size={15} color="#666" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label style={labelStyle}>Phone Number (Optional)</label>
                  <div style={inputWrapStyle}>
                    <Phone size={15} color="#666" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={inputWrapStyle}>
                    <Lock size={15} color="#666" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: "none", border: "none", color: "#666", padding: 4, cursor: "pointer", display: "flex" }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="pink-button"
                  disabled={isSubmitting}
                  style={{
                    marginTop: 4,
                    justifyContent: "center",
                    minHeight: 46,
                    fontSize: 11,
                    width: "100%",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                  }}
                >
                  {isSubmitting ? "Creating Account…" : "Sign Up"} <ArrowRight size={14} />
                </button>

                {/* Bottom Toggle Note */}
                <p style={{ margin: "6px 0 0", textAlign: "center", fontSize: 12, color: "#888" }}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--pink)",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 12,
                      padding: 0,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Log In
                  </button>
                </p>

                {/* Demo Account Shortcut */}
                <div style={{ marginTop: 6, paddingTop: 14, borderTop: "1px solid #222", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #282828",
                      borderRadius: 4,
                      color: "#999",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(179, 13, 13,0.1)";
                      e.currentTarget.style.borderColor = "rgba(179, 13, 13,0.35)";
                      e.currentTarget.style.color = "#f4f0ea";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "#282828";
                      e.currentTarget.style.color = "#999";
                    }}
                  >
                    <ShieldCheck size={13} color="var(--pink)" /> Fast Demo Access (Tunde O.)
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Reassurance Note */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.16em", color: "#777", textTransform: "uppercase" }}>
            ZOID LAGOS • 2-WEEK GUARANTEED DELIVERY
          </p>
        </div>
      </div>
    </main>
  );
}
