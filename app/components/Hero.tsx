"use client";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const [userWantsSound, setUserWantsSound] = useState(false); // Tracks if user manually unmuted
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Smart Scroll Sound Controller Engine (Intersection Observer)
  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            // User is looking at the video section
            if (userWantsSound) {
              videoRef.current.muted = false;
              setIsMuted(false);
            }
          } else {
            // User scrolled away from the video section -> Auto Mute/Pause Sound
            videoRef.current.muted = true;
            setIsMuted(true);
          }
        }
      },
      {
        threshold: 0.15, // Triggers as soon as 85% of the video goes off-screen
      }
    );

    observer.observe(currentSection);

    return () => {
      if (currentSection) observer.unobserve(currentSection);
    };
  }, [userWantsSound]);

  const toggleMute = () => {
    if (videoRef.current) {
      const currentMuted = videoRef.current.muted;
      videoRef.current.muted = !currentMuted;
      setIsMuted(!currentMuted);
      setUserWantsSound(currentMuted); // Save user selection (true if they just unmuted)
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-black"
    >
      {/* High Quality Cinematic Video Background */}
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted={isMuted} 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50 transition-opacity duration-700"
      >
        <source src="/14912521-uhd_2158_3840_60fps.mp4" type="video/mp4" />
      </video>

      {/* Dark Luxury Overlay Filters */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60 z-10" />

      {/* Audio Controller Element (Floating Bar) */}
      <div 
        className="absolute bottom-10 right-10 z-30 flex items-center gap-4 bg-black/40 backdrop-blur-md px-5 py-3 border border-white/10 rounded-full cursor-pointer select-none group" 
        onClick={toggleMute}
      >
        {/* Equalizer Waveform Bars Layout */}
        <div className="flex items-end gap-[3px] h-4 w-6">
          {[1, 2, 3, 4, 5].map((bar) => (
            <motion.span
              key={bar}
              className="w-[2px] bg-blue-500 origin-bottom"
              animate={!isMuted ? {
                scaleY: [1, 2.5, 1.2, 3, 1.5, 1]
              } : {
                scaleY: 0.2
              }}
              transition={{
                duration: 1 + bar * 0.15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-gray-300 group-hover:text-white transition-colors">
          {!isMuted ? "Sound On" : "Sound Off"}
        </span>
        
        {!isMuted ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
      </div>

      {/* Primary Landing Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-7xl font-bold tracking-[0.25em] text-white mb-6 uppercase"
        >
          Sheer Driving Pleasure
        </motion.h1>

        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="text-xs md:text-sm tracking-[0.4em] text-blue-400 font-semibold mb-10 uppercase"
        >
          Synchronized Luxury • High Velocity Audio Experience
        </motion.p>
<a href="#models">
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#000000" }}
          className="px-8 py-4 border border-white/30 text-white tracking-[0.2em] text-xs uppercase font-medium bg-transparent transition-all duration-300"
        >
          Explore Collection
        </motion.button>
        </a>
      </div>
    </section>
  );
}
