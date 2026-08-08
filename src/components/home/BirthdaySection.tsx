import { motion } from "motion/react";
import { JERSEYS } from "../../data/jerseys";

const packages = [
  {
    id: "starter",
    tier: "STARTER",
    title: "STARTER\nKIT",
    price: "₦28,000",
    badge: "MOST POPULAR",
    image: JERSEYS[0]?.mainImage || "/Club/AC Milan Home Jersey 2526.jpg",
    tagline: "The perfect opening gift — one iconic retro jersey, fully packed and ready to celebrate.",
    inclusions: [
      "Jersey or Retro Jersey (without customization)",
      "Shorts",
      "Socks",
      "Card (Birthday or Complimentary)",
      "Sports Bag",
    ],
  },
  {
    id: "matchday",
    tier: "MATCH DAY",
    title: "MATCH DAY\nKIT",
    price: "₦45,000",
    badge: "GREAT GIFT",
    image: JERSEYS[2]?.mainImage || "/Club/Barca .jpg",
    tagline: "Game-ready from head to toe — everything needed for a proper birthday appearance.",
    inclusions: [
      "Jersey or Retro Jersey (without customization)",
      "Shorts",
      "Socks",
      "Shin Guards",
      "Compression Shirt",
      "Card (Birthday or Complimentary)",
      "Gift Box",
    ],
  },
  {
    id: "premium",
    tier: "PREMIUM",
    title: "PREMIUM\nKIT",
    price: "₦65,000",
    badge: "BEST VALUE",
    image: JERSEYS[4]?.mainImage || "/Club/Jersey Real Madrid 20262027.jpg",
    tagline: "The full collection — compression layers, a football, and luxury gift packaging included.",
    inclusions: [
      "Jersey or Retro Jersey (without customization)",
      "Shorts",
      "Socks",
      "Shin Guards",
      "Compression Shirt",
      "Compression Shorts",
      "Football",
      "Sports Bag",
      "Card (Birthday or Complimentary)",
      "Gift Box",
    ],
  },
  {
    id: "athlete",
    tier: "ATHLETE'S",
    title: "ATHLETE'S\nKIT",
    price: "₦90,000",
    badge: "ULTIMATE",
    image: JERSEYS[6]?.mainImage || "/Club/ManCity 2324.jpg",
    tagline: "Everything in the Premium Kit plus boots, free delivery, and the full athlete experience.",
    inclusions: [
      "Jersey or Retro Jersey (without customization)",
      "Shorts",
      "Socks",
      "Shin Guards",
      "Compression Shirt",
      "Compression Shorts",
      "Studded / Studless Boots",
      "Football",
      "Sports Bag",
      "Card (Birthday or Complimentary)",
      "Gift Box",
      "Free Delivery",
    ],
  },
];

export function BirthdaySection() {
  return (
    <section className="py-28 bg-[#080808] border-t border-neutral-900 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#C21E3C]/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#C21E3C] font-mono text-[10px] tracking-[0.3em] uppercase font-bold mb-4"
          >
            CURATED CELEBRATIONS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight font-display leading-none mb-5"
          >
            BIRTHDAY
            <span className="text-[#C21E3C]"> SPECIAL</span> KITS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-xl mx-auto text-sm font-light leading-relaxed"
          >
            Gift a piece of football culture. Authentic retro kits styled, customised, and packaged for the birthday star.
          </motion.p>
        </div>

        {/* Package Cards — 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative bg-[#0D0D0D] border border-neutral-800 rounded-3xl overflow-hidden flex flex-col hover:border-[#C21E3C]/60 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(194,30,60,0.12)]"
            >
              {/* Jersey Cover */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-950">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.06] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent" />

                {/* Badge — top left */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#C21E3C] text-white font-mono text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg shadow-[#C21E3C]/30">
                    {pkg.badge}
                  </span>
                </div>

                {/* Price — top right */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                  <span className="text-white font-mono text-sm font-black">{pkg.price}</span>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10">
                  <p className="text-[#C21E3C] font-mono text-[9px] tracking-[0.3em] uppercase font-bold mb-1">{pkg.tier}</p>
                  <h3 className="text-white font-black font-display text-xl uppercase leading-tight whitespace-pre-line group-hover:text-[#C21E3C] transition-colors duration-300">
                    {pkg.title}
                  </h3>
                </div>
              </div>

              {/* Details Panel */}
              <div className="flex-1 flex flex-col p-5 space-y-4">
                <p className="text-neutral-500 text-[11px] font-light leading-relaxed border-l-2 border-[#C21E3C]/50 pl-3 italic">
                  {pkg.tagline}
                </p>

                {/* What's Inside */}
                <div>
                  <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-neutral-500 mb-3">PACKAGE ENTAILS</p>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-neutral-300 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C21E3C] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <a
                  href="https://t.me/zoidkits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full py-3.5 bg-[#C21E3C] hover:bg-[#a8152d] text-white font-mono text-[10px] font-black text-center uppercase tracking-[0.15em] transition-all duration-300 rounded-2xl shadow-lg shadow-[#C21E3C]/20 hover:shadow-[#C21E3C]/40 hover:scale-[1.02] block"
                >
                  ORDER BIRTHDAY PACKAGE
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
