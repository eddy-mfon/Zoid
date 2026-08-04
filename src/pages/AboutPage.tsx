import React from 'react';
import { ShieldCheck, Sparkles, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-28 px-6 sm:px-8 border-b border-neutral-900">
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* Editorial Minimal Header */}
        <div className="space-y-4 text-left">
          <span className="text-xs font-sans text-[#C21E3C] uppercase tracking-[0.2em] font-bold block">
            THE ZOID STORY
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-none">
            RETRO FOOTBALL. <br />
            <span className="text-[#C21E3C]">MODERN STREETWEAR.</span>
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg font-normal leading-relaxed pt-2 max-w-2xl">
            ZOID is an exclusive luxury sports aesthetic studio specializing in authentic retro club jerseys, national team grails, and limited streetwear drops.
          </p>
        </div>

        {/* Minimal Editorial Split Section */}
        <div className="border-t border-b border-neutral-900 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
              PRESERVING FOOTBALL CULTURE
            </h2>
          </div>
          <div className="md:col-span-7 space-y-6">
            <p className="text-neutral-300 text-sm sm:text-base font-normal leading-relaxed">
              We treat football shirts not just as sportswear, but as wearable art and high-fashion collectible artifacts. From 90s Serie A masterclasses to European cup finals, every kit tells a legendary story.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2.5 bg-[#C21E3C] hover:bg-[#A0152F] text-white px-7 py-3.5 rounded-full font-sans text-xs uppercase font-bold tracking-wider transition-all shadow-lg"
            >
              <span>EXPLORE CATALOGUE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Minimal 3 Pillars - Clean Grid with subtle borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition-colors">
            <div className="flex items-center gap-2.5 text-[#C21E3C]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-400">01</span>
            </div>
            <h3 className="font-display text-lg font-extrabold uppercase text-white tracking-wide">
              100% AUTHENTIC
            </h3>
            <p className="text-xs text-neutral-400 font-normal leading-relaxed">
              Verified for period-correct manufacturer tags, crest embroidery, and sponsor materials.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition-colors">
            <div className="flex items-center gap-2.5 text-[#C21E3C]">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-400">02</span>
            </div>
            <h3 className="font-display text-lg font-extrabold uppercase text-white tracking-wide">
              STREETWEAR CURATION
            </h3>
            <p className="text-xs text-neutral-400 font-normal leading-relaxed">
              Styled for modern street culture, festivals, and high-fashion wardrobe rotations.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-neutral-800 transition-colors">
            <div className="flex items-center gap-2.5 text-[#C21E3C]">
              <Send className="w-5 h-5" />
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-neutral-400">03</span>
            </div>
            <h3 className="font-display text-lg font-extrabold uppercase text-white tracking-wide">
              EXPRESS DELIVERY
            </h3>
            <p className="text-xs text-neutral-400 font-normal leading-relaxed">
              Fast direct room delivery (A102, B215, C307) with real-time Telegram updates.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

