import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface Props {
  onBack: () => void;
  onExplore: () => void;
}

export default function AccountCreated({ onBack, onExplore }: Props) {
  return (
    <div
      id="account-created"
      className="flex flex-col justify-between min-h-screen w-full bg-[#f9f9f9] text-[#1a1c1c] p-6 select-none"
    >
      {/* Top Header */}
      <header className="flex items-center w-full">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-neutral-150 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-800" />
        </button>
      </header>

      {/* Main Success Dialog Card */}
      <div className="flex-grow max-w-sm mx-auto w-full flex flex-col justify-center space-y-8 my-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2]" />
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-2 text-center">
          <h2 className="text-3.5xl font-bold tracking-tight text-[#1a1c1c]">You're all set!</h2>
          <p className="text-sm text-neutral-500 leading-normal max-w-xs mx-auto">
            Welcome to the Zigsy community. Your fashion journey starts here.
          </p>
        </div>

        {/* Triple Image Collage Layout */}
        <div className="grid grid-cols-2 gap-4 h-64">
          {/* Left Large Vertical Image */}
          <div className="rounded-3xl overflow-hidden border border-neutral-100 shadow-sm bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400"
              alt="Model in Red Jacket"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Two stacked Images */}
          <div className="grid grid-rows-2 gap-4">
            {/* Top Right Fabric Texture */}
            <div className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=400"
                alt="Satin Texture Detail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Right Wardrobe Mock */}
            <div className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=400"
                alt="Wardrobe Closet Mockup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Start Exploring Button */}
        <button
          onClick={onExplore}
          className="w-full bg-gradient-to-r from-[#980900] to-[#c21807] hover:from-[#c21807] hover:to-[#ff3b30] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-900/10 active:scale-[0.98] transition-all uppercase tracking-wide text-sm"
        >
          <span>START EXPLORING</span>
        </button>
      </div>

      <div className="py-2"></div>
    </div>
  );
}
