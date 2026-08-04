import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Eye } from 'lucide-react';
import { JERSEYS } from '../../data/jerseys';
import { useCart } from '../../context/CartContext';
import { formatNaira } from '../../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { setSelectedJerseyForModal, addToCart } = useCart();

  if (!isOpen) return null;

  const popularTags = [
    'Nottingham Forest',
    'West Ham',
    'Germany',
    'Chelsea',
    'Ajax',
    'Manchester United',
    'Brazil',
    'Nigeria 2018'
  ];

  const filtered = query.trim()
    ? JERSEYS.filter(
        (j) =>
          j.name.toLowerCase().includes(query.toLowerCase()) ||
          j.clubOrCountry.toLowerCase().includes(query.toLowerCase()) ||
          j.season.toLowerCase().includes(query.toLowerCase()) ||
          j.description.toLowerCase().includes(query.toLowerCase()) ||
          (j.tag && j.tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative bg-[#0A0A0A] border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl z-10 text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Search Input Bar */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 text-[#C21E3C] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search by club, player, season..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#C21E3C]"
            />
          </div>

          {/* Popular Search Tags */}
          {!query && (
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-3 font-semibold">
                POPULAR SEARCHES
              </span>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-neutral-900 border border-neutral-800 hover:border-[#C21E3C] hover:text-white text-neutral-300 px-3.5 py-1.5 rounded-full font-mono text-xs transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query && (
            <div className="mt-4 max-h-[55vh] overflow-y-auto no-scrollbar space-y-3">
              {filtered.length === 0 ? (
                <p className="text-center py-8 text-neutral-500 font-mono text-xs uppercase">
                  NO JERSEYS FOUND MATCHING "{query}"
                </p>
              ) : (
                filtered.map((jersey) => (
                  <div
                    key={jersey.id}
                    className="bg-[#121212] border border-neutral-800 rounded-2xl p-3 flex items-center justify-between gap-4 hover:border-[#C21E3C] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={jersey.mainImage}
                        alt={jersey.name}
                        className="w-14 h-14 rounded-xl object-cover bg-neutral-950 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                          {jersey.clubOrCountry}
                        </span>
                        <h4 className="font-sans text-sm font-medium text-white truncate group-hover:text-[#C21E3C] transition-colors">
                          {jersey.name}
                        </h4>
                        <span className="font-mono text-xs font-bold text-[#C21E3C]">
                          {formatNaira(jersey.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedJerseyForModal(jersey);
                          onClose();
                        }}
                        className="p-2 bg-neutral-900 rounded-full text-white hover:bg-[#C21E3C] transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          addToCart(jersey, 'L');
                        }}
                        className="px-3 py-1.5 bg-[#C21E3C] hover:bg-[#A0152F] text-white rounded-full font-mono text-xs uppercase font-bold tracking-wider transition-colors"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
