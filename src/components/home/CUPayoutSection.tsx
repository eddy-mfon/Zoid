import { motion } from "motion/react";
import { Truck, ShieldCheck, Clock, Send, Sparkles, ArrowRight } from "lucide-react";

const perks = [
  {
    icon: ShieldCheck,
    title: "Exclusive Student Rates",
    desc: "Special discounted pricing built exclusively for CU students. Show your student ID to unlock.",
  },
  {
    icon: Truck,
    title: "Direct Campus Delivery",
    desc: "Fast, hassle-free delivery right to your door anywhere on the Covenant University campus.",
  },
  {
    icon: Clock,
    title: "3–5 Days + Express Option",
    desc: "Standard 3–5 day timeline with optional 24–48hr express delivery available on request.",
  },
  {
    icon: Send,
    title: "Instant Telegram Updates",
    desc: "Real-time alerts for new drops, restocks, and flash sales — all on Telegram.",
  },
];

export function CUPayoutSection() {
  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden border-t border-neutral-900">
      {/* Ambient crimson glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C21E3C]/8 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-[#111111] via-[#131313] to-[#0D0D0D] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">

          {/* Top accent stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C21E3C] to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* ── Left: Content ── */}
            <div className="p-10 sm:p-14 flex flex-col justify-center">
              {/* Campus badge */}
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#C21E3C]/15 border border-[#C21E3C]/35 text-[#C21E3C] font-mono text-[10px] font-black uppercase tracking-[0.25em] rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  CAMPUS EXCLUSIVE
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-[#C21E3C]/30 to-transparent" />
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl font-black font-display text-white uppercase tracking-tight leading-[0.95] mb-4"
              >
                ZOID
                <span className="text-[#C21E3C]"> × CU</span>
                <br />
                STUDENT PERKS
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-neutral-400 text-sm font-light leading-relaxed mb-10 max-w-md"
              >
                Covenant University students get priority access to exclusive pricing, campus delivery, and personalised kit curation — because your fit matters on campus too.
              </motion.p>

              {/* Perks grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {perks.map((perk, idx) => {
                  const Icon = perk.icon;
                  return (
                    <motion.div
                      key={perk.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex gap-3 items-start bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4"
                    >
                      <div className="p-2.5 bg-[#C21E3C]/12 border border-[#C21E3C]/25 text-[#C21E3C] rounded-xl shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-white text-xs font-black font-display uppercase tracking-wide mb-1">{perk.title}</h4>
                        <p className="text-neutral-500 text-[11px] font-sans leading-relaxed">{perk.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <a
                  href="https://t.me/zoidkits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-[#C21E3C] hover:bg-[#a8152d] text-white px-8 py-4 rounded-full font-mono text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-xl shadow-[#C21E3C]/25 hover:shadow-[#C21E3C]/45 hover:scale-[1.03]"
                >
                  <Send className="w-4 h-4" />
                  <span>CLAIM CU STUDENT DISCOUNT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </motion.div>
            </div>

            {/* ── Right: Visual badge panel ── */}
            <div className="relative bg-[#080808] border-l border-neutral-800/60 flex items-center justify-center p-10 sm:p-14 min-h-[400px]">
              {/* Decorative grid pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02]" />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative flex flex-col items-center text-center gap-6 z-10"
              >
                {/* CU Crest Ring */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C21E3C]/20 to-[#C21E3C]/5 border-2 border-[#C21E3C]/40 flex items-center justify-center shadow-2xl shadow-[#C21E3C]/15">
                    <span className="font-display font-black text-5xl text-[#C21E3C] tracking-widest">CU</span>
                  </div>
                  {/* Rotating outer ring */}
                  <div className="absolute inset-[-8px] rounded-full border border-dashed border-[#C21E3C]/20 animate-[spin_20s_linear_infinite]" />
                </div>

                <div className="space-y-2">
                  <p className="text-[#C21E3C] font-mono text-[9px] font-black uppercase tracking-[0.3em]">VERIFIED CAMPUS PARTNER</p>
                  <h3 className="text-white font-black font-display text-2xl uppercase tracking-tight">
                    EXPRESS ROOM
                    <br />
                    DELIVERY
                  </h3>
                  <p className="text-neutral-500 font-mono text-[10px]">Standard 3–5 Days  ·  Express 24–48 Hrs</p>
                </div>

                {/* Delivery Rate pill */}
                <div className="bg-[#111111] border border-neutral-700 rounded-2xl px-8 py-4 text-center">
                  <p className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider mb-1">FLAT DELIVERY RATE</p>
                  <p className="text-white font-black font-display text-2xl tracking-tight">₦4,500</p>
                  <p className="text-[#C21E3C] font-mono text-[9px] mt-1">TO YOUR CAMPUS DOOR</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
