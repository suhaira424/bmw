"use client";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Doors from "./components/Doors";
import Showroom from "./components/Showroom";
import AboutCar from "./components/AboutCar";
import About from "./About";
import IntroSplash from "./components/IntroSplash";
import Experience from "./components/experience";
import { ArrowUp } from "lucide-react";
import { FaInstagram, FaXTwitter, FaFacebookF } from "react-icons/fa6";
export default function Home() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white select-none">
      <Navbar />
      <Hero />
      <Stats />
      <Doors />
      <Showroom />
      <AboutCar />
      <About />
      <Experience />
     <IntroSplash
  soundSrc="/Reelaudio-1896.mp3"
  soundStart={6}
  soundEnd={11}
  textDuration={2800}
  lightsDuration={1300}
    
/>

      {/* CLASSICAL LUXURY FOOTER INTEGRATION */}
      <footer className="bg-[#050505] text-white border-t border-white/5 pt-16 pb-12 px-8 md:px-16 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 pb-12 border-b border-white/5">

          {/* COLUMN 1: BRAND IDENTITY DESCRIPTION */}
          <div className="space-y-4 md:col-span-1">
            <div className="text-xl font-black tracking-[0.3em] text-white">M POWER</div>
            <p className="text-xs text-gray-500 leading-relaxed tracking-wider">
              Crafting pure automotive precision and luxury locomotion benchmarks for over a century. Engineering driving adrenaline.
            </p>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION LINKS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-blue-500">
              {"// Navigation"}
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-[0.15em] text-gray-400">
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors duration-300 outline-none text-left"
                >
                  Home / Top
                </button>
              </li>
              <li>
                <a href="#models" className="hover:text-white transition-colors duration-300">
                  Featured Models
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-300">
                  Our Legacy
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CORPORATE CONNECTIONS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
              {"// Experience"}
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-[0.15em] text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Book Test Drive</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">M Configurator</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Find Dealership</a></li>
            </ul>
          </div>

          {/* COLUMN 4: SOCIAL NETWORKING LINK CHANNELS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
              {"// Connect"}
            </h4>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" aria-label="Instagram" className="hover:text-blue-500 transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="X (Twitter)" className="hover:text-blue-400 transition-colors">
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-blue-600 transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[10px] text-gray-600 tracking-widest uppercase pt-2">
              Karachi Region Digital Hub
            </p>
          </div>

        </div>

        {/* BOTTOM LEGAL AND COPYRIGHT META SECTION */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] text-gray-600 uppercase space-y-4 md:space-y-0">
          <span>© 2026 BMW Premium Digital Concept — All Rights Reserved</span>

          {/* Back To Top Action Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors group outline-none"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-3 h-3 transform group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </footer>
    </main>
  );
}
