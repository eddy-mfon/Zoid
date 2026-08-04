import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Send, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { JERSEYS } from '../../data/jerseys';

export const BrandEthos: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Pick a visually striking jersey as the CTA background
  const bgJersey = JERSEYS.find((j) => j.isBestSeller && j.category === 'National') ?? JERSEYS[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('VIP ACCESS GRANTED', "You'll be notified first when rare retro grails drop!", undefined, 'info');
      setEmail('');
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      {/* ── Full background image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgJersey.mainImage}
          alt="CTA Background"
          className="w-full h-full object-cover object-center brightness-50 scale-105"
        />
        {/* Deep dark overlay so text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* ── Decorative lines ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="absolute top-[15%] left-[5%] w-[400px] h-[1.5px] bg-[#C21E3C] -rotate-[15deg] opacity-50" />
        <div className="absolute bottom-[18%] right-[8%] w-[300px] h-[1.5px] bg-[#C21E3C] rotate-[18deg] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:44px_44px] opacity-[0.02]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center gap-8">

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#C21E3C] font-bold"
        >
          ZOID STUDIOS · VIP DROP LIST
        </motion.span>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-[0.9] tracking-tight text-white"
        >
          NEVER MISS A{' '}
          <span className="text-[#C21E3C]">RARE DROP.</span>
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.26, ease: 'easeOut' }}
          className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed max-w-lg"
        >
          Our vintage jerseys arrive in limited batches and sell out fast. Join the ZOID mailing list for instant drop alerts and exclusive discounts — straight to your inbox.
        </motion.p>

        {/* Email form */}
        <motion.form
          onSubmit={handleSubscribe}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.38, ease: 'easeOut' }}
          className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3"
        >
          {subscribed ? (
            <div className="w-full bg-[#C21E3C]/10 border border-[#C21E3C]/40 text-white py-4 px-6 rounded-full font-mono text-xs uppercase font-bold flex items-center justify-center gap-2.5 backdrop-blur-md">
              <Check className="w-4 h-4 text-[#C21E3C]" />
              <span>YOU'RE ON THE VIP DROP LIST!</span>
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/8 backdrop-blur-md border border-white/20 focus:border-[#C21E3C] rounded-full px-5 py-3.5 text-xs font-sans text-white placeholder-white/40 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 w-full sm:w-auto bg-[#C21E3C] hover:bg-[#a8152d] text-white px-7 py-3.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03] shadow-[0_0_30px_rgba(194,30,60,0.3)]"
              >
                <span>JOIN NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </motion.form>

        {/* Links row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.52 }}
          className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-white/40"
        >
          <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-1.5 group">
            <span>Shop All Kits</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <span className="text-white/20">·</span>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3 h-3 text-[#C21E3C]" />
            <span>Telegram Channel</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
