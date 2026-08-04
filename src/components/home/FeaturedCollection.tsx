import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { JERSEYS } from '../../data/jerseys';
import { ProductCard } from '../common/ProductCard';
import { Link } from 'react-router-dom';

export const FeaturedCollection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const featuredList = [JERSEYS[2], JERSEYS[4], JERSEYS[11]]; // Barcelona, Real Madrid, Brazil vintage

  return (
    <section ref={ref} className="relative bg-[#040404] py-24 px-6 sm:px-8 border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto relative space-y-12">

        {/* Top Header */}
        <div className="flex items-end justify-between border-b border-neutral-900 pb-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C21E3C] font-bold block mb-1">
              HANDPICKED FOR YOU
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              NEW ARCHIVE ARRIVALS
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            <Link
              to="/shop"
              className="text-xs font-mono text-[#C21E3C] hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors group shrink-0"
            >
              <span>VIEW ALL KITS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Section Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.18, ease: 'easeOut' }}
          className="text-neutral-500 text-xs sm:text-sm font-light max-w-xl -mt-4"
        >
          Clean technical tailoring and historic crests. Sourced and certified by ZOID Studios.
        </motion.p>

        {/* Grid with staggered cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredList.map((jersey, i) => (
            <motion.div
              key={jersey.id}
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.14, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ProductCard jersey={jersey} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
