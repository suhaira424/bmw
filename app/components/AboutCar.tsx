"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function AboutCar() {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [isActive, setIsActive] = useState(false); // Controls instrument cluster ignition
  const soundFired = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    // Simulation loop starts strictly after user interaction gesture bypass
    const interval = setInterval(() => {
      setSpeed((prevSpeed) => {
        if (prevSpeed >= 305) {
          clearInterval(interval);
          if (!soundFired.current) {
            triggerExhaustRoar();
            soundFired.current = true;
          }
          return 305;
        }
        return prevSpeed + 3;
      });

      setRpm((prevRpm) => {
        if (prevRpm >= 7200) return 7200;
        return prevRpm + 71;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [isActive]);

  // Guaranteed Web Audio Synthesis Engine (Bypasses local assets missing bugs)
  const triggerExhaustRoar = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = "sawtooth"; // Twin-turbo core throttle engine profile
      osc.frequency.setValueAtTime(65, ctx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.18);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.7); 
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime); // Sports acoustics filtration
      
      gain.gain.setValueAtTime(0.25, ctx.currentTime); // Amplified sound feedback level
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {
      console.log("Audio pipeline state check active.", e);
    }
  };

  const startIgnition = () => {
    setIsActive(true);
    setSpeed(0);
    setRpm(0);
    soundFired.current = false;
  };

  const speedNeedleRotation = -120 + (speed / 305) * 240; 
  const rpmNeedleRotation = -120 + (rpm / 7200) * 240;

  return (
    <section className="py-24 px-8 md:px-16 bg-[#060606] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col space-y-16">
        
        {/* Top Header Grid Content */}
        <div className="max-w-3xl space-y-4">
          <p className="text-xs tracking-[0.4em] text-blue-500 uppercase">03 / Instrumentation</p>
          <h2 className="text-3xl md:text-5xl font-light tracking-wider uppercase">Live M Cockpit <br/><span className="font-bold text-white">Dual-Pod Dashboard</span></h2>
          <p className="text-gray-400 text-sm leading-relaxed tracking-wide">
            Experience absolute real-time engine telemetry. Press the ignition pulse link below to initialize the TwinPower digital dashboard diagnostics stream securely with unfiltered exhaust audio feedback loops.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="w-full bg-[#0b0b0b] py-16 px-8 border border-white/5 rounded-md flex flex-col items-center space-y-12">
          
          {/* Dual Pods Framework Layout */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center items-center">
            
            {/* TACHOMETER (RPM POD) */}
            <div className="relative w-64 h-64 rounded-full border-4 border-dashed border-white/5 flex items-center justify-center bg-black/40">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="110" stroke="#111" strokeWidth="8" fill="transparent" />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#ef4444"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray="690"
                  strokeDashoffset={690 - (rpm / 7200) * 500}
                  transition={{ ease: "easeOut" }}
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-[9px] tracking-[0.3em] text-gray-500 uppercase block mb-1">Tachometer</span>
                <h3 className="text-4xl font-black font-mono tracking-tight text-white">{(rpm / 1000).toFixed(1)}</h3>
                <span className="text-[10px] font-semibold tracking-widest text-red-500 uppercase block mt-1">RPM X1000</span>
              </div>
              <div 
                className="absolute w-2 h-26 bottom-1/2 left-1/2 origin-bottom transform -translate-x-1/2 transition-transform duration-75 ease-out"
                style={{ transform: `translateX(-50%) rotate(${rpmNeedleRotation}deg)` }}
              >
                <div className="w-[3px] h-full bg-gradient-to-t from-transparent via-red-500 to-red-400 rounded-full shadow-[0_0_12px_#ef4444]" />
              </div>
            </div>

            {/* SPEEDOMETER (KM/H POD) */}
            <div className="relative w-64 h-64 rounded-full border-4 border-dashed border-white/5 flex items-center justify-center bg-black/40">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="110" stroke="#111" strokeWidth="8" fill="transparent" />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#1c69d4"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray="690"
                  strokeDashoffset={690 - (speed / 305) * 500}
                  transition={{ ease: "easeOut" }}
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-[9px] tracking-[0.3em] text-gray-500 uppercase block mb-1">Velocity</span>
                <h3 className="text-5xl font-black font-mono tracking-tight text-white">{speed}</h3>
                <span className="text-[10px] font-semibold tracking-widest text-blue-500 uppercase block mt-1">KM/H</span>
              </div>
              <div 
                className="absolute w-2 h-26 bottom-1/2 left-1/2 origin-bottom transform -translate-x-1/2 transition-transform duration-75 ease-out"
                style={{ transform: `translateX(-50%) rotate(${speedNeedleRotation}deg)` }}
              >
                <div className="w-[3px] h-full bg-gradient-to-t from-transparent via-blue-500 to-blue-400 rounded-full shadow-[0_0_12px_#1c69d4]" />
              </div>
            </div>

          </div>

          {/* Ignition Control Link Button Trigger */}
          <div className="text-center space-y-4">
            <button 
              onClick={startIgnition}
              className="px-8 py-4 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 rounded-sm shadow-[0_0_30px_rgba(28,105,212,0.1)]"
            >
              {isActive ? "Re-Ignition M Track" : "Activate M Cockpit"}
            </button>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">
              {!isActive ? "Engine Offline • Click Activation Required" : speed < 305 ? "Throttling Power Curves..." : "V-MAX Peak Reached • Exhaust Succeeded"}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
