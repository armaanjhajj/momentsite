import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "framer-motion";

/**
 * Moments Demo: Brand Gradient (no glass, no emojis)
 * --------------------------------------------------
 * - Lock → notification → App
 * - Flow: Match → Meetup → NFC (Confirm) → Public Moments (auto‑advance on first two)
 * - Brand colors: #ff4e6a → #ff5c98 (gradient). Clean, modern, flat UI.
 * - Bottom bar = 3 ICONS (Private, Public, Profile). Active tab is highlighted.
 * - Uses provided filler images for logo/asterisk/UI shot.
 */

// Step types: "match" | "meetup" | "nfc" | "public"
// Step shape: { id, title, text, ctaPrimary }

const BRAND_A = "#ff4e6a"; // primary
const BRAND_B = "#ff5c98"; // secondary
const NFC_BLUE = "#2F80ED"; // iOS-like blue for NFC
const NFC_FILL = "#D7E9FF"; // light fill accent

const ASSETS = {
  logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center",
  asterisk: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=center",
  uiShot: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&crop=center",
  wallpaper: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=800&fit=crop&crop=center",
};

const SAMPLE_PERSON = {
  name: "Jayden, 20",
  distance: "2 min away",
  vibe: "streetwear, hooping, late‑night diners",
  whyMatch:
    "You both saved Rutgers hoops games and late-night diners as interests. 3 mutuals also know Jayden.",
};

const PUBLIC_MOMENTS = [
  { id: "pm1", title: "Pickup Hoops @ College Ave Gym", time: "Today • 7:15 PM", people: 8, blurb: "Casual run, all levels" },
  { id: "pm2", title: "Study Sprint • Hill Center", time: "Tonight • 9:00 PM", people: 12, blurb: "90‑min quiet grind, then dessert" },
  { id: "pm3", title: "Thrift Trade Pop‑Up • The Yard", time: "Tomorrow • 3:00 PM", people: 23, blurb: "Swap tees & streetwear gems" },
];

const DEFAULT_STEPS = [
  { id: "match",  title: "Someone you'd vibe with is nearby", text: "Match",  ctaPrimary: "Explore Moment" },
  { id: "meetup", title: "Meet at The Yard",                   text: "Meetup", ctaPrimary: "I've arrived" },
  { id: "nfc",    title: "Tap phones to confirm",              text: "NFC",    ctaPrimary: "Confirm" },
  { id: "public", title: "Public Moments on Campus",           text: "Public", ctaPrimary: "Replay" },
];

interface PhoneProps {
  aspect?: "vertical" | "horizontal" | "square";
  autoDurations?: { match: number; meetup: number };
}

