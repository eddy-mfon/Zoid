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
        <Link className="footer-cta" href="/collection">
          Enter the edit <ArrowDownRight size={16} />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© ZOID / 2026</span>
        <span>Lagos — Nigeria</span>
        <span>Built on grit <b>•</b> Worn with intent</span>
      </div>
    </footer>
  );
}
