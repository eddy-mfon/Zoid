import { Link } from "wouter";
import { ArrowDownRight } from "lucide-react";

const assets = {
  mark: "/zoid-logo.svg",
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-topline">
        <span>ZOID / LAGOS</span>
        <span>CURATING BEFORE CREATING</span>
      </div>
      <div className="footer-core">
        <Link className="footer-wordmark" href="/">
          <img src={assets.mark} alt="" />
          <span>ZOID</span>
        </Link>
        <p>For the ones still rising.<br />Archive-led sportwear from Lagos.</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(179, 13, 13,0.08)", border: "1px solid rgba(179, 13, 13,0.25)", borderRadius: 4, marginTop: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 10, letterSpacing: "0.08em", color: "#aaa" }}>
            HOTLINE / EMERGENCIES: <a href="tel:09020711737" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "none" }}>09020711737</a>
          </span>
        </div>
        <Link className="footer-cta" href="/collection">
          Enter the edit <ArrowDownRight size={16} />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© ZOID / 2026</span>
        <span>Lagos — Nigeria</span>
        <span>Hotline: <a href="tel:09020711737" style={{ color: "inherit", textDecoration: "none" }}>09020711737</a></span>
        <span>Built on grit <b>•</b> Worn with intent</span>
      </div>
    </footer>
  );
}
