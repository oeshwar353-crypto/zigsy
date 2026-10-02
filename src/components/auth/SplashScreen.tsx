import { useEffect } from "react";
import { motion } from "motion/react";
import { Screen } from "../../types";
import logoImg from "../../../images/logo.png";

interface Props {
  onNext: (screen: Screen) => void;
}

export default function SplashScreen({ onNext }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext(Screen.Landing);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div
      id="splash-screen"
      onClick={() => onNext(Screen.Landing)}
      className="flex flex-col justify-between items-center min-h-screen w-full bg-gradient-to-b from-[#FAF8F7] via-[#FCECE9] to-[#FCEBE7] p-8 cursor-pointer select-none"
    >
      {/* Top Spacer */}
      <div></div>

      {/* Center Circle & Brand */}
      <div className="flex flex-col items-center justify-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex items-center justify-center w-44 h-44 rounded-full bg-white shadow-xl shadow-red-950/5 border border-white/50"
        >
          {/* Inner Logo Container */}
          <div className="w-28 h-28 flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="Zigsy Logo" className="w-full h-full object-contain" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl font-black tracking-tight text-[#980900] text-center"
        >
          ZIGSY
        </motion.h1>
      </div>

      {/* Bottom Content */}
      <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
        <div className="text-center">
          <p className="text-sm tracking-[0.25em] font-semibold text-[#5c403b] uppercase">
            Rent. Wear. Repeat.
          </p>
        </div>

        {/* Progress Bar indicator */}
        <div className="w-28 h-1 bg-neutral-200/60 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "0%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/3 bg-[#980900] rounded-full"
          />
        </div>

        <p className="text-xs font-medium text-neutral-400">
          The New Luxury Standard
        </p>
      </div>
    </div>
  );
}
