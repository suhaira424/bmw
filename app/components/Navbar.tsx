"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X } from "lucide-react";

const links = [
  { label: "Models", href: "#models", num: "01" },
  { label: "About", href: "#about", num: "02" },
  { label: "Experience", href: "#experience", num: "03" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Menu khula ho to page scroll band + Escape se band ho
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // Agar menu khula ho aur screen desktop size ho jaye (resize/rotate), to band kar do
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  // Link click: menu band karo, phir section par smooth scroll
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 md:px-16 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
      >
        <a href="#" className="text-xl font-black tracking-[0.3em] text-white">
          M POWER
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-12 text-sm uppercase tracking-[0.2em] text-gray-300">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="hover:text-blue-500 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-6 text-white">
          <button
            aria-label="Search"
            className="hover:text-blue-500 transition-colors outline-none"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Menu button: sirf mobile par */}
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="md:hidden hover:text-blue-500 transition-colors outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Full-screen menu: sirf mobile par (md:hidden) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col"
          >
            {/* Top bar */}
            <div className="flex justify-between items-center px-8 py-6">
              <span className="text-xl font-black tracking-[0.3em] text-white">
                M POWER
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 text-white border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 flex flex-col justify-center px-8 space-y-6">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="group flex items-baseline gap-4 border-b border-white/10 pb-4"
                >
                  <span className="text-xs font-mono text-blue-500 tracking-widest">
                    {link.num}
                  </span>
                  <span className="text-3xl font-light uppercase tracking-[0.2em] text-white group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-gray-600 font-mono">
              {"// M Power Collection"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}