import React, { useState } from 'react';
import { useProfile } from './components/ProfileContext';
import { ShieldAlert, Mail, Key, Shield, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AccountSecurity() {
    const { goBack } = useProfile();
    const [is2FaEnabled, setIs2FaEnabled] = useState(false);

    const handleToggle2Fa = () => {
        setIs2FaEnabled(prev => !prev);
        alert(is2FaEnabled ? "Two-Factor Authentication (2FA) has been disabled." : "Two-Factor Authentication (2FA) has been enabled for your account!");
    };

    const sections = [
        {
            title: "Account Protection",
            content: "Your Zigsy account is protected using secure authentication and encrypted communication to help prevent unauthorized access."
        },
        {
            title: "Phone Number Verification",
            content: "Your registered mobile number is used to verify your identity during sign-in and important account activities.",
            meta: "Status: ✅ Verified"
        },
        {
            title: "Two-Factor Authentication (2FA)",
            content: "Add an extra layer of security to your account. When enabled, Zigsy will require a one-time verification code during login from a new device.",
            is2fa: true
        },
        {
            title: "Login Activity",
            content: "Review your recent account sign-ins and devices that have accessed your account. You can sign out of any device that you do not recognize."
        },
        {
            title: "Change Password",
            content: "Keep your account secure by updating your password regularly. Choose a strong password containing uppercase letters, lowercase letters, numbers, and special characters."
        },
        {
            title: "Identity Verification",
            content: "Your Government ID, College ID, and Selfie Verification are securely encrypted and used only for identity verification and marketplace safety. These documents are never visible to other users."
        },
        {
            title: "Suspicious Activity",
            intro: "If we detect unusual login attempts or suspicious account activity, Zigsy may:",
            points: [
                "Request additional verification",
                "Temporarily restrict access",
                "Notify you immediately",
                "Protect your account until verification is completed"
            ]
        },
        {
            title: "Security Tips",
            intro: "For the best protection:",
            points: [
                "Never share your OTP or verification codes.",
                "Use a strong, unique password.",
                "Enable Two-Factor Authentication (2FA).",
                "Log out from shared or public devices.",
                "Report suspicious activity immediately."
            ]
        }
    ];

    return (
        <div id="account-security-screen" className="pb-20 max-w-lg mx-auto bg-surface-bg text-text-primary">
            {/* Top Badge Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand-cherry shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-text-primary">Account Security &amp; 2FA</h2>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last Updated: July 2026</span>
                    </div>
                </div>
            </div>

            {/* Intro Header text */}
            <p className="text-sm text-text-secondary leading-relaxed mb-6 px-1 font-semibold">
                Your account security is our priority. Zigsy provides multiple layers of protection to help keep your account, bookings, and personal information safe.
            </p>

            {/* Sections */}
            <div className="space-y-5">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
                        <h3 className="text-sm font-bold text-text-primary border-b border-gray-50 pb-2.5">
                            {section.title}
                        </h3>
                        {section.content && (
                            <p className="text-xs text-text-secondary leading-relaxed">
                                {section.content}
                            </p>
                        )}
                        {section.meta && (
                            <p className="text-xs text-green-700 font-bold bg-green-50 py-1.5 px-3 rounded-xl inline-block mt-1">
                                {section.meta}
                            </p>
                        )}
                        {section.is2fa && (
                            <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl mt-2 border border-neutral-100">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-text-primary">Two-Factor Authentication</p>
                                    <p className="text-[10px] text-text-secondary font-semibold">
                                        Recommendation: Enable 2FA for enhanced account security.
                                    </p>
                                </div>
                                <button
                                    onClick={handleToggle2Fa}
                                    className="text-brand-cherry hover:opacity-90 active:scale-95 transition-all"
                                >
                                    {is2FaEnabled ? (
                                        <ToggleRight className="w-12 h-8 stroke-[1.5]" />
                                    ) : (
                                        <ToggleLeft className="w-12 h-8 text-neutral-400 stroke-[1.5]" />
                                    )}
                                </button>
                            </div>
                        )}
                        {section.intro && (
                            <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                                {section.intro}
                            </p>
                        )}
                        {section.points && (
                            <ul className="list-disc pl-4 space-y-2">
                                {section.points.map((pt, pIdx) => (
                                    <li key={pIdx} className="text-xs text-text-secondary leading-relaxed">
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Support section */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mt-6 space-y-3">
                <h3 className="text-sm font-bold text-text-primary border-b border-gray-50 pb-2.5">
                    Need Help?
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                    If you believe your account has been compromised or you notice unauthorized activity, contact the Zigsy Support Team immediately.
                </p>
                <div className="pt-2">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Support Email:</p>
                    <a
                        href="mailto:zigsy.in@gmail.com"
                        className="text-[#980900] hover:underline font-bold text-sm flex items-center gap-1.5"
                    >
                        <Mail className="w-4 h-4" />
                        <span>zigsy.in@gmail.com</span>
                    </a>
                </div>
            </div>

            {/* Outro / Footer Card */}
            <div className="bg-[#FAF0EE] border border-[#980900]/10 p-5 rounded-3xl mt-6 text-center">
                <h4 className="text-xs font-black text-[#980900] uppercase tracking-wider mb-2">Our Commitment</h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                    Zigsy is committed to protecting your account through modern security practices, encrypted data handling, and continuous monitoring to provide a safe and trusted student marketplace.
                </p>
            </div>
        </div>
    );
}
