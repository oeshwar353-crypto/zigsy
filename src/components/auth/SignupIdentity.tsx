import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, Sun, Eye, Ban, Check, Loader2 } from "lucide-react";

interface Props {
  onBack: () => void;
  onNext: (selfieDataUrl: string) => void;
}

export default function SignupIdentity({ onBack, onNext }: Props) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState("");

  // Camera integration state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);

  // Real-time analysis status
  const [lightingOk, setLightingOk] = useState(true);
  const [faceOk, setFaceOk] = useState(true);
  const [noShadesOk, setNoShadesOk] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showBypass, setShowBypass] = useState(false);
  const [bypassActive, setBypassActive] = useState(false);

  useEffect(() => {
    let timerId: any;
    if (streamActive) {
      timerId = setTimeout(() => {
        setShowBypass(true);
      }, 5000);
    } else {
      setShowBypass(false);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [streamActive]);

  useEffect(() => {
    // Attempt real camera activation
    let activeStream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 300, height: 300, facingMode: "user" } })
        .then((stream) => {
          activeStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
          }
          setStreamActive(true);
        })
        .catch((err) => {
          console.error("Camera access failed:", err);
          // Fallback gracefully to simulated selfie container
          setStreamActive(false);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let intervalId: any;
    if (streamActive && videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");

      intervalId = setInterval(() => {
        if (videoRef.current && ctx) {
          try {
            ctx.drawImage(videoRef.current, 0, 0, 80, 80);
            const imgData = ctx.getImageData(0, 0, 80, 80);
            const data = imgData.data;

            // 1. Calculate Average Brightness
            let sumBrightness = 0;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              sumBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
            }
            const avgBr = sumBrightness / (data.length / 4);
            const lightPass = bypassActive || (avgBr >= 65 && avgBr <= 245);
            setLightingOk(lightPass);

            // 2. Skin Tone / Face detection with Centering & Symmetry checks
            let totalSkin = 0;
            let leftSkin = 0;
            let rightSkin = 0;
            let skinXSum = 0;

            for (let y = 15; y < 65; y++) {
              for (let x = 16; x < 64; x++) {
                const idx = (y * 80 + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                // Relaxed skin tone heuristic for diverse skin tones, shadows, and low-light conditions
                if (r > 40 && g > 25 && b > 15 && r > g && g >= b && (r - g) > 8) {
                  totalSkin++;
                  skinXSum += x;
                  if (x < 38) leftSkin++;
                  if (x > 42) rightSkin++;
                }
              }
            }

            const hasSufficientSkin = bypassActive || (totalSkin >= 60);
            const avgX = totalSkin > 0 ? skinXSum / totalSkin : 40;
            const isCentered = bypassActive || (totalSkin > 0 ? Math.abs(avgX - 40) <= 15.0 : true);
            const isSymmetric = bypassActive || (totalSkin > 0 
              ? (leftSkin > 15 && rightSkin > 15 && (Math.min(leftSkin, rightSkin) / Math.max(leftSkin, rightSkin) >= 0.35)) 
              : true);
            const facePass = bypassActive || (hasSufficientSkin && isCentered && isSymmetric);
            setFaceOk(facePass);

            // 3. Sunglasses / Shades detection
            let eyeDarkPixels = 0;
            let totalEyePixels = 0;
            for (let y = 25; y < 45; y++) {
              for (let x = 22; x < 58; x++) {
                const idx = (y * 80 + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const br = 0.299 * r + 0.587 * g + 0.114 * b;
                if (br < 45) {
                  eyeDarkPixels++;
                }
                totalEyePixels++;
              }
            }
            const eyeDarkRatio = eyeDarkPixels / totalEyePixels;
            // Shades detected if center-eye region is disproportionately dark in a well-lit face (relaxed threshold)
            const shadesDetected = !bypassActive && (eyeDarkRatio > 0.65 && facePass && lightPass);
            setNoShadesOk(!shadesDetected);

            // 4. Detailed dynamic feedback messages
            if (bypassActive) {
              setFeedbackMessage("Ready to capture!");
            } else if (!lightPass) {
              if (avgBr < 65) {
                setFeedbackMessage("Low lighting detected. Move to a brighter area.");
              } else {
                setFeedbackMessage("Too bright/Glare detected. Adjust your position.");
              }
            } else if (!hasSufficientSkin) {
              setFeedbackMessage("No face detected. Position your face in the circle.");
            } else if (!isCentered) {
              setFeedbackMessage("Face not centered. Align inside the guide circle.");
            } else if (!isSymmetric) {
              setFeedbackMessage("Front-facing view required. Please look directly at the camera.");
            } else if (shadesDetected) {
              setFeedbackMessage("Sunglasses/shades detected. Please remove them.");
            } else {
              setFeedbackMessage("Ready to capture!");
            }
          } catch (e) {
            console.error("Frame analysis error:", e);
          }
        }
      }, 300);
    } else {
      setLightingOk(true);
      setFaceOk(true);
      setNoShadesOk(true);
      setFeedbackMessage("Verification checks passed (Simulated)");
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [streamActive, bypassActive]);

  const handleTakeSelfie = () => {
    if (!agreedToTerms || !agreedToPrivacy) {
      setError("Please accept the Terms & Privacy policies to continue");
      return;
    }

    if (streamActive && (!lightingOk || !faceOk || !noShadesOk)) {
      setError("Please resolve the verification alerts before capturing.");
      return;
    }

    setError("");
    setIsCapturing(true);

    setTimeout(() => {
      setIsCapturing(false);
      setCaptured(true);
      
      let selfieUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300";

      if (streamActive && videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 300;
        canvas.height = videoRef.current.videoHeight || 300;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          selfieUrl = canvas.toDataURL("image/jpeg", 0.9);
        }
      }
      onNext(selfieUrl);
    }, 1800);
  };

  const buttonDisabled = isCapturing || (streamActive && (!lightingOk || !faceOk || !noShadesOk));

  const getButtonContent = () => {
    if (isCapturing) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verifying Identity...</span>
        </>
      );
    }
    if (streamActive) {
      if (!lightingOk) return <span>Lighting Alert - Adjust Position</span>;
      if (!faceOk) {
        if (feedbackMessage.includes("centered")) return <span>Center Your Face</span>;
        if (feedbackMessage.includes("Front-facing")) return <span>Look Directly at Camera</span>;
        return <span>Align Face inside Circle</span>;
      }
      if (!noShadesOk) return <span>Remove Hats/Shades</span>;
    }
    return (
      <>
        <Camera className="w-5 h-5" />
        <span>Take Selfie</span>
      </>
    );
  };

  return (
    <div
      id="signup-identity"
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
        <span className="absolute right-0 text-xs font-bold text-neutral-400">Step 4 of 4</span>
      </header>

      {/* Main Container */}
      <div className="flex-grow max-w-sm mx-auto w-full my-4 flex flex-col justify-center space-y-6">
        {/* Title */}
        <div className="space-y-1.5 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1a1c1c]">Identity Verification</h2>
          <p className="text-sm text-neutral-500 leading-normal">
            Take a quick selfie to secure your account and join our trusted community of fashion enthusiasts.
          </p>
        </div>

        {/* Camera Viewfinder Box (Circle with Red Border) */}
        <div className="flex justify-center py-2">
          <div className={`relative w-64 h-64 rounded-full border-4 overflow-hidden bg-neutral-900 shadow-md flex items-center justify-center transition-all duration-300 ${
            lightingOk && faceOk && noShadesOk && streamActive
              ? "border-green-600 shadow-green-100 shadow-lg"
              : "border-[#980900]"
          }`}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${streamActive ? "block" : "hidden"}`}
            />
            {!streamActive && (
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
                alt="Simulated Selfie Fallback"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-90 contrast-95"
              />
            )}

            {/* Overlaid Grid Guideline */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-black/10 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-white/40 border-dashed rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-white/50 animate-pulse" />
              </div>
            </div>

            {/* Shutter Animation Overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-white animate-fade-out flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#980900] animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Real-time status / Feedback message */}
        <div className="text-center">
          <p className={`text-xs font-bold px-4 py-1.5 rounded-full inline-block transition-all duration-300 ${
            feedbackMessage === "Ready to capture!" 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : feedbackMessage === "Verification checks passed (Simulated)"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-red-50 text-red-600 border border-red-100 animate-pulse"
          }`}>
            {feedbackMessage}
          </p>
        </div>

        {/* Guidelines Card */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex justify-around items-center text-center shadow-sm py-4">
          <div className="flex flex-col items-center space-y-1">
            <Sun className={`w-5 h-5 transition-all duration-300 ${lightingOk ? 'text-green-600' : 'text-amber-500 animate-pulse'}`} />
            <span className={`text-[10px] font-bold transition-all duration-300 ${lightingOk ? 'text-green-700' : 'text-neutral-500'}`}>Good lighting</span>
          </div>
          <div className="flex flex-col items-center space-y-1 border-x border-neutral-100 px-6">
            <Eye className={`w-5 h-5 transition-all duration-300 ${faceOk ? 'text-green-600' : 'text-red-500 animate-pulse'}`} />
            <span className={`text-[10px] font-bold transition-all duration-300 ${faceOk ? 'text-green-700' : 'text-neutral-500'}`}>Face visible</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Ban className={`w-5 h-5 transition-all duration-300 ${noShadesOk ? 'text-green-600' : 'text-red-500 animate-pulse'}`} />
            <span className={`text-[10px] font-bold transition-all duration-300 ${noShadesOk ? 'text-green-700' : 'text-neutral-500'}`}>No hats/shades</span>
          </div>
        </div>

        <button
          onClick={handleTakeSelfie}
          disabled={buttonDisabled}
          className={`w-full font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2.5 transition-all duration-300 ${
            buttonDisabled
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-[#980900] to-[#c21807] hover:from-[#c21807] hover:to-[#ff3b30] text-white shadow-lg shadow-red-900/10 active:scale-[0.98] cursor-pointer"
          }`}
        >
          {getButtonContent()}
        </button>

        {error && <p className="text-xs text-red-600 font-semibold pl-1">{error}</p>}


        {/* Legal Agreements Checkboxes */}
        <div className="space-y-3">
          {/* Checkbox 1 */}
          <label className="flex items-start space-x-3 cursor-pointer group">
            <div className="relative flex items-center pt-0.5">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => {
                  setAgreedToTerms(!agreedToTerms);
                  setError("");
                }}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border border-neutral-300 peer-checked:bg-[#980900] peer-checked:border-[#980900] transition-all flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white stroke-[3.5] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-neutral-500 font-medium leading-relaxed group-hover:text-neutral-700">
              I agree to the <a href="#terms" className="underline hover:text-neutral-700 font-semibold">Terms of Service</a> and understand how my data is processed.
            </span>
          </label>

          {/* Checkbox 2 */}
          <label className="flex items-start space-x-3 cursor-pointer group">
            <div className="relative flex items-center pt-0.5">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={() => {
                  setAgreedToPrivacy(!agreedToPrivacy);
                  setError("");
                }}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border border-neutral-300 peer-checked:bg-[#980900] peer-checked:border-[#980900] transition-all flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white stroke-[3.5] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-neutral-500 font-medium leading-relaxed group-hover:text-neutral-700">
              I have read and accept the <a href="#privacy" className="underline hover:text-neutral-700 font-semibold">Privacy Policy</a> regarding biometric verification.
            </span>
          </label>
        </div>
      </div>

      <div className="py-2"></div>
    </div>
  );
}
