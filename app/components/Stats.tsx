"use client";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

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
    <section className="py-12 sm:py-16 lg:py-20 bg-[#0a0a0a] text-white border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 lg:gap-12">
        <div className="border-l border-white/10 pl-3 sm:pl-5 lg:pl-6 min-w-0">
          <p className="text-[10px] sm:text-xs lg:text-sm tracking-[0.15em] sm:tracking-widest text-gray-500 uppercase mb-1.5 sm:mb-2">
            01 / Engine Output
          </p>
          <h3 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            <Counter value={617} /> <span className="text-lg sm:text-2xl lg:text-3xl">HP</span>
          </h3>
        </div>

        <div className="border-l border-white/10 pl-3 sm:pl-5 lg:pl-6 min-w-0">
          <p className="text-[10px] sm:text-xs lg:text-sm tracking-[0.15em] sm:tracking-widest text-gray-500 uppercase mb-1.5 sm:mb-2">
            02 / VMax Velocity
          </p>
          <h3 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            <Counter value={305} /> <span className="text-lg sm:text-2xl lg:text-3xl">KM/H</span>
          </h3>
        </div>

        <div className="border-l border-white/10 pl-3 sm:pl-5 lg:pl-6 min-w-0">
          <p className="text-[10px] sm:text-xs lg:text-sm tracking-[0.15em] sm:tracking-widest text-gray-500 uppercase mb-1.5 sm:mb-2">
            03 / Launch Time
          </p>
          <h3 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            3.<Counter value={2} duration={1} />{" "}
            <span className="text-lg sm:text-2xl lg:text-3xl">SEC</span>
          </h3>
        </div>

        <div className="border-l border-white/10 pl-3 sm:pl-5 lg:pl-6 min-w-0">
          <p className="text-[10px] sm:text-xs lg:text-sm tracking-[0.15em] sm:tracking-widest text-gray-500 uppercase mb-1.5 sm:mb-2">
            04 / Cylinders
          </p>
          <h3 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            V<Counter value={8} duration={0.5} />{" "}
            <span className="text-lg sm:text-2xl lg:text-3xl block min-[400px]:inline">TwinPower</span>
          </h3>
        </div>
      </div>
    </section>
  );
}
