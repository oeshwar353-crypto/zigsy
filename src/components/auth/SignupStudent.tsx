import React, { useState, useRef } from "react";
import { ArrowLeft, Camera, CheckCircle2, Loader2, Upload, ChevronDown, MapPin } from "lucide-react";
import { UserProfile } from "../../types";

const CAMPUSES = [
  { id: 'vgu', name: 'Vivekananda Global University', city: 'Jaipur' },
  { id: 'niat-jaipur', name: 'NIAT Jaipur', city: 'Jaipur' },
  { id: 'niat-delhi', name: 'NIAT Delhi', city: 'Delhi' },
];

interface Props {
  initialData: UserProfile;
  onBack: () => void;
  onNext: (data: Partial<UserProfile>) => void;
}

export default function SignupStudent({ initialData, onBack, onNext }: Props) {
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Set default to null every time a new signup starts
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  const [collegeName, setCollegeName] = useState(initialData.collegeName || "");
  const [collegeEmail, setCollegeEmail] = useState(initialData.collegeEmail || "");
  const [error, setError] = useState("");
  const [campusOpen, setCampusOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVerify = () => {
    if (!collegeName.trim()) {
      setError("Please select your campus to continue");
      return;
    }
    if (collegeEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collegeEmail)) {
      setError("Please enter a valid college email address");
      return;
    }
    if (!uploadedFileName) {
      setError("Please upload your student ID card");
      return;
    }

    setError("");
    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      onNext({
        collegeName,
        collegeEmail,
        studentIdUploaded: true,
      });
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setError("");
    }
  };

  const triggerUpload = () => {
    // Open the real file picker first; if nothing is selected,
    // the onChange handler will handle it. For prototype, we
    // also open the picker — the user must click the button themselves.
    fileInputRef.current?.click();
  };

  return (
    <div
      id="signup-student"
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
            <span className="text-[#980900]">VERIFICATION</span>
            <span className="text-neutral-400">Step 3 of 4</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-[#980900] rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1c1c]">Verify your student status</h2>
          <p className="text-sm text-neutral-500 leading-normal">
            To maintain our community of style, we verify student status to offer exclusive rental rates and seasonal drops. Your data is encrypted and handled securely.
          </p>
        </div>

        {/* Fields Wrapper */}
        <div className="space-y-5">
          {/* Campus Selector */}
          <div className="relative">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">
              Select Your Campus
            </label>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => { setCampusOpen(o => !o); setError(""); }}
              className={`w-full bg-white border rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors shadow-xs ${
                campusOpen
                  ? 'border-[#980900] ring-1 ring-[#980900]'
                  : collegeName
                  ? 'border-neutral-250 text-[#1a1c1c]'
                  : 'border-neutral-250 text-neutral-400'
              }`}
            >
              <span className={collegeName ? 'text-[#1a1c1c] font-medium' : 'text-neutral-400'}>
                {collegeName || 'Choose your college campus'}
              </span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${campusOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {campusOpen && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white border border-neutral-150 rounded-2xl shadow-xl overflow-hidden">
                {CAMPUSES.map((campus) => (
                  <button
                    key={campus.id}
                    type="button"
                    onClick={() => {
                      setCollegeName(campus.name);
                      setCampusOpen(false);
                      setError("");
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-[#FAF0EE] border-b border-neutral-100 last:border-0 ${
                      collegeName === campus.name ? 'bg-[#FAF0EE]' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      collegeName === campus.name ? 'bg-[#980900] text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-tight ${
                        collegeName === campus.name ? 'text-[#980900]' : 'text-[#1a1c1c]'
                      }`}>{campus.name}</p>
                      <p className="text-[11px] text-neutral-400 font-medium">{campus.city}</p>
                    </div>
                    {collegeName === campus.name && (
                      <CheckCircle2 className="w-4 h-4 text-[#980900] ml-auto shrink-0" />
                    )}
                  </button>
                ))}

                {/* Launching Soon Row */}
                <div className="px-4 py-3 flex items-center gap-3 bg-neutral-50 border-t border-neutral-100 opacity-60 cursor-default">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-500 leading-tight">Launching soon in your campus</p>
                    <p className="text-[11px] text-neutral-400 font-medium">More colleges coming soon</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* College Email Input */}
          <div className="relative">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">
              College Email <span className="text-neutral-450 font-medium">(Optional)</span>
            </label>
            <input
              type="email"
              value={collegeEmail}
              onChange={(e) => {
                setCollegeEmail(e.target.value);
                setError("");
              }}
              className="w-full bg-white border border-neutral-250 rounded-xl px-4 py-3 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#980900] focus:ring-1 focus:ring-[#980900] transition-colors shadow-xs"
              placeholder="e.g. name@college.edu"
            />
          </div>

          {/* Upload Student ID Card */}
          <div className="relative">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">
              Upload Student ID Card
            </label>
            <div className="p-5 rounded-2xl border bg-[#FAF0EE] border-[#980900] shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-neutral-200 text-[#980900]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-800">Upload ID Card</h4>
                  <p className="text-xs text-neutral-400 font-medium">
                    {uploadedFileName ? uploadedFileName : "Tap the button to upload"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                {uploadedFileName ? (
                  <button
                    onClick={triggerUpload}
                    className="flex items-center space-x-1 text-xs text-emerald-600 font-bold bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </button>
                ) : (
                  <button
                    onClick={triggerUpload}
                    className="p-2.5 bg-white hover:bg-neutral-50 rounded-full border border-neutral-200 shadow-sm active:scale-95 transition-all"
                  >
                    <Upload className="w-4 h-4 text-neutral-600" />
                  </button>
                )}
              </div>
            </div>
            
            {uploadedFileName && (
              <p className="text-xs text-neutral-450 font-medium text-center italic mt-2.5">
                File uploaded: {uploadedFileName}
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-xs text-red-600 font-semibold pl-1">{error}</p>}

        {/* Action Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-gradient-to-r from-[#980900] to-[#c21807] hover:from-[#c21807] hover:to-[#ff3b30] disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-900/10 active:scale-[0.98] transition-all"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>VERIFYING STATUS...</span>
            </>
          ) : (
            <span>VERIFY STATUS</span>
          )}
        </button>
      </div>

      {/* Support footer help */}
      <footer className="text-center py-2">
        <p className="text-xs text-neutral-500 font-medium">
          Don't have a student ID?{" "}
          <button className="text-[#980900] hover:underline font-bold">
            Contact Support
          </button>
        </p>
      </footer>
    </div>
  );
}
