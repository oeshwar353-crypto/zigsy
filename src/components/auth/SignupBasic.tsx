import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { UserProfile, Screen } from "../../types";
import boyAvatar from "../../../images/boy avtar.png";
import girlAvatar from "../../../images/girl avtar.png";
import { isUsernameTaken } from "../../utils/username";

interface Props {
  initialData: UserProfile;
  onBack: () => void;
  onNext: (data: Partial<UserProfile>) => void;
  onGoToLogin: () => void;
}

export default function SignupBasic({ initialData, onBack, onNext, onGoToLogin }: Props) {
  const [fullName, setFullName] = useState(initialData.fullName || "");
  const [username, setUsername] = useState(initialData.username || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [mobileNumber, setMobileNumber] = useState(initialData.mobileNumber || "");
  const [gender, setGender] = useState(initialData.gender || "");
  const [profilePhoto, setProfilePhoto] = useState(initialData.profilePhoto || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !mobileNumber) {
      setError("Please fill out all the fields");
      return;
    }
    if (isUsernameTaken(username)) {
      setError("Username is already taken. Please choose another one.");
      return;
    }
    if (!gender) {
      setError("Please select your gender");
      return;
    }
    setError("");
    onNext({
      fullName,
      username,
      email,
      mobileNumber,
      gender,
      profilePhoto,
    });
  };

  return (
    <div
      id="signup-basic"
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
            <span className="text-[#980900]">SIGN UP</span>
            <span className="text-neutral-400">Step 1 of 4</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-[#980900] rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1c1c]">Basic Information</h2>
          <p className="text-sm text-neutral-500 leading-normal">
            Let's start with the essentials to set up your luxury wardrobe experience.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAFAFA] border-b border-neutral-200 hover:border-[#916f69] focus:border-[#980900] focus:bg-white outline-none transition-all px-4 py-3 text-sm font-medium text-neutral-800 placeholder-neutral-400"
              />
            </div>

            {/* Username */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  const val = e.target.value;
                  setUsername(val);
                  if (val && isUsernameTaken(val)) {
                    setError("Username is already taken. Please choose another one.");
                  } else {
                    setError("");
                  }
                }}
                className={`w-full bg-[#FAFAFA] border-b outline-none transition-all px-4 py-3 text-sm font-medium text-neutral-800 placeholder-neutral-400 ${
                  username && isUsernameTaken(username)
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-neutral-200 hover:border-[#916f69] focus:border-[#980900] focus:bg-white'
                }`}
              />
              {username && isUsernameTaken(username) && (
                <span className="text-xs text-red-500 font-semibold px-4 mt-1 block">
                  Username is already taken
                </span>
              )}
            </div>

            {/* Email Address */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAFAFA] border-b border-neutral-200 hover:border-[#916f69] focus:border-[#980900] focus:bg-white outline-none transition-all px-4 py-3 text-sm font-medium text-neutral-800 placeholder-neutral-400"
              />
            </div>

            {/* Mobile Number */}
            <div className="relative">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-[#FAFAFA] border-b border-neutral-200 hover:border-[#916f69] focus:border-[#980900] focus:bg-white outline-none transition-all px-4 py-3 text-sm font-medium text-neutral-800 placeholder-neutral-400"
              />
            </div>

            {/* Gender */}
            <div className="relative pt-1">
              <p className="text-xs font-semibold text-neutral-400 px-4 mb-2">Gender</p>
              <div className="flex gap-2 px-1">
                {['Male', 'Female', 'Prefer not to say'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { 
                      setGender(option); 
                      setError(""); 
                      if (option === 'Male') {
                        setProfilePhoto(boyAvatar);
                      } else if (option === 'Female') {
                        setProfilePhoto(girlAvatar);
                      } else {
                        setProfilePhoto("");
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide border transition-all active:scale-95 ${
                      gender === option
                        ? 'bg-[#980900] text-white border-[#980900] shadow-sm'
                        : 'bg-white text-neutral-500 border-neutral-200 hover:border-[#980900] hover:text-[#980900]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 font-semibold pl-1">{error}</p>}



          {/* Next Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#980900] to-[#c21807] hover:from-[#c21807] hover:to-[#ff3b30] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-900/10 active:scale-[0.98] transition-all"
          >
            <span>Next</span>
            <span className="text-lg">→</span>
          </button>
        </form>
      </div>

      {/* Already have an account link */}
      <footer className="text-center py-2">
        <p className="text-xs text-neutral-500 font-medium">
          Already have an account?{" "}
          <button
            onClick={onGoToLogin}
            className="text-[#980900] hover:underline font-bold"
          >
            Login
          </button>
        </p>
      </footer>
    </div>
  );
}
