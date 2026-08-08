import { motion } from "motion/react";
import { JERSEYS } from "../../data/jerseys";

const categories = [
  {
    id: "gym-jersey-sets",
    title: "GYM JERSEY SETS",
    price: "₦18,000",
    badge: "COMING SOON",
    image: JERSEYS[3]?.mainImage || "/Club/Inter Milan Home Jersey 2526.jpg",
    tagline: "Train in authentic style. Jersey + shorts engineered for performance.",
    details: [
      "Breathable training jersey",
      "Matching athletic shorts",
      "Moisture-wicking mesh fabric",
      "Pro athletic cut",
    ],
  },
  {
    id: "compression-wear",
    title: "COMPRESSION WEAR",
    price: "₦12,000",
    badge: "COMING SOON",
    image: JERSEYS[7]?.mainImage || "/Club/Lyon 2526.jpg",
    tagline: "Second-skin performance compression for serious training sessions.",
    details: [
      "High-elasticity compression top",
      "Ergonomic muscle support",
      "Quick-dry thermal fabric",
      "Ideal for base-layer training",
    ],
  },
  {
    id: "training-kits",
    title: "TRAINING KITS",
    price: "₦22,000",
    badge: "COMING SOON",
    image: JERSEYS[8]?.mainImage || "/Club/ManCity 2324.jpg",
    tagline: "Full tracksuit sets styled off official club training wear.",
    details: [
      "Full track jacket + pants set",
      "Reinforced active seams",
      "Lightweight wind & rain barrier",
      "Official training badge styling",
    ],
  },
  {
    id: "fitness-gear",
    title: "FITNESS GEAR",
    price: "₦8,500",
    badge: "COMING SOON",
    image: JERSEYS[10]?.mainImage || "/Club/Newcastle 2526.jpg",
    tagline: "ZOID-branded accessories to complete your training setup.",
    details: [
      "ZOID Grip Training Gloves",
      "Resistance bands set",
      "Insulated matte water bottle",
      "Heavy-duty gym drawstring bag",
    ],
  },
];

export function GymKitSection() {
  return (
    <section className="py-28 bg-[#060606] relative overflow-hidden border-t border-neutral-900">
      {/* Ambient glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#C21E3C]/6 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#C21E3C] font-mono text-[10px] tracking-[0.3em] uppercase font-bold mb-4"
          >
            PERFORMANCE & CULTURE
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight font-display leading-none mb-5"
          >
            ZOID
            <span className="text-[#C21E3C]"> GYM</span> KITS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-xl mx-auto text-sm font-light leading-relaxed"
          >
            High-performance athletic wear, compression gear, and training accessories designed for serious fitness enthusiasts.
          </motion.p>
        </div>

        {/* Four-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative bg-[#0D0D0D] border border-neutral-800 rounded-3xl overflow-hidden flex flex-col hover:border-[#C21E3C]/60 transition-all duration-500 shadow-xl hover:shadow-[0_0_40px_rgba(194,30,60,0.10)]"
            >
              {/* Jersey Cover */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-950">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.06] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />

                {/* Coming Soon badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black/80 backdrop-blur-sm border border-white/15 text-white font-mono text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1.5 rounded-full">
                    {cat.badge}
                  </span>
                </div>

                {/* Price */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-[#C21E3C]/40 px-2.5 py-1.5 rounded-full">
                  <span className="text-[#C21E3C] font-mono text-xs font-black">{cat.price}</span>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10">
                  <h3 className="text-white font-black font-display text-lg uppercase leading-tight group-hover:text-[#C21E3C] transition-colors duration-300">
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col p-5 space-y-4">
                <p className="text-neutral-500 text-[11px] font-light leading-relaxed border-l-2 border-[#C21E3C]/40 pl-3 italic">
                  {cat.tagline}
                </p>

                <div>
                  <p className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-neutral-600 mb-3">KIT INCLUDES</p>
                  <ul className="space-y-2">
                    {cat.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-neutral-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C21E3C] mt-1.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://t.me/zoidkits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full py-3 border border-neutral-700 hover:border-[#C21E3C] bg-neutral-900 hover:bg-[#C21E3C] text-neutral-300 hover:text-white font-mono text-[10px] font-black text-center uppercase tracking-[0.15em] transition-all duration-300 rounded-xl block"
                >
                  ENQUIRE ON TELEGRAM
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
