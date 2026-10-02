import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Screen, UserProfile, Product, ActiveScreen } from "./types";
import { products } from "./data";
import ErrorBoundary from "./components/ErrorBoundary";
import { addTakenUsername } from "./utils/username";

// Import custom screen components
import SplashScreen from "./components/auth/SplashScreen";
import LandingScreen from "./components/auth/LandingScreen";
import LoginScreen from "./components/auth/LoginScreen";
import OtpScreen from "./components/auth/OtpScreen";
import SignupBasic from "./components/auth/SignupBasic";
import SignupStyle from "./components/auth/SignupStyle";
import SignupStudent from "./components/auth/SignupStudent";
import SignupIdentity from "./components/auth/SignupIdentity";
import AccountCreated from "./components/auth/AccountCreated";
import HomeFeed from "./components/home/Homefeed";
import SearchScreen from "./components/home/SearchScreen";
import ExploreScreen from "./components/home/ExploreScreen";
import ProductDetailsScreen from "./components/home/ProductDetails";
import WishlistScreen from "./components/home/WishlistScreen";
import ProfileFlow from "./components/Profile/ProfileFlow";
import SellerFlow from "./components/seller/SellerFlow";

// Import context providers
import { BuyerProvider } from "./components/home/BuyerContext";
import { BookingProvider } from "./components/booking/BookingContext";
import { SellerProvider } from "./components/seller/SellerContext";

// Import booking screens
import RentalDateSelection from "./components/booking/RentalDateSelection";
import CheckoutScreen from "./components/booking/CheckoutScreen";
import PaymentScreen from "./components/booking/PaymentScreen";
import BookingSuccessScreen from "./components/booking/BookingSuccessScreen";
import MyOrdersScreen from "./components/booking/MyOrdersScreen";
import OrderDetailsScreen from "./components/booking/OrderDetailsScreen";
import OrderTrackingScreen from "./components/booking/OrderTrackingScreen";
import OrderExtensionScreen from "./components/booking/OrderExtensionScreen";
import OrderCancellationScreen from "./components/booking/OrderCancellationScreen";
// Import chat context & screens
import { ChatProvider } from "./components/chat/context/ChatContext";
import { Messages as ChatMessages } from "./components/chat/Messages";
import { ChatScreen } from "./components/chat/ChatScreen";
import { Notifications as ChatNotifications } from "./components/chat/Notifications";
import { ScheduleReturn as ChatScheduleReturn } from "./components/chat/ScheduleReturn";
import { ReportIssue as ChatReportIssue } from "./components/chat/ReportIssue";
import { BookingDetails as ChatBookingDetails } from "./components/chat/BookingDetails";
import { useSeller } from "./components/seller/SellerContext";
import { mapListingToProduct } from "./utils/deposit";

const LOCAL_STORAGE_KEY = "zigsy_prototype_session_v3";

const DEFAULT_USER: UserProfile = {
  id: "user_123",
  fullName: "",
  username: "",
  email: "",
  mobileNumber: "",
  collegeEmail: "",
  studentIdUploaded: false,
  selfieImage: "",
  stylePreferences: [],
  collegeName: "",
  isVerifiedStudent: false,
  isTrustedMember: false,
  rating: 5.0,
  rentalsCount: 0,
  listingsCount: 0,
  totalEarnings: 0,
  onTimeReturnRate: 100,
  bio: "",
  gender: "",
  phoneNumber: "",
  profilePhoto: ""
};


interface MainAppProps {
  activeSubScreen: ActiveScreen;
  setActiveSubScreen: (screen: ActiveScreen) => void;
}

