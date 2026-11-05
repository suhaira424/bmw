"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gauge, Cpu, Zap } from "lucide-react";

// --- Sound settings ---
// File yahan honi chahiye: public/sounds/vroom.mp3
const SOUND_SRC = "sound-effects-motorbike-revving-up-taking-off-271981.mp3";
const SOUND_VOLUME = 0.7;
const SOUND_START_AT = 2; // seconds: audio kahan se shuru ho
const SOUND_DURATION_MS = 1500; // total kitni der bajni chahiye
const FADE_MS = 400; // aakhri kitne ms mein fade-out ho

type Car = {
  id: number;
  name: string;
  price: string;
  engine: string;
  hp: string;
  acceleration: string;
  img: string;
  overview: string;
};

const cars: Car[] = [
  {
    id: 1,
    name: "The M8 Coupe",
    price: "$134,100",
    engine: "4.4L TwinPower V8",
    hp: "617 HP",
    acceleration: "3.0 Sec",
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    overview:
      "The definition of elite track engineering remixed flawlessly beside absolute high luxury cabin materials. Built strictly for adrenaline drivers.",
  },
  {
    id: 2,
    name: "The i7 Luxury",
    price: "$105,700",
    engine: "Dual High-Performance Electric Motors",
    hp: "536 HP",
    acceleration: "4.5 Sec",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    overview:
      "The future of executive transportation. Combining a massive panoramic cinematic rear display cabin with ultra-quiet dynamic propulsion.",
  },
  {
    id: 3,
    name: "The XM Hybrid",
    price: "$159,000",
    engine: "4.4L V8 Plug-In Hybrid Powertrain",
    hp: "644 HP",
    acceleration: "4.1 Sec",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Commanding road authority backed by high hybrid torque and vectoring stability. A sports activity vehicle forged from pure luxury design rules.",
  },
  {
    id: 4,
    name: "The M4 Competition",
    price: "$84,900",
    engine: "3.0L TwinPower Inline-6",
    hp: "503 HP",
    acceleration: "3.5 Sec",
    img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
    overview:
      "Razor-sharp handling meets raw track-bred power. A compact coupe built to dominate corners and daily drives alike.",
  },
  {
    id: 5,
    name: "The iX Electric",
    price: "$87,250",
    engine: "Dual Electric Motors, xDrive",
    hp: "516 HP",
    acceleration: "4.4 Sec",
    img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    overview:
      "A bold electric SUV with a minimalist, tech-forward cabin. Silent power, long range, and a futuristic road presence.",
  },
  {
    id: 6,
    name: "The M5 Sedan",
    price: "$110,000",
    engine: "4.4L V8 Hybrid Powertrain",
    hp: "717 HP",
    acceleration: "3.4 Sec",
    img: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1200&q=80",
    overview:
      "The ultimate executive sports sedan. Boardroom comfort with supercar-level performance when the road opens up.",
  },
];

export default function Showroom() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearSoundTimers = () => {
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    stopTimeoutRef.current = null;
    fadeIntervalRef.current = null;
  };

  // Preload the sound file + cleanup on unmount
  useEffect(() => {
    const audio = new Audio(SOUND_SRC);
    audio.preload = "auto";
    audio.volume = SOUND_VOLUME;

    // Agar file load na ho (ghalat path / format) to console mein bata do
    audio.addEventListener("error", () => {
      console.error(
        "Sound load nahi hui. Check karein: public/sounds/vroom.mp3 maujood hai?",
        audio.error
      );
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      clearSoundTimers();
    };
  }, []);

  // Close modal with Escape key
  useEffect(() => {
    if (!selectedCar) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCar(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCar]);

  const playVroomVroomSound = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Purane timers saaf karo (agar user jaldi jaldi click kare)
    clearSoundTimers();

    // Agar audio SOUND_START_AT se chhoti hai to shuru se bajao
    const startAt =
      audio.duration && isFinite(audio.duration) && audio.duration <= SOUND_START_AT
        ? 0
        : SOUND_START_AT;

    audio.pause();
    audio.volume = SOUND_VOLUME;
    try {
      audio.currentTime = startAt;
    } catch {
      // metadata abhi load nahi hui, shuru se hi bajne do
    }

    audio.play().catch((e) => console.log("Audio play blocked:", e));

    // Duration poori hone se pehle fade-out shuru karo
    stopTimeoutRef.current = setTimeout(() => {
      const steps = 10;
      const stepMs = FADE_MS / steps;
      let step = 0;

      fadeIntervalRef.current = setInterval(() => {
        step++;
        audio.volume = Math.max(0, SOUND_VOLUME * (1 - step / steps));

        if (step >= steps) {
          clearSoundTimers();
          audio.pause();
          audio.volume = SOUND_VOLUME;
        }
      }, stepMs);
    }, Math.max(0, SOUND_DURATION_MS - FADE_MS));
  };

  const handleExploreCar = (car: Car) => {
    playVroomVroomSound();
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => setSelectedCar(car), 280);
  };

  return (
    <section
      id="models"
      className="py-24 px-8 md:px-16 bg-[#0a0a0a] text-white border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 space-y-4">
          <p className="text-xs tracking-[0.4em] text-blue-500 uppercase">
            05 / Digital Showroom
          </p>
          <h2 className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase">
            Featured <span className="font-bold text-white">M Fleet</span> Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.15 }}
              onClick={() => handleExploreCar(car)}
              className="group relative overflow-hidden bg-[#111] border border-white/5 rounded-sm p-4 cursor-pointer hover:border-white/10 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden mb-6 rounded-sm bg-black/20">
                <img
                  src={car.img}
                  alt={car.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-in-out opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium tracking-wider">{car.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Starting at {car.price}</p>
                </div>
                <span className="text-xs uppercase tracking-widest text-blue-500 group-hover:text-white transition-colors">
                  Explore →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed view modal */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCar(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f0f] border border-white/10 max-w-5xl w-full rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 relative shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setSelectedCar(null)}
                aria-label="Close"
                className="absolute top-6 right-6 z-10 p-2 bg-black/40 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-64 md:h-full min-h-[300px] bg-black">
                <img
                  src={selectedCar.img}
                  alt={selectedCar.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0f0f0f]" />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold font-mono block">
                    {"// M Fleet Core Matrix"}
                  </span>
                  <h3 className="text-3xl font-black uppercase tracking-wide text-white">
                    {selectedCar.name}
                  </h3>
                  <p className="text-2xl font-mono text-gray-300 font-light">
                    {selectedCar.price}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed pt-2 border-t border-white/5">
                    {selectedCar.overview}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-1">
                      <Cpu className="w-4 h-4 text-blue-500 mb-1" />
                      <span className="text-[9px] tracking-wider text-gray-500 uppercase block">
                        Powertrain
                      </span>
                      <p className="text-xs font-medium text-white">
                        {selectedCar.engine}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Gauge className="w-4 h-4 text-red-500 mb-1" />
                      <span className="text-[9px] tracking-wider text-gray-500 uppercase block">
                        Output
                      </span>
                      <p className="text-xs font-medium text-white">
                        {selectedCar.hp}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Zap className="w-4 h-4 text-yellow-500 mb-1" />
                      <span className="text-[9px] tracking-wider text-gray-500 uppercase block">
                        0-100 KM/H
                      </span>
                      <p className="text-xs font-medium text-white">
                        {selectedCar.acceleration}
                      </p>
                    </div>
                  </div>

                  <button className="w-full py-3 text-xs uppercase tracking-[0.3em] bg-white text-black hover:bg-blue-500 hover:text-white transition-colors">
                    Configure Specification
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}