import React from 'react';
import { ProfileProvider, useProfile, ProfileScreenName } from './components/ProfileContext';
import ProfileDashboard from './ProfileDashboard';
import EditProfile from './EditProfile';
import SavedAddresses from './SavedAddresses';
import PaymentMethods from '../payments/PaymentMethods';
import PayoutMethods from '../payments/PayoutMethods';
import Reviews from './Reviews';
import HelpCenter from './HelpCenter';
import Settings from './Settings';
import RentalHistory from './RentalHistory';
import Notifications from './Notifications';
import TermsConditions from './TermsConditions';
import PrivacyPolicy from './PrivacyPolicy';
import StudentGuidelines from './StudentGuidelines';
import HandoffGuidelines from './HandoffGuidelines';
import AccountPrivacy from './AccountPrivacy';
import AccountSecurity from './AccountSecurity';
import AboutZigsy from './AboutZigsy';
import { UserProfile, ActiveScreen } from '../../types';
import { ArrowLeft, Bell } from 'lucide-react';

interface ProfileFlowProps {
    userProfile: UserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    onNavigate: (screen: ActiveScreen) => void;
    onSignOut?: () => void;
}

function ProfileContent() {
    const { screen, goBack, setScreen, notifications } = useProfile();

    const screenTitles: Record<ProfileScreenName | 'notifications', string> = {
        'profile-dashboard': 'Profile',
        'edit-profile': 'Edit Profile',
        'saved-addresses': 'Saved Addresses',
        'payment-methods': 'Payment Methods',
        'payout-methods': 'Payout Methods',
        'reviews': 'Reviews & Ratings',
        'help-center': 'Help Center',
        'settings': 'Settings',
        'rental-bookings': 'My Rental Bookings',
        'wishlist': 'Wishlist',
        'notifications': 'Notifications',
        'terms-conditions': 'Terms & Conditions',
        'privacy-policy': 'Privacy Policy',
        'student-guidelines': 'Community Guidelines',
        'handoff-guidelines': 'Eco Hand-off Guidelines',
        'account-privacy': 'Account Privacy',
        'account-security': 'Account Security & 2FA',
        'about-zigsy': 'About Zigsy'
    };

    const currentTitle = screenTitles[screen] || 'Profile';
    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="w-full h-full flex flex-col bg-surface-bg text-text-primary overflow-hidden">
            {/* Header */}
            <header className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-30 shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={goBack}
                        className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-text-primary cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-text-primary capitalize">{currentTitle}</h1>
                </div>

                {screen === 'profile-dashboard' && (
                    <button
                        onClick={() => setScreen('notifications' as any)}
                        className="p-2 relative hover:bg-gray-50 rounded-full transition-colors text-text-primary cursor-pointer"
                    >
                        <Bell className="w-5.5 h-5.5" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute top-1 right-1 bg-brand-cherry text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                                {unreadNotificationsCount}
                            </span>
                        )}
                    </button>
                )}
            </header>

            {/* Scrollable Container */}
            <main className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
                {screen === 'profile-dashboard' && <ProfileDashboard />}
                {screen === 'edit-profile' && <EditProfile />}
                {screen === 'saved-addresses' && <SavedAddresses />}
                {screen === 'payment-methods' && <PaymentMethods />}
                {screen === 'payout-methods' && <PayoutMethods onBack={goBack} />}
                {screen === 'reviews' && <Reviews />}
                {screen === 'help-center' && <HelpCenter />}
                {screen === 'settings' && <Settings />}
                {screen === 'rental-bookings' && <RentalHistory />}
                {screen === 'terms-conditions' && <TermsConditions />}
                {screen === 'privacy-policy' && <PrivacyPolicy />}
                {screen === 'student-guidelines' && <StudentGuidelines />}
                {screen === 'handoff-guidelines' && <HandoffGuidelines />}
                {screen === 'account-privacy' && <AccountPrivacy />}
                {screen === 'account-security' && <AccountSecurity />}
                {screen === 'about-zigsy' && <AboutZigsy />}
                {(screen as string) === 'notifications' && <Notifications />}
            </main>
        </div>
    );
}

export default function ProfileFlow({ userProfile, setUserProfile, onNavigate, onSignOut }: ProfileFlowProps) {
    return (
        <ProfileProvider
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onBackToHome={() => onNavigate('home')}
            onSellerDashboard={() => onNavigate('sell')}
            onSignOut={onSignOut}
            onNavigate={onNavigate}
        >
            <ProfileContent />
        </ProfileProvider>
    );
}
