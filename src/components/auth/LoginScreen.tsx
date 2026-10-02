import React, { useState } from "react";
import { X } from "lucide-react";
import { Screen } from "../../types";

interface Props {
  onBack: () => void;
  onSendOtp: (phone: string) => void;
}

export default function LoginScreen({ onBack, onSendOtp }: Props) {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    onSendOtp(`${countryCode} ${phone}`);
  };

  return (
    <div
      id="login-screen"
      className="flex flex-col justify-between min-h-screen w-full bg-[#f9f9f9] text-[#1a1c1c] p-6 select-none"
    >
      {/* Top Header */}
      <header className="flex justify-between items-center w-full">
        <span className="text-2xl font-black tracking-tight text-[#980900]">ZIGSY</span>
        <button
          onClick={onBack}
          className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-neutral-600" />
        </button>
      </header>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full my-8 space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1c1c]">Welcome back</h2>
          <p className="text-sm text-neutral-500">Enter your mobile number to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            {/* Country Code Display */}
            <div className="relative flex items-center bg-[#FAFAFA] border border-neutral-200 hover:border-neutral-300 transition-colors rounded-2xl px-4 py-4">
              <span className="text-sm font-bold text-neutral-800">{countryCode}</span>
            </div>

            {/* Phone Number Input */}
            <div className="flex-1 relative">
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className="w-full bg-[#FAFAFA] border border-neutral-200 hover:border-neutral-300 focus:border-[#980900] outline-none transition-all rounded-2xl px-5 py-4 text-sm font-medium text-neutral-800 placeholder-neutral-400"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-600 font-medium pl-1">{error}</p>}

          {/* Send OTP Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#980900] to-[#c21807] hover:from-[#c21807] hover:to-[#ff3b30] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-900/10 active:scale-[0.98] transition-all"
          >
            <span>Send OTP</span>
            <span className="text-lg">→</span>
          </button>
        </form>

      </div>

      {/* Footer Disclaimer */}
      <footer className="text-center text-[11px] text-neutral-400 leading-normal max-w-xs mx-auto">
        By continuing, you agree to Zigsy's{" "}
        <a href="#terms" className="underline hover:text-neutral-600 font-medium">Terms</a> &{" "}
        <a href="#privacy" className="underline hover:text-neutral-600 font-medium">Privacy Policy</a>.
      </footer>
    </div>
  );
}
