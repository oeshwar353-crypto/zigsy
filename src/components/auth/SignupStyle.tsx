import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { UserProfile } from "../../types";
import { STYLE_OPTIONS } from "../../data";

interface Props {
  initialData: UserProfile;
  onBack: () => void;
  onNext: (data: Partial<UserProfile>) => void;
}

export default function SignupStyle({ initialData, onBack, onNext }: Props) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialData.stylePreferences || []);
  const [error, setError] = useState("");

  const toggleStyle = (id: string) => {
    setError("");
    if (selectedStyles.includes(id)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== id));
    } else {
      setSelectedStyles([...selectedStyles, id]);
    }
  };

  const handleContinue = () => {
    if (selectedStyles.length === 0) {
      setError("Please select at least one fashion vibe to continue");
      return;
    }
    onNext({ stylePreferences: selectedStyles });
  };

  return (
    <div
      id="signup-style"
      className="flex flex-col justify-between min-h-screen w-full bg-[#f9f9f9] text-[#1a1c1c] p-6 select-none"
    >
      {/* Top Header */}
      <header className="flex items-center w-full relative">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-neutral-150 rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-800" />
        </button>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-black tracking-tight text-[#980900] pointer-events-none">
          ZIGSY
        </span>
      </header>

      {/* Main Container */}
      <div className="flex-grow max-w-sm mx-auto w-full my-6 flex flex-col justify-center space-y-6">
        {/* Step indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
            <span className="text-[#980900]">STYLE FEED</span>
            <span className="text-neutral-400">Step 2 of 4</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div className="w-2/4 h-full bg-[#980900] rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1c1c]">Your Fashion Vibe</h2>
          <p className="text-sm text-neutral-500 leading-normal">
            Select one or more style preferences to help us personalize your curated luxury feed.
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleStyle(style.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex justify-between items-center ${
                  isSelected
                    ? "bg-[#FAF0EE] border-[#980900] shadow-sm shadow-red-900/5"
                    : "bg-white border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-bold text-neutral-800">{style.label}</h4>
                  <p className="text-xs text-neutral-400 leading-normal">{style.desc}</p>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-[#980900] border-[#980900]"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {error && <p className="text-xs text-red-600 font-semibold pl-1">{error}</p>}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-[#980900] to-[#c21807] hover:from-[#c21807] hover:to-[#ff3b30] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-900/10 active:scale-[0.98] transition-all"
        >
          <span>Continue</span>
          <span className="text-lg">→</span>
        </button>
      </div>

      <div className="py-2"></div>
    </div>
  );
}
