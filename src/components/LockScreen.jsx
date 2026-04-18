import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon } from "./ui/arrow-right";
import useWindowStore from "#store/window";
import gsap from "gsap";
import NumberFlow from "@number-flow/react";

const SESSION_KEY = "boot_shown";

// ─── Login Panel (defined OUTSIDE LockScreen so React never remounts it) ────
const LoginPanel = ({ onSubmit, inputRef, password, setPassword, time }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Delay GSAP animations to sync with the framer-motion fade-in (1s)
      // so elements only start animating once they're visible
      gsap.from(".login-card-anim", {
        opacity: 0,
        y: 24,
        filter: "blur(12px)",
        duration: 1.8,
        ease: "power3.out",
        delay: 0.5,
        clearProps: "all"
      });
      
      gsap.from(".login-bg", {
        scale: 1.08,
        filter: "blur(18px)",
        duration: 2,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  
  const weekday = time.toLocaleDateString("en-US", { weekday: "long" });
  const month = time.toLocaleDateString("en-US", { month: "long" });
  const day = time.getDate();

  return (
    <div ref={containerRef} className="absolute inset-0 flex flex-col items-center text-white overflow-hidden">
      {/* Background Image with separate layer to animate scale without clipping items */}
      <div 
        className="login-bg absolute inset-0 bg-[url('/images/wallpaper.jpg')] bg-cover bg-center" 
        fetchpriority="high"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-none" />

      {/* Date & Time */}
      <motion.div 
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center mt-12 sm:mt-20 z-10 w-full"
      >
        <h2 className="text-xl sm:text-[28px] text-white/90 font-medium tracking-wide flex items-center gap-x-1.5 translate-y-[-2px]">
          <span>{weekday},</span>
          <span>{month}</span>
          <NumberFlow value={day} />
        </h2>
        <div className="h-[80px] sm:h-[120px] w-full flex items-center justify-center font-bold text-7xl sm:text-[100px] tracking-tight text-white/95 leading-none">
          <NumberFlow 
            value={hours} 
            format={{ minimumIntegerDigits: 2 }} 
          />
          <span className="relative top-[-4px] mx-1 opacity-80">:</span>
          <NumberFlow 
            value={minutes} 
            format={{ minimumIntegerDigits: 2 }} 
          />
        </div>
      </motion.div>

      {/* User Login */}
      <div className="login-card-anim relative mt-16 sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 flex flex-col items-center z-10">
        <img
          src="/images/profile-pic.jpg"
          alt="Sruthika"
          className="w-24 h-24 rounded-full object-cover object-top border-2 border-white/20 shadow-2xl mb-5"
          fetchpriority="high"
        />
        <h3 className="text-xl font-medium tracking-wide mb-6">Sruthika</h3>

        <form onSubmit={onSubmit} className="relative flex items-center">
          <input
            ref={inputRef}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-56 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white placeholder:text-white/60 text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/30 transition-all font-inter shadow-xl"
          />
          <button
            type="submit"
            aria-label="Unlock Portfolio"
            disabled={password.length === 0}
            className="absolute right-1 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-50 disabled:hover:bg-white/20 transition-colors"
          >
            <ArrowRightIcon size={14} />
          </button>
        </form>
        <p className="text-white/50 text-xs mt-3 font-medium">
          Hint: Enter your nickname used to call by your parents
        </p>
      </div>
    </div>
  );
};

// ─── Main LockScreen Component ───────────────────────────────────────────────
const LockScreen = () => {
  const { isLocked: isManuallyLocked, unlockScreen } = useWindowStore();

  const firstVisit = !sessionStorage.getItem(SESSION_KEY);
  const [showBoot, setShowBoot] = useState(firstVisit);
  const [booting, setBooting] = useState(firstVisit);

  const [password, setPassword] = useState("");
  const [time, setTime] = useState(new Date());
  const inputRef = useRef(null);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Focus input when login screen appears
  const loginVisible = (showBoot && !booting) || isManuallyLocked;
  useEffect(() => {
    if (loginVisible) {
      const id = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(id);
    }
  }, [loginVisible]);

  // Reset password when manual lock closes
  useEffect(() => {
    if (!isManuallyLocked) setPassword("");
  }, [isManuallyLocked]);

  const handleBootUnlock = (e) => {
    e.preventDefault();
    sessionStorage.setItem(SESSION_KEY, "1");
    setShowBoot(false);
    unlockScreen();
  };

  const handleManualUnlock = (e) => {
    e.preventDefault();
    unlockScreen();
  };

  return (
    <>
      {/* ── 1. BOOT LOCK SCREEN (first visit only) ── */}
      <AnimatePresence>
        {showBoot && (
          <motion.div
            key="boot-wrapper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[9999] overflow-hidden select-none touch-none bg-black"
          >
            {/* Combined Transition: Boot -> Login */}
            <AnimatePresence>
              {booting ? (
                <motion.div
                  key="boot-anim"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[20] text-white"
                >
                  <svg
                    className="w-[80px] h-[80px] mb-16 fill-white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                  <div className="w-56 h-[3px] bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: [0, 0.2, 0.25, 0.65, 0.7, 0.92, 1] }}
                      transition={{ 
                        duration: 3.2, 
                        times: [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1],
                        ease: "easeInOut"
                      }}
                      onAnimationComplete={() => setBooting(false)}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="boot-login"
                  className="absolute inset-0 z-[10]"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LoginPanel
                    onSubmit={handleBootUnlock}
                    inputRef={inputRef}
                    password={password}
                    setPassword={setPassword}
                    time={time}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. MANUAL LOCK SCREEN (Navbar → Lock Screen, no boot anim) ── */}
      <AnimatePresence>
        {isManuallyLocked && !showBoot && (
          <motion.div
            key="manual-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-[9999] overflow-hidden select-none touch-none"
          >
            <LoginPanel
              onSubmit={handleManualUnlock}
              inputRef={inputRef}
              password={password}
              setPassword={setPassword}
              time={time}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LockScreen;
