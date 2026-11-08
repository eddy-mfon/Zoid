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
        <span>KEEP IT GOING</span>
      </div>
      <div className="footer-core">
        <Link className="footer-wordmark" href="/">
          <img src={assets.mark} alt="" />
          <span>ZOID</span>
        </Link>
        <p>Archive-led sportswear from Lagos</p>
        <Link className="footer-cta" href="/collection">
          Shop now <ArrowDownRight size={16} />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© ZOID / 2026</span>
        <span>Lagos — Nigeria</span>
        <span>Hotline: <a href="tel:09020711737" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "none" }}>09020711737</a></span>
      </div>
    </footer>
  );
}
