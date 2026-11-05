"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🔗 APNI PASAND KA SOUND URL YAHA PASTE KAREIN (MP3/WAV Format):
const ABOUT_CUSTOM_SOUND_URL = "/mixkit-negative-tone-interface-tap-2569.wav"; 

const historyEras = [
  { 
    year: "1916", 
    era: "The Heritage Origin", 
    heading: "Bayerische Motoren Werke", 
    text: "Aircraft engines to undisputed premium road absolute dominance. Our blueprint started with absolute mathematical discipline.",
    stat: "110+ Years Legacy"
  },
  { 
    year: "1972", 
    era: "The Birth of M Power", 
    heading: "Where Motorsport Meets Road", 
    text: "M was created to fuel racing programs. It became the single most powerful letter globally representing pure engineering adrenaline.",
    stat: "M Performance Era"
  },
  { 
    year: "2026", 
    era: "The Digital Neon Future", 
    heading: "The Neue Klasse Concept", 
    text: "Zero emissions synced flawlessly beside high velocity custom computing. Intelligent luxury that interacts directly with your senses.",
    stat: "Next-Gen Vision Active"
  }
];

export default function AboutBMW() {
  const [currentEra, setCurrentEra] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize Audio Dynamic Link
  useEffect(() => {
    if (typeof window !== "undefined" && ABOUT_CUSTOM_SOUND_URL) {
      audioRef.current = new Audio(ABOUT_CUSTOM_SOUND_URL);
      audioRef.current.volume = 0.9; // Sound ki volume yahan se control kar sakti hain
    }
  }, []);

  const switchEra = (index: number) => {
    if (index !== currentEra) {
      setCurrentEra(index);
      
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Rewind to start for instant replay
        audioRef.current.play().catch((err) => 
          console.log("Browser safety rules handled. Audio fires perfectly after user interactions.", err)
        );
      }
    }
  };

  return (
    <section className="py-24 px-8 md:px-16 bg-[#040404] text-white border-t border-white/5 overflow-hidden">
        <section id="about" className="py-24 px-8 md:px-16 bg-[#040404] ..."/>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        
        {/* LEFT COLUMN: Era Selector Rail Links */}
        <div className="md:col-span-4 space-y-6">
          <p className="text-xs tracking-[0.4em] text-blue-500 uppercase">04 / Corporate DNA</p>
          <h2 className="text-3xl font-light tracking-wider uppercase">The Legacy <br/><span className="font-bold text-white">Timeline</span></h2>
          
          <div className="flex flex-col space-y-4 pt-8 border-l border-white/5">
            {historyEras.map((item, idx) => (
              <button
                key={item.year}
                onClick={() => switchEra(idx)}
                className={`text-left pl-6 py-2 transition-all duration-300 relative outline-none group`}
              >
                {currentEra === idx && (
                  <motion.div 
                    layoutId="activeBarIndicator"
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 shadow-[0_0_15px_#1c69d4]"
                  />
                )}
                <span className={`block font-mono text-xs tracking-widest ${currentEra === idx ? "text-blue-400 font-bold" : "text-gray-600 group-hover:text-gray-400"}`}>
                  {item.year}
                </span>
                <span className={`block text-sm uppercase tracking-wider mt-1 ${currentEra === idx ? "text-white font-medium" : "text-gray-500 group-hover:text-gray-300"}`}>
                  {item.era}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Big Dynamic Content Cards Canvas */}
        <div className="md:col-span-8 bg-[#090909] border border-white/5 p-12 min-h-[350px] flex flex-col justify-between rounded-sm relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEra}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              <span className="font-mono text-7xl font-black text-white/5 absolute right-8 top-6 select-none">
                {historyEras[currentEra].year}
              </span>
              
              <h3 className="text-2xl md:text-3xl font-bold tracking-wide uppercase text-white">
                {historyEras[currentEra].heading}
              </h3>
              
              <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide max-w-2xl">
                {historyEras[currentEra].text}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="pt-8 mt-8 border-t border-white/5 flex justify-between items-center text-xs tracking-[0.2em] text-gray-500 uppercase">
            <span>BMW Group Verified Vitals</span>
            <motion.span 
              key={currentEra + "-stat"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-blue-500 font-bold tracking-widest"
            >
              // {historyEras[currentEra].stat}
            </motion.span>
          </div>

        </div>

      </div>
    </section>
  );
}
