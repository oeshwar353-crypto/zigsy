import { motion } from "motion/react";
import { Screen } from "../../types";

interface Props {
  onNext: (screen: Screen) => void;
}

export default function LandingScreen({ onNext }: Props) {
  return (
    <div
      id="landing-screen"
      className="flex flex-col h-screen w-full bg-[#f9f9f9] text-[#1a1c1c] overflow-hidden justify-between pb-6 relative select-none"
    >
      {/* Editorial Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shrink-0 border-b border-neutral-100">
        <h1 className="text-2xl font-black tracking-tight text-[#980900]">ZIGSY</h1>
      </header>

      {/* Hero Image Area - Adjust size to fit in layout without scrolling */}
      <div className="relative w-full flex-1 overflow-hidden bg-neutral-100 min-h-0">
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"
          alt="Luxury Fashion Editorial"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f9f9] via-transparent to-black/10"></div>
      </div>

      {/* High-Gloss Action Buttons */}
      <div className="px-6 py-4 space-y-3 max-w-sm mx-auto w-full shrink-0">
        <button
          onClick={() => onNext(Screen.SignupBasic)}
          className="w-full bg-gradient-to-r from-[#980900] to-[#c21807] hover:from-[#c21807] hover:to-[#ff3b30] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-900/10 active:scale-[0.98] transition-all"
        >
          <span>GET STARTED</span>
          <span className="text-xl">→</span>
        </button>

        <button
          onClick={() => onNext(Screen.Login)}
          className="w-full bg-white hover:bg-neutral-50 text-[#980900] font-bold py-4 px-6 rounded-2xl border border-neutral-200 active:scale-[0.98] transition-all text-center"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}
