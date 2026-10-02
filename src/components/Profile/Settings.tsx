/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProfile } from './components/ProfileContext';
import { Bell, Globe, Sun, Lock, ShieldAlert, Info, LogOut, ChevronRight, User } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function Settings() {
    const { profile, onSignOut, setScreen } = useProfile();

    // Settings Preference States
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [appearanceLightMode, setAppearanceLightMode] = useState(true);
    const [language, setLanguage] = useState('English (US)');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLanguageChange = () => {
        // Language selection is a prototype stub
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirmed = () => {
        setShowLogoutConfirm(false);
        if (onSignOut) onSignOut();
    };

    const handleGenericAlert = (_title: string) => {
        // Prototype stub — no browser alert
    };

    return (
        <div id="settings-screen" className="pb-20 max-w-lg mx-auto space-y-6 animate-fade-in">
            {/* User profile quick info card */}
            <section className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-cherry/20 shrink-0 bg-neutral-100 flex items-center justify-center">
                    {profile.profilePhoto ? (
                        <img
                            src={profile.profilePhoto}
                            alt={profile.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-6 h-6 text-neutral-400" />
                    )}
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-sm text-text-primary truncate">{profile.fullName}</h3>
                    <p className="text-xs text-text-secondary truncate">{profile.email}</p>
                </div>
            </section>

            {/* Preferences Section */}
            <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary px-1">
                    Preferences
                </h3>

                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="text-brand-cherry">
                                <Bell className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs text-text-primary">Push Notifications</span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cherry"></div>
                        </label>
                    </div>

                    {/* Language Selection */}
                    <div
                        onClick={handleLanguageChange}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-brand-cherry">
                                <Globe className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs text-text-primary">App Language</span>
                        </div>

                        <div className="flex items-center gap-1 text-text-secondary">
                            <span className="text-xs font-bold">{language}</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Appearance Toggle */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="text-brand-cherry">
                                <Sun className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs text-text-primary">Appearance (Light Mode)</span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={appearanceLightMode}
                                 onChange={(e) => {
                                    setAppearanceLightMode(e.target.checked);
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cherry"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Security & Privacy */}
            <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary px-1">
                    Security &amp; Privacy
                </h3>

                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
                    <div
                        onClick={() => setScreen('account-privacy')}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-brand-cherry">
                                <Lock className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs text-text-primary">Account Privacy</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div
                        onClick={() => setScreen('account-security')}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-brand-cherry">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs text-text-primary">Account Security &amp; 2FA</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </section>

            {/* Corporate Info */}
            <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary px-1">
                    Support Info
                </h3>

                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
                    <div
                        onClick={() => setScreen('about-zigsy')}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-brand-cherry">
                                <Info className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs text-text-primary">About Zigsy</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </section>

            {/* Logout Trigger button */}
            <section className="pt-2">
                <button
                    onClick={handleLogout}
                    className="w-full bg-white hover:bg-red-50 border border-red-200 text-red-600 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-xs"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>

                <p className="text-center text-[10px] text-text-secondary/50 font-semibold tracking-wider mt-4 uppercase">
                    Zigsy v2.4.0 • Academic Build
                </p>
            </section>

            <ConfirmModal
                open={showLogoutConfirm}
                title="Log Out"
                message="Are you sure you want to log out of Zigsy?"
                confirmLabel="Log Out"
                cancelLabel="Cancel"
                destructive
                onConfirm={handleLogoutConfirmed}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </div>
    );
}
