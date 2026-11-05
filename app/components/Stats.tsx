"use client";
import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalMiliseconds = duration * 1000;
      const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 10);
      
      const timer = setInterval(() => {
        start += Math.ceil(end / (totalMiliseconds / incrementTime));
        if (start >= end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(start);
        }
      }, incrementTime);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function Stats() {
  return (
    <section className="py-20 bg-[#0a0a0a] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="border-l border-white/10 pl-6">
          <p className="text-sm tracking-widest text-gray-500 uppercase mb-2">01 / Engine Output</p>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight"><Counter value={617} /> HP</h3>
        </div>
        <div className="border-l border-white/10 pl-6">
          <p className="text-sm tracking-widest text-gray-500 uppercase mb-2">02 / VMax Velocity</p>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight"><Counter value={305} /> KM/H</h3>
        </div>
        <div className="border-l border-white/10 pl-6">
          <p className="text-sm tracking-widest text-gray-500 uppercase mb-2">03 / Launch Time</p>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">3.<Counter value={2} duration={1} /> SEC</h3>
        </div>
        <div className="border-l border-white/10 pl-6">
          <p className="text-sm tracking-widest text-gray-500 uppercase mb-2">04 / Cylinders</p>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">V<Counter value={8} duration={0.5} /> TwinPower</h3>
        </div>
      </div>
    </section>
  );
}
