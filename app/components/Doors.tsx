"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


const CUSTOM_SOUND_URL = "/mixkit-negative-tone-interface-tap-2569.wav"; 

const lineups = [
  { id: "m", title: "M Power", desc: "Motorsport DNA engineering. Pure high-performance track-ready cockpits built for ultimate adrenaline.", feature: "Twin-turbocharged V8 • Active M Differential • Carbon Roof" },
  { id: "i", title: "i Electric", desc: "The future of elite electric locomotion. Zero emissions with uncompromising luxury dynamics.", feature: "Next-gen eDrive motors • Panoramic Curved Screen • EcoLuxury materials" },
  { id: "x", title: "X Series", desc: "Commanding road presence mixed with intelligent xDrive multi-terrain sports activity architecture.", feature: "Intelligent All-Wheel Drive • Dynamic Damper Control • Increased Cargo" }
];

export default function Doors() {
  const [activeTab, setActiveTab] = useState("m");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize Audio Dynamic Link
  useEffect(() => {
    if (typeof window !== "undefined" && CUSTOM_SOUND_URL) {
      audioRef.current = new Audio(CUSTOM_SOUND_URL);
      audioRef.current.volume = 0.5; // Sound ki volume yahan se barha/kam kar sakti hain (0.0 se 1.0)
    }
  }, []);

  const handleTabChange = (id: string) => {
    if (id !== activeTab) {
      setActiveTab(id);
      
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Rewind to start for back-to-back clicks
        audioRef.current.play().catch((err) => 
          console.log("Browser safety rules handled. Audio will fire on first active user click.", err)
        );
      }
    }
  };

  return (
    <section className="py-24 px-8 md:px-16 bg-black text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 flex flex-col space-y-4">
          <p className="text-xs tracking-[0.3em] text-blue-500 uppercase">02 / The Lineup</p>
          <h2 className="text-3xl font-light tracking-widest uppercase">Three Doors. <br/><span className="font-bold text-white">One Drive.</span></h2>
          
          <div className="flex flex-col space-y-2 pt-8">
            {lineups.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`text-left text-lg py-3 tracking-widest uppercase border-b transition-all duration-300 outline-none ${activeTab === item.id ? "border-blue-500 text-white pl-2" : "border-white/10 text-gray-500 hover:text-gray-300"}`}
              >
                — {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-[#0a0a0a] p-12 border border-white/5 flex flex-col justify-between min-h-[300px]">
          <AnimatePresence mode="wait">
            {lineups.map((item) => item.id === activeTab && (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold tracking-wider uppercase text-blue-400">{item.title} Engineering</h3>
                <p className="text-gray-400 leading-relaxed tracking-wide text-sm md:text-base">{item.desc}</p>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Core Tech Spec Matrix</p>
                  <p className="text-sm font-medium tracking-wide text-white">{item.feature}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
