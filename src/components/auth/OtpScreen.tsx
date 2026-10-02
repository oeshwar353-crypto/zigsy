import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface Props {
  phoneNumber: string;
  onBack: () => void;
  onVerify: (code: string) => void;
}

export default function OtpScreen({ phoneNumber, onBack, onVerify }: Props) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(57);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // Ticking Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleInputChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      return;
    }

    const newCode = [...code];
    newCode[index] = cleanValue[cleanValue.length - 1]; // last typed digit
    setCode(newCode);

    // Auto-focus next input
    if (index < 5 && cleanValue) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyClick = () => {
    const fullCode = code.join("");
    onVerify(fullCode || "123456");
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      id="otp-screen"
      className="flex flex-col justify-between min-h-screen w-full bg-[#f9f9f9] text-[#1a1c1c] p-6 select-none"
    >
      {/* Top Navigation */}
      <header className="flex items-center w-full relative">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="p-2 -ml-2 hover:bg-neutral-150 rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-800" />
        </button>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-black tracking-tight text-[#980900] pointer-events-none">
          ZIGSY
        </span>
      </header>

      {/* Verification Code Box */}
      <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full my-8 space-y-10">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1c1c]">Verify your number</h2>
          <p className="text-sm text-neutral-500 leading-normal">
            We sent a 6-digit code to <span className="font-semibold text-neutral-700">{phoneNumber || "+1 (555) 000-0000"}</span>
          </p>
        </div>

        {/* 6 Digit Inputs */}
        <div className="grid grid-cols-6 gap-2 sm:gap-3 px-1">
          {code.map((val, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              ref={(el) => {
                if (el) inputsRef.current[idx] = el;
              }}
              value={val}
              onChange={(e) => handleInputChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-full aspect-square text-center font-bold text-xl text-neutral-800 bg-[#FAFAFA] border border-neutral-200 focus:border-[#980900] outline-none rounded-2xl shadow-inner transition-all"
            />
          ))}
        </div>

        {/* Resend Code Ticker */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              Resend Code in {formatTime(timeLeft)}
            </p>
          ) : (
            <button
              onClick={() => setTimeLeft(59)}
              className="text-xs font-bold tracking-wider text-[#980900] hover:underline uppercase"
            >
              Resend Code Now
            </button>
          )}
        </div>

        {/* Verify CTA */}
        <button
          onClick={handleVerifyClick}
          className="w-full bg-gradient-to-r from-[#980900] to-[#c21807] hover:from-[#c21807] hover:to-[#ff3b30] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-red-900/10 active:scale-[0.98] transition-all uppercase tracking-wide text-sm"
        >
          VERIFY & CONTINUE
        </button>
      </div>

      {/* RENT. WEAR. REPEAT. Footer */}
      <footer className="flex justify-between items-center px-4 py-2 w-full max-w-xs mx-auto">
        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400">RENT.</span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400">WEAR.</span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400">REPEAT.</span>
      </footer>
    </div>
  );
}