function MainApp({ activeSubScreen, setActiveSubScreen }: MainAppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);
  const [tempPhone, setTempPhone] = useState("");

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.currentScreen) setCurrentScreen(parsed.currentScreen);
        if (parsed.userProfile) {
          setUserProfile({
            ...DEFAULT_USER,
            ...parsed.userProfile
          });
        }
      } catch (e) {
        console.error("Error restoring session:", e);
      }
    }
  }, []);

  // Save session to localStorage on changes
  useEffect(() => {
    // Avoid saving initial splash screen state so we always get the beautiful splash on cold start
    if (currentScreen !== Screen.Splash) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ currentScreen, userProfile })
      );
    }
  }, [currentScreen, userProfile]);

  const handleNextScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const [signupOtpMode, setSignupOtpMode] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(['midnight-velvet-blazer', 'emerald-sequin-dress']);

  const chatSubScreens = ['chat-inbox', 'chat-screen', 'chat-booking-details', 'chat-schedule-return', 'chat-report-issue', 'chat-notifications'];

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUserProfile(DEFAULT_USER);
    setCurrentScreen(Screen.Splash);
    setActiveSubScreen('home');
    setSelectedProductForDetails(null);
    setWishlist(['midnight-velvet-blazer', 'emerald-sequin-dress']);
  };

  const handleSendOtp = (phone: string) => {
    setTempPhone(phone);
    setSignupOtpMode(false);
    setCurrentScreen(Screen.Otp);
  };

  const handleVerifyOtp = (code: string) => {
    // If the user profile is already fully complete (name, etc.), go straight to Home.
    // Otherwise, direct them to Signup: Basic Info.
    if (userProfile.fullName && userProfile.email) {
      setCurrentScreen(Screen.Home);
    } else {
      setUserProfile({
        fullName: "",
        username: "",
        email: "",
        mobileNumber: tempPhone,
        collegeEmail: "",
        studentIdUploaded: false,
        selfieImage: "",
        stylePreferences: [],
        collegeName: "",
        isVerifiedStudent: false,
        isTrustedMember: false,
        rating: 5.0,
        rentalsCount: 0,
        listingsCount: 0,
        totalEarnings: 0,
        onTimeReturnRate: 100,
        bio: "",
        profilePhoto: ""
      });
      setCurrentScreen(Screen.SignupBasic);
    }
  };

  const handleSaveProfileData = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
  };

  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.35, ease: "easeInOut" }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-100 flex justify-center items-center">
      <div className={`w-full max-w-md bg-white md:rounded-[40px] md:shadow-2xl md:border-[10px] md:border-neutral-900 overflow-hidden relative flex flex-col scrollbar-none ${chatSubScreens.includes(activeSubScreen)
        ? 'h-screen md:h-[850px]'
        : 'min-h-screen md:min-h-[850px] md:max-h-[900px]'
        }`}>

        {/* Dynamic Screen Routing Render with Framer Motion animations */}
        <AnimatePresence mode="wait">
          {currentScreen === Screen.Splash && (
            <motion.div key="splash" {...pageTransition} className="w-full min-h-full flex-1">
              <SplashScreen onNext={handleNextScreen} />
            </motion.div>
          )}

          {currentScreen === Screen.Landing && (
            <motion.div key="landing" {...pageTransition} className="w-full min-h-full flex-1">
              <LandingScreen onNext={handleNextScreen} />
            </motion.div>
          )}

          {currentScreen === Screen.Login && (
            <motion.div key="login" {...pageTransition} className="w-full min-h-full flex-1">
              <LoginScreen
                onBack={() => handleNextScreen(Screen.Landing)}
                onSendOtp={handleSendOtp}
              />
            </motion.div>
          )}

          {currentScreen === Screen.Otp && (
            <motion.div key="otp" {...pageTransition} className="w-full min-h-full flex-1">
              <OtpScreen
                phoneNumber={tempPhone}
                onBack={() => handleNextScreen(signupOtpMode ? Screen.SignupBasic : Screen.Login)}
                onVerify={(code) => {
                  if (signupOtpMode) {
                    // Signup flow: phone verified, continue to style preferences
                    setSignupOtpMode(false);
                    handleNextScreen(Screen.SignupStyle);
                  } else {
                    handleVerifyOtp(code);
                  }
                }}
              />
            </motion.div>
          )}

          {currentScreen === Screen.SignupBasic && (
            <motion.div key="signup_basic" {...pageTransition} className="w-full min-h-full flex-1">
              <SignupBasic
                initialData={userProfile}
                onBack={() => handleNextScreen(Screen.Landing)}
                onGoToLogin={() => handleNextScreen(Screen.Login)}
                onNext={(data) => {
                  handleSaveProfileData(data);
                  if (data.username) {
                    addTakenUsername(data.username);
                  }
                  // Send OTP to the entered mobile number, then proceed to verify
                  const phone = (data.mobileNumber || "").trim();
                  setTempPhone(phone);
                  setSignupOtpMode(true);
                  handleNextScreen(Screen.Otp);
                }}
              />
            </motion.div>
          )}

          {currentScreen === Screen.SignupStyle && (
            <motion.div key="signup_style" {...pageTransition} className="w-full min-h-full flex-1">
              <SignupStyle
                initialData={userProfile}
                onBack={() => handleNextScreen(Screen.SignupBasic)}
                onNext={(data) => {
                  handleSaveProfileData(data);
                  handleNextScreen(Screen.SignupStudent);
                }}
              />
            </motion.div>
          )}

          {currentScreen === Screen.SignupStudent && (
            <motion.div key="signup_student" {...pageTransition} className="w-full min-h-full flex-1">
              <SignupStudent
                initialData={userProfile}
                onBack={() => handleNextScreen(Screen.SignupStyle)}
                onNext={(data) => {
                  handleSaveProfileData(data);
                  handleNextScreen(Screen.SignupIdentity);
                }}
              />
            </motion.div>
          )}

          {currentScreen === Screen.SignupIdentity && (
            <motion.div key="signup_identity" {...pageTransition} className="w-full min-h-full flex-1">
              <SignupIdentity
                onBack={() => handleNextScreen(Screen.SignupStudent)}
                onNext={(selfieUrl) => {
                  handleSaveProfileData({ selfieImage: selfieUrl });
                  handleNextScreen(Screen.AccountCreated);
                }}
              />
            </motion.div>
          )}

          {currentScreen === Screen.AccountCreated && (
            <motion.div key="account_created" {...pageTransition} className="w-full min-h-full flex-1">
              <AccountCreated
                onBack={() => handleNextScreen(Screen.SignupIdentity)}
                onExplore={() => handleNextScreen(Screen.Home)}
              />
            </motion.div>
          )}

          {currentScreen === Screen.Home && (
            <motion.div
              key="home"
              {...pageTransition}
              className={`w-full flex-1 flex flex-col min-h-0 ${chatSubScreens.includes(activeSubScreen)
                ? 'h-screen md:h-full overflow-hidden'
                : 'min-h-full'
                }`}
            >
              <BuyerProvider
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                wishlist={wishlist}
                handleToggleWishlist={handleToggleWishlist}
                handleReset={handleReset}
              >
                <SellerProvider>
                  <BookingProvider>
                  {activeSubScreen === 'home' && (
                    <HomeFeed
                      key="home-feed-party"
                      defaultCategory="Party"
                      onNavigate={setActiveSubScreen}
                      onSelectProduct={(p) => {
                        setSelectedProductForDetails(p);
                        setActiveSubScreen('details');
                      }}
                      wishlist={wishlist}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  )}
                  {activeSubScreen === 'category' && (
                    <ExploreScreen
                      onNavigate={setActiveSubScreen}
                      onSelectProduct={(p) => {
                        setSelectedProductForDetails(p);
                        setActiveSubScreen('details');
                      }}
                      wishlist={wishlist}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  )}
                  {activeSubScreen === 'trending-all' && (
                    <ExploreScreen
                      defaultSort="trending"
                      onNavigate={setActiveSubScreen}
                      onSelectProduct={(p) => {
                        setSelectedProductForDetails(p);
                        setActiveSubScreen('details');
                      }}
                      wishlist={wishlist}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  )}
                  {activeSubScreen === 'search' && (
                    <SearchScreen
                      onNavigate={setActiveSubScreen}
                      onSelectProduct={(p) => {
                        setSelectedProductForDetails(p);
                        setActiveSubScreen('details');
                      }}
                      wishlist={wishlist}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  )}
                  {activeSubScreen === 'sell' && (
                    <SellerFlow
                      onNavigate={setActiveSubScreen}
                    />
                  )}
                  {activeSubScreen === 'details' && (
                    <ProductDetailsScreen
                      product={selectedProductForDetails || products[0]}
                      onNavigate={setActiveSubScreen}
                      onSelectProduct={(p) => {
                        setSelectedProductForDetails(p);
                        setActiveSubScreen('details');
                      }}
                      wishlist={wishlist}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  )}
                  {activeSubScreen === 'wishlist' && (
                    <WishlistScreen
                      onNavigate={setActiveSubScreen}
                      onSelectProduct={(p) => {
                        setSelectedProductForDetails(p);
                        setActiveSubScreen('details');
                      }}
                      wishlist={wishlist}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  )}
                  {activeSubScreen === 'profile' && (
                    <ProfileFlow
                      userProfile={userProfile}
                      setUserProfile={setUserProfile}
                      onNavigate={setActiveSubScreen}
                      onSignOut={handleReset}
                    />
                  )}
                  {activeSubScreen === 'date-selection' && (
                    <RentalDateSelection onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'checkout' && (
                    <CheckoutScreen onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'payment' && (
                    <PaymentScreen onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'booking-success' && (
                    <BookingSuccessScreen onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'my-orders' && (
                    <MyOrdersScreen onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'order-details' && (
                    <OrderDetailsScreen onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'order-tracking' && (
                    <OrderTrackingScreen onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'order-extension' && (
                    <OrderExtensionScreen onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'order-cancellation' && (
                    <OrderCancellationScreen onNavigate={setActiveSubScreen} />
                  )}
                  {activeSubScreen === 'chat-inbox' && (
                    <ChatMessages onExit={() => setActiveSubScreen('home')} />
                  )}
                  {activeSubScreen === 'chat-screen' && (
                    <ChatScreen />
                  )}
                  {activeSubScreen === 'chat-booking-details' && (
                    <ChatBookingDetails />
                  )}
                  {activeSubScreen === 'chat-schedule-return' && (
                    <ChatScheduleReturn />
                  )}
                  {activeSubScreen === 'chat-report-issue' && (
                    <ChatReportIssue />
                  )}
                  {activeSubScreen === 'chat-notifications' && (
                    <ChatNotifications onBack={() => setActiveSubScreen('home')} />
                  )}
                </BookingProvider>
              </SellerProvider>
            </BuyerProvider>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function App() {
  const [activeSubScreen, setActiveSubScreen] = useState<ActiveScreen>('home');

  return (
    <ErrorBoundary onReset={() => { localStorage.removeItem('zigsy_prototype_session_v3'); window.location.reload(); }}>
      <ChatProvider activeSubScreen={activeSubScreen} setActiveSubScreen={setActiveSubScreen}>
        <MainApp activeSubScreen={activeSubScreen} setActiveSubScreen={setActiveSubScreen} />
      </ChatProvider>
    </ErrorBoundary>
  );
}

