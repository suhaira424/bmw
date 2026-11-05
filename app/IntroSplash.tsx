"use client";

import { useEffect, useState } from "react";

type Stage = "text" | "lights" | "leaving" | "done";

interface IntroSplashProps {
  /** Apni awaz ka path, e.g. "/ReelAudio-1896.mp3" */
  soundSrc?: string;
  /** Awaz file ke kitne second se shuru ho */
  soundStart?: number;
  /** Awaz file ke kitne second par ruk jaye (optional) */
  soundEnd?: number;
  /** Text kitni der (ms) screen par rahe, uske baad lights aati hain */
  textDuration?: number;
  /** Lights aane ke baad kitni der (ms) rukein phir home page */
  lightsDuration?: number;
  /** Lights shuru hone ke kitne ms baad pehli light jale */
  firstLightDelay?: number;
  /** Lights shuru hone ke kitne ms baad dusri light jale */
  secondLightDelay?: number;
  /** Pehle kaunsi light jale (screen ke hisaab se) */
  firstSide?: "right" | "left";
  /** Code ki banai hui headlight "click" awaz (agar apni mp3 me nahi hai) */
  lightSfx?: boolean;
  /** Headlight on hone ki apni awaz (har light par) */
  lightSoundSrc?: string;
  /** Browser awaz block kare to "Tap to start" dikha kar tap ka intezar kare */
  tapIfBlocked?: boolean;
  /** Intro khatam hone par call hota hai */
  onFinish?: () => void;
}

/* Headlight on hone ki banai hui awaz: relay click + thunk + bulb whoomp */
function playLightOnSfx(ctx: AudioContext) {
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  const len = Math.floor(ctx.sampleRate * 0.05);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2400;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.7, t);
  clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  noise.connect(bp).connect(clickGain).connect(master);
  noise.start(t);

  const thunk = ctx.createOscillator();
  thunk.type = "sine";
  thunk.frequency.setValueAtTime(150, t);
  thunk.frequency.exponentialRampToValueAtTime(55, t + 0.16);
  const thunkGain = ctx.createGain();
  thunkGain.gain.setValueAtTime(0.9, t);
  thunkGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  thunk.connect(thunkGain).connect(master);
  thunk.start(t);
  thunk.stop(t + 0.2);

  const hum = ctx.createOscillator();
  hum.type = "sawtooth";
  hum.frequency.value = 110;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(200, t + 0.04);
  lp.frequency.exponentialRampToValueAtTime(1800, t + 0.3);
  lp.frequency.exponentialRampToValueAtTime(300, t + 0.9);
  const humGain = ctx.createGain();
  humGain.gain.setValueAtTime(0.0001, t + 0.04);
  humGain.gain.exponentialRampToValueAtTime(0.14, t + 0.25);
  humGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
  hum.connect(lp).connect(humGain).connect(master);
  hum.start(t + 0.04);
  hum.stop(t + 1);
}

function Lamp({ x, mirror, on }: { x: number; mirror?: boolean; on: boolean }) {
  const lit = on ? "lit" : "";
  return (
    <g transform={`translate(${x} 125) scale(${mirror ? -1 : 1} 1)`}>
      <ellipse className={`beam ${lit}`} cx={0} cy={0} rx={170} ry={90} fill="url(#beam)" />

      <path
        d="M -110 -10 Q -110 -45 -60 -48 L 90 -40 Q 115 -38 112 -10 Q 108 35 60 42 L -60 40 Q -110 35 -110 -10 Z"
        fill="#0b0b0b"
        stroke="#262626"
        strokeWidth={2}
      />

      <g fill="none" stroke="#2b2b2b" strokeWidth={3.5}>
        <circle cx={-35} cy={0} r={30} />
        <circle cx={52} cy={0} r={20} />
        <path d="M -92 -30 L 98 -26" strokeLinecap="round" />
      </g>

      <g className={`lamp-on ${lit}`} filter="url(#glow)">
        <circle cx={-35} cy={0} r={30} fill="rgba(200,225,255,0.08)" stroke="#fff" strokeWidth={4} />
        <circle cx={-35} cy={0} r={12} fill="#eaf3ff" />
        <circle cx={52} cy={0} r={20} fill="none" stroke="#fff" strokeWidth={3.5} />
        <circle cx={52} cy={0} r={7} fill="#eaf3ff" />
        <path d="M -92 -30 L 98 -26" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      </g>
    </g>
  );
}

