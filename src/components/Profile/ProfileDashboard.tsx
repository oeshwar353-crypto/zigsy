/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProfile } from './components/ProfileContext';
import {
    ShieldCheck,
    Star,
    ShoppingBag,
    Heart,
    Settings as SettingsIcon,
    User,
    MapPin,
    CreditCard,
    Coins,
    MessageSquare,
    HelpCircle,
    LogOut,
    ChevronRight,
    TrendingUp,
    Award
} from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function ProfileDashboard() {
    const { profile, setScreen, onSellerDashboard, onSignOut, onNavigate } = useProfile();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    return (
        <div id="profile-dashboard-screen" className="space-y-6 pb-20">
            {/* Premium Header Profile Info */}
            <section className="flex flex-col items-center text-center space-y-4">
                {/* Profile Photo & Student Badge */}
                <div className="relative">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-neutral-100 flex items-center justify-center">
                        {profile.profilePhoto ? (
                            <img
                                src={profile.profilePhoto}
                                alt={profile.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-12 h-12 text-neutral-400" />
                        )}
                    </div>
                    {profile.isVerifiedStudent && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-md border border-gray-100 whitespace-nowrap">
                            <ShieldCheck className="w-4 h-4 text-brand-cherry fill-brand-cherry/15" />
                            <span className="font-sans text-[10px] font-bold tracking-wider text-text-primary uppercase">
                                Verified Student
                            </span>
                        </div>
                    )}
                </div>

                {/* Name & College */}
                <div className="pt-2">
                    <div className="flex items-center justify-center gap-1.5">
                        <h2 className="text-2xl font-bold tracking-tight text-text-primary">{profile.fullName}</h2>
                        {profile.isTrustedMember && (
                            <span title="Trusted Member Badge">
                                <Award className="w-5 h-5 text-brand-cherry" />
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-text-secondary font-medium">{profile.username}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{profile.collegeName}</p>
                </div>

                {/* Edit & Seller Dashboard Trigger Buttons */}
                <div className="flex gap-2.5 w-full max-w-sm pt-2">
                    <button
                        id="edit-profile-btn"
                        onClick={() => setScreen('edit-profile')}
                        className="flex-1 py-3 bg-brand-cherry hover:bg-brand-dark text-white font-semibold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
                    >
                        Edit Profile
                    </button>
                    <button
                        id="seller-dashboard-btn"
                        onClick={onSellerDashboard}
                        className="flex-1 py-3 bg-white border border-brand-cherry text-brand-cherry hover:bg-brand-cherry/5 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all active:scale-95 duration-200 cursor-pointer"
                    >
                        Seller Dashboard
                    </button>
                </div>
            </section>

            {/* Quick Navigation Widgets */}
            <section className="w-full">
                <button
                    id="quick-action-orders"
                    onClick={() => onNavigate('my-orders')}
                    className="w-full bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm text-text-primary">My Rental Bookings</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                </button>
            </section>

            {/* Structured Account Settings List */}
            <section className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-base text-text-primary">Account Settings</h3>
                </div>

                <div className="divide-y divide-gray-100">
                    <button
                        id="nav-saved-addresses"
                        onClick={() => setScreen('saved-addresses')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-text-primary">Saved Addresses</p>
                                <p className="text-[11px] text-text-secondary">Hostel, Home, and more</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        id="nav-payment-methods"
                        onClick={() => setScreen('payment-methods')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-text-primary">Payment Methods</p>
                                <p className="text-[11px] text-text-secondary">Cards, UPI, and Digital Wallets</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        id="nav-payout-methods"
                        onClick={() => setScreen('payout-methods')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry">
                                <Coins className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-text-primary">Payout Methods</p>
                                <p className="text-[11px] text-text-secondary">Direct Bank Deposits & UPI Settings</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        id="nav-reviews"
                        onClick={() => setScreen('reviews')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-text-primary">Reviews</p>
                                <p className="text-[11px] text-text-secondary">Your feedback on rentals &amp; sellers</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        id="nav-help-center"
                        onClick={() => setScreen('help-center')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-text-primary">Help Center</p>
                                <p className="text-[11px] text-text-secondary">FAQs, Support, and Safety tips</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        id="nav-settings"
                        onClick={() => setScreen('settings')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors text-left group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry">
                                <SettingsIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-text-primary">Settings</p>
                                <p className="text-[11px] text-text-secondary">Notifications, language, privacy, and account security</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Log Out */}
            <button
                id="sign-out-btn"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full bg-white hover:bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer"
            >
                <LogOut className="w-5 h-5" />
                <span className="font-bold text-xs tracking-widest uppercase">Sign Out</span>
            </button>

            <ConfirmModal
                open={showLogoutConfirm}
                title="Sign Out"
                message="Are you sure you want to sign out of Zigsy?"
                confirmLabel="Sign Out"
                cancelLabel="Cancel"
                destructive
                onConfirm={() => { setShowLogoutConfirm(false); if (onSignOut) onSignOut(); }}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </div>
    );
}