export default function MomentsBrandGradientDemo({
  aspect = "vertical",    // "vertical" | "horizontal" | "square"
  autoDurations = { match: 2200, meetup: 2200 },
}: {
  aspect?: "vertical" | "horizontal" | "square";
  autoDurations?: { match: number; meetup: number };
}) {
  const steps = useMemo(() => DEFAULT_STEPS, []);
  const [phase, setPhase] = useState<"lock" | "app">("lock");
  const [stepIndex, setStepIndex] = useState(0);
  const current = steps[stepIndex];

  // Active tab highlights
  const activeTab: "private" | "public" | "profile" = current.id === "public" ? "public" : "private";

  // Auto‑advance early steps
  useEffect(() => {
    if (phase !== "app") return;
    if (current.id === "match" || current.id === "meetup") {
      const ms = current.id === "match" ? autoDurations.match : autoDurations.meetup;
      const t = setTimeout(() => setStepIndex((i) => i + 1), ms);
      return () => clearTimeout(t);
    }
  }, [phase, current.id, autoDurations.match, autoDurations.meetup]);

  const aspectClass = useMemo(() => {
    if (aspect === "horizontal") return "aspect-[16/9] w-[360px] md:w-[540px]";
    if (aspect === "square")     return "aspect-square w-[320px] md:w-[360px]";
    return "aspect-[19.5/9] h-[680px] w-[320px] md:h-[720px] md:w-[360px]"; // iPhone 14 Pro dimensions
  }, [aspect]);

  return (
    <div className="w-full grid place-items-center py-10 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="relative">
        {/* iPhone Frame with Dynamic Island */}
        <div className={`relative ${aspectClass} bg-black rounded-[60px] p-2 shadow-2xl`}>
          {/* Dynamic Island */}
          <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-50 border border-gray-800"></div>
          
          {/* Screen */}
          <div className="relative w-full h-full rounded-[48px] overflow-hidden bg-white"> 
          {/* LOCK SCREEN */}
          <AnimatePresence>
            {phase === "lock" && (
              <motion.div key="lock" className="absolute inset-0">
                {/* Wallpaper */}
                <img src={ASSETS.wallpaper} alt="Wallpaper" className="absolute inset-0 w-full h-full object-cover" />
                {/* overlay for readability */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Stack: time then notification (no overlap) */}
                <div className="relative h-full w-full flex flex-col items-center pt-16">
                  <div className="text-white text-center select-none">
                    <div className="text-6xl font-light tracking-tight">12:41</div>
                    <div className="text-sm opacity-80 mt-1">Thursday, August 22</div>
                  </div>

                  {/* Spacing between time and notification */}
                  <div className="mt-5 w-full max-w-[92%]">
                    <button
                      onClick={() => { setPhase("app"); setStepIndex(0); }}
                      className="w-full rounded-2xl p-3 bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl transition text-left border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img src={ASSETS.asterisk} alt="Moments" className="h-9 w-9 rounded-xl object-contain bg-white border border-neutral-200" />
                        <div className="flex-1">
                          <div className="text-[13px] text-neutral-600">Moments</div>
                          <div className="text-[15px] text-neutral-900 leading-tight">Someone you'd vibe with just walked in — {SAMPLE_PERSON.name}</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* APP VIEW */}
          <AnimatePresence>
            {phase === "app" && (
              <motion.div key="app" className="absolute inset-0 bg-white">
                {/* Status Bar Area (accounting for Dynamic Island) */}
                <div className="absolute top-0 left-0 right-0 h-16 flex items-end justify-center z-10 pb-2">
                  <div className="px-4 py-1.5 rounded-full text-neutral-900 text-sm tracking-wide border border-neutral-200 bg-white shadow-sm">moments</div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 pt-24 pb-32 px-4 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-3xl border border-neutral-200 p-4 text-neutral-900 shadow-sm bg-white"
                    >
                      {/* MATCH */}
                      {current.id === "match" && (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            {[ASSETS.logo, ASSETS.asterisk, ASSETS.uiShot].map((src, i) => (
                              <img key={i} src={src} className="h-24 w-full object-cover rounded-2xl border border-neutral-200" />
                            ))}
                          </div>
                          <div className="mt-4 flex items-start gap-3">
                            <img src={ASSETS.asterisk} alt={SAMPLE_PERSON.name} className="h-12 w-12 rounded-xl object-cover border border-neutral-200" />
                            <div className="text-sm leading-relaxed">
                              <div className="font-semibold">{SAMPLE_PERSON.name}</div>
                              <div className="text-neutral-700">{SAMPLE_PERSON.distance} • {SAMPLE_PERSON.vibe}</div>
                              <div className="mt-2"><span className="font-medium">Why you matched:</span> {SAMPLE_PERSON.whyMatch}</div>
                            </div>
                          </div>
                          <div className="mt-5 flex gap-2">
                            <button onClick={() => setStepIndex(1)} className="btn-brand">Explore Moment</button>
                            <button onClick={() => setPhase("lock")} className="btn-ghost">Decline</button>
                          </div>
                        </>
                      )}

                      {/* MEETUP */}
                      {current.id === "meetup" && (
                        <>
                          <div className="text-xl font-semibold leading-snug">Meet at The Yard</div>
                          <div className="text-sm text-neutral-700">Public spot • 5 min walk • Safe & busy</div>
                          <div className="mt-3 h-36 rounded-2xl overflow-hidden border border-neutral-200">
                            <img src={ASSETS.uiShot} className="w-full h-full object-cover" />
                          </div>
                          <div className="mt-4">
                            <button onClick={() => setStepIndex(2)} className="btn-brand">I've arrived</button>
                          </div>
                        </>
                      )}

                      {/* NFC (static iOS-style icon, NO animation) */}
                      {current.id === "nfc" && (
                        <>
                          <div className="text-lg font-medium">Tap to confirm</div>
                          <div className="text-sm text-neutral-700">Hold phones together to mark the moment.</div>
                          <div className="mt-4 flex items-center justify-center">
                            <svg width="160" height="160" viewBox="0 0 120 120">
                              <defs>
                                <clipPath id="rightHalf">
                                  <rect x="60" y="0" width="60" height="120" />
                                </clipPath>
                              </defs>
                              <circle cx="60" cy="60" r="50" fill="none" stroke="#E6EEF9" strokeWidth="2" />
                              <g>
                                <rect x="42" y="36" width="36" height="48" rx="6" fill="#fff" stroke={NFC_BLUE} strokeWidth="3" />
                                <line x1="46" y1="42" x2="74" y2="42" stroke={NFC_BLUE} strokeWidth="2.5" strokeLinecap="round" />
                                <polygon points="42,60 78,84 42,84" fill={NFC_FILL} />
                              </g>
                              <g clipPath="url(#rightHalf)">
                                <circle cx="60" cy="60" r="24" fill="none" stroke={NFC_BLUE} strokeWidth="3" opacity="0.9" />
                                <circle cx="60" cy="60" r="32" fill="none" stroke={NFC_BLUE} strokeWidth="3" opacity="0.6" />
                                <circle cx="60" cy="60" r="40" fill="none" stroke={NFC_BLUE} strokeWidth="3" opacity="0.45" />
                              </g>
                            </svg>
                          </div>
                          <button onClick={() => setStepIndex(3)} className="btn-brand mt-2">Confirm</button>
                        </>
                      )}

                      {/* PUBLIC */}
                      {current.id === "public" && (
                        <>
                          <div className="text-xl font-semibold leading-snug">Public Moments on Campus</div>
                          <div className="text-sm text-neutral-700">Join something happening near you</div>
                          <div className="mt-4 space-y-3">
                            {PUBLIC_MOMENTS.map((m) => (
                              <div key={m.id} className="flex gap-3 p-3 rounded-2xl border border-neutral-200 bg-white shadow-sm">
                                <img src={ASSETS.logo} alt={m.title} className="h-16 w-16 rounded-xl object-cover border border-neutral-200" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-[15px] font-medium truncate">{m.title}</div>
                                  <div className="text-[13px] text-neutral-700">{m.time} • {m.people} joined</div>
                                  <div className="text-[13px]">{m.blurb}</div>
                                </div>
                                <button className="self-center btn-brand px-3 py-1.5">Join</button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-5 flex gap-2">
                            <button onClick={() => { setPhase("lock"); setStepIndex(0); }} className="btn-brand">Replay</button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom bar: 3 ICON BUTTONS with active state - iPhone style */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-full px-3 py-3 bg-white/95 backdrop-blur-md border border-neutral-200/50 shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    {/* Private */}
                    <button aria-label="Private" onClick={() => { setPhase("app"); setStepIndex(0); }}
                      className={`nav-icon ${activeTab === "private" ? "active" : ""}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 11V8a5 5 0 10-10 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                      </svg>
                    </button>

                    {/* Public */}
                    <button aria-label="Public" onClick={() => { setPhase("app"); setStepIndex(3); }}
                      className={`nav-icon ${activeTab === "public" ? "active" : ""}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 21a8 8 0 10-16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Profile */}
                    <button aria-label="Profile" onClick={() => { /* placeholder: keep in private for now */ }}
                      className={`nav-icon ${activeTab === "profile" ? "active" : ""}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
                        <path d="M20 21a8 8 0 10-16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[134px] h-[5px] bg-white rounded-full opacity-60"></div>
      </div>

      {/* Brand gradient utilities (no glass) */}
      <style>{`
        .btn-brand {
          color: white;
          border-radius: 14px;
          padding: 10px 14px;
          background-image: linear-gradient(90deg, ${BRAND_A}, ${BRAND_B});
          box-shadow: 0 6px 18px rgba(255, 92, 152, 0.25);
        }
        .btn-brand:hover { filter: brightness(1.02); }
        .btn-ghost {
          border-radius: 14px;
          padding: 10px 14px;
          border: 1px solid #e5e7eb; /* neutral-200 */
          background: white;
          color: #111827; /* neutral-900 */
        }
        .nav-icon {
          width: 48px; height: 48px; display:grid; place-items:center; border-radius: 16px;
          border: 1px solid #f3f4f6; background: #fff; color: #111827; transition: all .2s;
        }
        .nav-icon:hover {
          background: #f9fafb; transform: scale(1.02);
        }
        .nav-icon.active {
          background-image: linear-gradient(90deg, ${BRAND_A}, ${BRAND_B});
          color: #fff; border-color: transparent; box-shadow: 0 8px 20px rgba(255, 92, 152, 0.3);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

export function PhoneDemo() {
  return <MomentsBrandGradientDemo />;
}