export default function IntroSplash({
  soundSrc,
  soundStart = 0,
  soundEnd,
  textDuration = 3000,
  lightsDuration = 3000,
  firstLightDelay = 500,
  secondLightDelay = 1400,
  firstSide = "right",
  lightSfx = false,
  lightSoundSrc,
  tapIfBlocked = true,
  onFinish,
}: IntroSplashProps) {
  const [stage, setStage] = useState<Stage>("text");
  const [rightOn, setRightOn] = useState(false);
  const [leftOn, setLeftOn] = useState(false);
  const [needTap, setNeedTap] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let started = false;
    let ctx: AudioContext | null = null;
    let main: HTMLAudioElement | null = null;
    const timers: number[] = [];
    const audios: HTMLAudioElement[] = [];
    const events = ["pointerdown", "keydown", "touchstart"] as const;

    const add = (fn: () => void, ms: number) =>
      timers.push(window.setTimeout(fn, ms));

    /* ---------- Awaz ---------- */
    const prepareMain = (src: string) => {
      const a = new Audio(src);
      a.preload = "auto";
      audios.push(a);
    a.addEventListener("error", () => {
  const e = a.error;
  console.error("Audio error:", src, "code:", e?.code, "msg:", e?.message);
      return a;
    };

    // soundStart second se shuru karke chalata hai
    const startMain = (a: HTMLAudioElement) => {
      const seek = () => {
        if (isFinite(a.duration) && soundStart >= a.duration) {
          console.warn("soundStart file ki length se zyada hai, 0 se chala rahe hain");
          a.currentTime = 0;
        } else {
          try {
            a.currentTime = soundStart;
          } catch {
            /* ignore */
          }
        }
      };
      if (a.readyState >= 1) seek();
      else a.addEventListener("loadedmetadata", seek, { once: true });
      return a.play();
    };

    const playShort = (src: string) => {
      const a = new Audio(src);
      audios.push(a);
      a.play().catch(() => {});
    };

    const lightClick = () => {
      if (!ctx) {
        const AC: typeof AudioContext | undefined =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AC) ctx = new AC();
      }
      const c = ctx;
      if (!c) return;
      const run = () => playLightOnSfx(c);
      if (c.state === "running") run();
      else c.resume().then(run).catch(() => {});
    };

    const speakFallback = () => {
      if (!("speechSynthesis" in window)) return;
      const speak = () => {
        const voices = window.speechSynthesis.getVoices();
        const german = voices.filter((v) => v.lang.toLowerCase().startsWith("de"));
        const maleHint = /male|markus|stefan|hans|jonas|conrad|klaus|killian/i;
        const voice = german.find((v) => maleHint.test(v.name)) || german[0];
        const speech = new SpeechSynthesisUtterance("Bayerische Motoren Werke");
        speech.lang = "de-DE";
        if (voice) speech.voice = voice;
        speech.pitch = 0.3;
        speech.rate = 0.75;
        window.speechSynthesis.speak(speech);
      };
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          speak();
        };
      } else {
        speak();
      }
    };

    /* ---------- Timeline: text → lights → fade out ---------- */
    const lightOn = (setter: (v: boolean) => void) => {
      setter(true);
      if (lightSoundSrc) playShort(lightSoundSrc);
      else if (lightSfx) lightClick();
    };

    const begin = () => {
      if (started || cancelled) return;
      started = true;
      setNeedTap(false);

      const first = firstSide === "right" ? setRightOn : setLeftOn;
      const second = firstSide === "right" ? setLeftOn : setRightOn;

      if (main && soundEnd && soundEnd > soundStart) {
        const m = main;
        add(() => m.pause(), (soundEnd - soundStart) * 1000);
      }

      add(() => {
        setStage("lights");
        add(() => lightOn(first), firstLightDelay);
        add(() => lightOn(second), secondLightDelay);
      }, textDuration);

      add(() => setStage("leaving"), textDuration + lightsDuration);
      add(() => {
        setStage("done");
        onFinish?.();
      }, textDuration + lightsDuration + 1000);
    };

    /* ---------- Shuru: pehle awaz chalane ki koshish ---------- */
    const waitForGesture = (run: () => void) => {
      const handler = () => {
        events.forEach((e) => window.removeEventListener(e, handler));
        run();
      };
      events.forEach((e) => window.addEventListener(e, handler, { once: true }));
    };

    const init = async () => {
      if (!soundSrc) {
        begin();
        speakFallback();
        return;
      }

      const a = prepareMain(soundSrc);
      main = a;

      try {
        await startMain(a); // browser ne allow kiya
        if (cancelled) return;
        begin();
      } catch (err) {
        if (cancelled) return;
        const blocked = (err as DOMException)?.name === "NotAllowedError";
        if (!blocked) console.error("Awaz nahi chal saki:", err);

        if (blocked && tapIfBlocked) {
          // Tap ka intezar, tap par awaz aur intro ek sath
          setNeedTap(true);
          waitForGesture(() => {
            startMain(a).catch(() => {});
            begin();
          });
        } else {
          // Bina ruke chalao, awaz pehle tap par shuru hogi
          begin();
          waitForGesture(() => {
            startMain(a).catch(() => {});
          });
        }
      }
    };
    init();

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      audios.forEach((a) => a.pause());
      ctx?.close().catch(() => {});
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (stage === "done") return null;

  const showLights = stage === "lights" || stage === "leaving";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: stage === "leaving" ? 0 : 1,
        pointerEvents: stage === "leaving" ? "none" : "auto",
        transition: "opacity 1s ease",
      }}
    >
      {needTap && (
        <p
          style={{
            color: "#9a9a9a",
            fontFamily: "Arial, sans-serif",
            fontSize: 13,
            letterSpacing: 4,
            textTransform: "uppercase",
            animation: "tapPulse 1.6s ease-in-out infinite",
          }}
        >
          Tap to start
        </p>
      )}

      {stage === "text" && !needTap && (
        <h1
          style={{
            color: "#fff",
            fontFamily: "Arial, sans-serif",
            fontWeight: 300,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontSize: "clamp(1.5rem, 5vw, 3.5rem)",
            textAlign: "center",
            padding: "0 1rem",
            animation: "introIn 1.5s ease forwards",
          }}
        >
          Bayerische Motoren Werke
        </h1>
      )}

      {showLights && (
        <svg
          viewBox="0 0 600 250"
          style={{ width: "min(92vw, 760px)", height: "auto" }}
          role="img"
          aria-label="Headlights"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="beam">
              <stop offset="0%" stopColor="#bcd7ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#bcd7ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <Lamp x={150} mirror on={leftOn} />
          <Lamp x={450} on={rightOn} />
        </svg>
      )}

      <style>{`
        .lamp-on, .beam { opacity: 0; }
        .lamp-on.lit, .beam.lit { animation: lampOn 0.9s ease-out forwards; }
        @keyframes lampOn {
          0%   { opacity: 0; }
          12%  { opacity: 0.95; }
          24%  { opacity: 0.15; }
          40%  { opacity: 1; }
          55%  { opacity: 0.55; }
          100% { opacity: 1; }
        }
        @keyframes introIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tapPulse {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lamp-on.lit, .beam.lit { animation: none; opacity: 1; }
          h1 { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
