import React, { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useRef } from 'react';
import { JERSEYS } from '../../data/jerseys';
import { ProductCard } from '../common/ProductCard';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const CollectionsGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: '-60px' });

  const tabs = ['ALL', 'Club', 'National', 'Limited Drop'];

  const filteredJerseys = JERSEYS.filter((j) => {
    if (activeTab === 'Club') return j.category === 'Club';
    if (activeTab === 'National') return j.category === 'National';
    if (activeTab === 'Limited Drop') return j.isLimitedDrop;
    return true;
  });

  return (
    <section className="bg-black py-24 px-6 sm:px-8 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            custom={0}
            className="space-y-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C21E3C] font-bold">
              THE FULL ARCHIVE
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              EXPLORE KITS
            </h2>
          </motion.div>

          {/* Filter Pills */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            custom={1}
            className="flex flex-wrap items-center gap-2 bg-[#0A0A0A] p-1.5 rounded-full border border-neutral-800"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full font-display text-xs uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-[#C21E3C] text-white shadow-lg font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Grid with staggered entrance */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredJerseys.slice(0, 9).map((jersey, i) => (
              <motion.div
                key={jersey.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
              >
                <ProductCard jersey={jersey} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View Full Catalog Link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-[#C21E3C] border border-neutral-800 text-white px-8 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300"
          >
            <span>VIEW FULL CATALOGUE</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
