import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { JERSEYS } from '../../data/jerseys';

export const HeroSection: React.FC = () => {
  const carouselJerseys = JERSEYS.slice(0, 6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselJerseys.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselJerseys.length]);

  const currentJersey = carouselJerseys[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center bg-black text-white overflow-hidden"
    >
      {/* ── Background Image with Parallax ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 scale-110"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentJersey.id}
            src={currentJersey.mainImage}
            alt={currentJersey.name}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full h-full object-cover object-center brightness-75"
          />
        </AnimatePresence>

        {/* Gradient overlay — lighter so jerseys read clearly */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
      </motion.div>

      {/* ── Decorative Diagonal Lines ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {/* Crimson accent lines — kept, refined */}
        <div className="absolute -top-6 left-[30%] w-[500px] h-[2px] bg-[#C21E3C] -rotate-[18deg] opacity-60" />
        <div className="absolute top-[72%] right-[8%] w-[360px] h-[2px] bg-[#C21E3C] rotate-[22deg] opacity-50" />
        {/* Very subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.025]" />
      </div>

      {/* ── Main Content with Parallax ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-20 max-w-6xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center gap-7"
      >
        {/* Eyebrow label */}
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={isLoaded ? { opacity: 1, letterSpacing: '0.2em' } : {}}
          transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
          className="font-mono text-[10px] sm:text-xs text-[#C21E3C] uppercase tracking-[0.25em] font-bold"
        >
          ZOID STUDIOS · FOOTBALL HERITAGE × STREETWEAR
        </motion.span>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-[clamp(4rem,12vw,9.5rem)] font-black uppercase leading-[0.88] tracking-tight text-white drop-shadow-2xl"
        >
          RETRO KITS.{' '}
          <br />
          <span className="text-[#C21E3C]">CURATED</span>{' '}
          <span className="text-white">JERSEYS.</span>
        </motion.h1>

        {/* Sub-line */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.42, ease: 'easeOut' }}
          className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed max-w-xl"
        >
          Handpicked club kits, national team editions, and limited drops — all in Nigerian Naira. Authentic football heritage, delivered.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.58, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            to="/shop"
            className="group bg-[#C21E3C] hover:bg-[#a8152d] text-white px-10 py-4 rounded-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-3 shadow-[0_0_40px_rgba(194,30,60,0.35)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(194,30,60,0.5)] hover:scale-[1.03]"
          >
            <span>EXPLORE CATALOGUE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link
            to="/about"
            className="backdrop-blur-md bg-white/5 border border-white/20 hover:border-[#C21E3C]/70 hover:bg-white/10 text-white px-9 py-4 rounded-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300"
          >
            OUR ETHOS
          </Link>
        </motion.div>

        {/* Slide indicators — dots only, no controller */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex items-center gap-2 pt-2"
        >
          {carouselJerseys.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-500 ${
                currentIndex === idx
                  ? 'w-8 h-1.5 bg-[#C21E3C]'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll hint arrow ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/40">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};
