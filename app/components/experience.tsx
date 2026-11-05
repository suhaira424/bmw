"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Flag, Timer, MapPin, Users } from "lucide-react";

// --- Sound settings ---
const HOVER_SOUND_SRC = "/mixkit-negative-tone-interface-tap-2569.wav";
const HOVER_SOUND_VOLUME = 0.5;

// --- Opening animation timing (seconds) ---
const LINE_DURATION = 0.6;   // neeli line ka neeche aana
const PANEL_DELAY = 0.5;     // panels kitni der baad khulein
const PANEL_DURATION = 0.9;  // panels ke khulne ki speed
const CONTENT_DELAY = 1.2;   // content kab aana shuru ho

const experiences = [
  {
    id: 1,
    icon: Flag,
    title: "Track Day",
    tag: "01",
    text: "Take the wheel on a closed circuit with professional instructors. Feel the limits of M engineering at full throttle.",
    detail: "Full day / Instructor led",
  },
  {
    id: 2,
    icon: Timer,
    title: "Performance Driving",
    tag: "02",
    text: "Master braking points, racing lines and car control through guided sessions built for adrenaline drivers.",
    detail: "Half day / All skill levels",
  },
  {
    id: 3,
    icon: MapPin,
    title: "Scenic Road Tour",
    tag: "03",
    text: "A curated drive through winding mountain roads, designed to show how M power feels on real tarmac.",
    detail: "2 days / Guided convoy",
  },
  {
    id: 4,
    icon: Users,
    title: "Private Showroom Visit",
    tag: "04",
    text: "Book a private session with our specialists to explore the fleet, configure your car and test drive.",
    detail: "1 hour / By appointment",
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);

  // Jab section screen par aaye tab animation shuru (sirf ek baar)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  // Hover sound preload
  useEffect(() => {
    const audio = new Audio(HOVER_SOUND_SRC);
    audio.preload = "auto";
    audio.volume = HOVER_SOUND_VOLUME;
    hoverAudioRef.current = audio;

    return () => {
      audio.pause();
      hoverAudioRef.current = null;
    };
  }, []);

  const playHoverSound = () => {
    const audio = hoverAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-24 px-8 md:px-16 bg-[#0a0a0a] text-white border-t border-white/5 relative overflow-hidden"
    >
      {/* ---------- OPENING ANIMATION OVERLAY ---------- */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Left panel */}
        <motion.div
          initial={{ x: 0 }}
          animate={inView ? { x: "-100%" } : { x: 0 }}
          transition={{
            duration: PANEL_DURATION,
            delay: PANEL_DELAY,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="absolute top-0 left-0 h-full w-1/2 bg-[#0a0a0a]"
        />
        {/* Right panel */}
        <motion.div
          initial={{ x: 0 }}
          animate={inView ? { x: "100%" } : { x: 0 }}
          transition={{
            duration: PANEL_DURATION,
            delay: PANEL_DELAY,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="absolute top-0 right-0 h-full w-1/2 bg-[#0a0a0a]"
        />
        {/* Center blue line */}
        <motion.div
          initial={{ scaleY: 0, opacity: 1 }}
          animate={inView ? { scaleY: [0, 1, 1], opacity: [1, 1, 0] } : {}}
          transition={{ duration: LINE_DURATION + 0.4, times: [0, 0.6, 1] }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-blue-500 origin-top shadow-[0_0_20px_rgba(59,130,246,0.9)]"
        />
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: CONTENT_DELAY }}
          className="mb-16 space-y-4"
        >
          <p className="text-xs tracking-[0.4em] text-blue-500 uppercase">
            06 / The Experience
          </p>
          <h2 className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase">
            Feel The <span className="font-bold text-white">M Power</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            Driving a BMW M is more than ownership. Choose an experience built
            around speed, precision and pure engineering.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ y: 50, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: CONTENT_DELAY + 0.3 + index * 0.15,
                }}
                onMouseEnter={playHoverSound}
                className="group relative bg-[#111] border border-white/5 rounded-sm p-8 hover:border-blue-500/40 transition-colors duration-300"
              >
                <span className="absolute top-6 right-6 text-5xl font-black text-white/5 group-hover:text-blue-500/20 transition-colors">
                  {item.tag}
                </span>

                <Icon className="w-6 h-6 text-blue-500 mb-6" />

                <h3 className="text-xl font-medium tracking-wider uppercase mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {item.text}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono">
                    {item.detail}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-blue-500 group-hover:text-white transition-colors">
                    Book →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}