import React, { useRef } from 'react';
import { JERSEYS } from '../../data/jerseys';
import { ProductCard } from '../common/ProductCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const TrendingCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-[#050505] py-20 px-6 sm:px-8 border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              TRENDING JERSEYS
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-[#C21E3C] hover:border-[#C21E3C] transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center hover:bg-[#C21E3C] hover:border-[#C21E3C] transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {JERSEYS.map((jersey) => (
            <div key={jersey.id} className="w-[280px] sm:w-[320px] shrink-0">
              <ProductCard jersey={jersey} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
