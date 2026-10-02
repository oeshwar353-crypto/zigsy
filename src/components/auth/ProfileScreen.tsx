import React, { useState } from 'react';
import {
    Menu,
    ShoppingBag,
    LogOut,
    User,
    Mail,
    Phone,
    Sparkles,
    Shield,
    Home,
    Search,
    PlusCircle,
    Heart
} from 'lucide-react';
import { UserProfile, ActiveScreen } from '../../types';
import { useBuyer } from '../home/BuyerContext';
import ConfirmModal from '../ConfirmModal';

interface ProfileScreenProps {
    user: UserProfile;
    onNavigate: (screen: ActiveScreen) => void;
    onReset: () => void;
}

export default function ProfileScreen({
    user,
    onNavigate,
    onReset
}: ProfileScreenProps) {
    const { wishlist } = useBuyer();
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const handleSignOut = () => {
        setShowSignOutConfirm(true);
    };

    return (
        <>
        <div className="bg-surface text-on-surface font-body-md min-h-screen pb-32">
            {/* Top Navigation */}
            <header className="fixed top-0 w-full z-50 bg-white/95 border-b border-surface-container h-16">
                <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onNavigate('home')}
                            className="text-primary hover:opacity-80 transition-opacity cursor-pointer p-1 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1
                            onClick={() => onNavigate('home')}
                            className="font-sans font-extrabold text-2xl tracking-tighter text-primary cursor-pointer animate-pulse"
                        >
                            ZIGSY
                        </h1>
                    </div>
                    <button
                        onClick={() => onNavigate('wishlist')}
                        className="text-primary hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <ShoppingBag className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="pt-24 px-4 md:px-8 max-w-md mx-auto min-h-screen flex flex-col justify-between">
                <div>
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Your Profile</h2>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">Verified Fashion Profile</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container mb-6 animate-scale-up">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-md mb-4 relative">
                                <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
                                    {user.selfieImage ? (
                                        <img
                                            src={user.selfieImage}
                                            alt="Profile Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-primary" />
                                    )}
                                </div>
                                <span className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
                            </div>
                            <h3 className="text-xl font-bold text-on-surface">{user.fullName || 'Om Eshwar Acharya'}</h3>
                            <p className="text-xs font-semibold text-on-surface-variant">@{user.username || 'omeshwar'}</p>
                        </div>

                        {/* Details */}
                        <div className="space-y-4 pt-4 border-t border-surface-container">
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-surface-container text-primary">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Email</p>
                                    <p className="text-sm font-semibold truncate text-on-surface">{user.email || 'om.acharya@student.college.edu'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-surface-container text-primary">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Mobile</p>
                                    <p className="text-sm font-semibold text-on-surface">{user.mobileNumber || '+91 98765 43210'}</p>
                                </div>
                            </div>

                            {user.collegeEmail && (
                                <div className="flex items-center gap-3.5">
                                    <div className="p-2.5 rounded-xl bg-surface-container text-primary">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">College ID Verified</p>
                                        <p className="text-sm font-semibold truncate text-on-surface">{user.collegeEmail}</p>
                                    </div>
                                </div>
                            )}

                            {user.stylePreferences && user.stylePreferences.length > 0 && (
                                <div className="flex flex-col gap-2 pt-2">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" /> Style Preferences
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {user.stylePreferences.map((pref, i) => (
                                            <span
                                                key={i}
                                                className="bg-primary/5 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full border border-primary/10 capitalize shadow-sm"
                                            >
                                                {pref.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bookings Integration */}
                <div className="px-2 mb-3 mt-6">
                    <button
                        onClick={() => onNavigate('my-orders')}
                        className="w-full flex items-center justify-center gap-3 bg-surface-container border border-surface-container-highest text-on-surface font-bold py-4 rounded-2xl shadow-sm hover:bg-surface-container-high hover:scale-[1.01] active:scale-95 duration-150 transition-all cursor-pointer text-base"
                    >
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        My Rental Bookings
                    </button>
                </div>

                {/* Seller Integration */}
                <div className="px-2 mb-4">
                    <button
                        onClick={() => onNavigate('sell')}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#C21807] to-[#800F04] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#C21807]/20 hover:scale-[1.01] hover:shadow-[#C21807]/30 active:scale-95 duration-150 transition-all cursor-pointer text-base"
                    >
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        Become a Seller
                    </button>
                </div>

                {/* Sign Out Action */}
                <div className="px-2">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/15 hover:scale-[1.01] hover:shadow-primary/25 active:scale-95 duration-150 transition-all cursor-pointer text-base"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                    <p className="text-[10px] text-center text-on-surface-variant/75 font-medium mt-3">
                        Zigsy prototype build v3.0 • Secure Session
                    </p>
                </div>
            </main>
        </div>

        <ConfirmModal
            open={showSignOutConfirm}
            title="Sign Out"
            message="Are you sure you want to sign out? You will need to sign in again to access your account."
            confirmLabel="Sign Out"
            cancelLabel="Cancel"
            destructive
            onConfirm={() => { setShowSignOutConfirm(false); onReset(); }}
            onCancel={() => setShowSignOutConfirm(false)}
        />
        </>
    );
}