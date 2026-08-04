import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t border-neutral-900 py-16 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-10">
        
        {/* Navigation Links around center */}
        <nav className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-xs uppercase tracking-[0.2em] text-neutral-400 font-medium">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <Link to="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Telegram
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
        </nav>

        {/* Centered Large ZOID Logo */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="font-display text-5xl sm:text-7xl font-black tracking-[0.2em] text-white group-hover:text-[#C21E3C] transition-colors">
              ZOID
            </span>
          </Link>
          <p className="text-neutral-500 text-xs font-mono tracking-widest uppercase">
            RETRO FOOTBALL KITS • CURATED ARCHIVE
          </p>
        </div>

        {/* Social Icons & Minimalist Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-8 border-t border-neutral-900 text-[11px] font-mono text-neutral-500 gap-4">
          <p>© 2026 ZOID ARCHIVE. ALL RIGHTS RESERVED.</p>
          
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-300 transition-colors cursor-default">
              EXPRESS ROOM DELIVERY
            </span>
            <span className="hover:text-neutral-300 transition-colors cursor-default">
              AUTHENTIC RETRO KITS
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
