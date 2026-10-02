import React from 'react';
import { useProfile } from './components/ProfileContext';
import { Lock, Mail, Calendar } from 'lucide-react';

export default function AccountPrivacy() {
    const { goBack } = useProfile();

    const sections = [
        {
            title: "Profile Visibility",
            content: "Control who can view your profile and public listings.",
            meta: "Current Setting: Verified Students Only"
        },
        {
            title: "Personal Information",
            content: "Your personal information, including your phone number, email address, residential address, and identity verification documents, is kept private and is never shared with other users."
        },
        {
            title: "Identity Verification",
            content: "Verification documents such as your Government ID, College ID, and Selfie Verification are encrypted and securely stored. These documents are used only to verify your identity and maintain a trusted marketplace."
        },
        {
            title: "Listing Privacy",
            content: "Only listings that you publish as Active are visible to other users. Draft and archived listings remain private and are visible only to you."
        },
        {
            title: "Messaging Privacy",
            content: "You will only receive messages related to your listings, rental requests, and confirmed bookings through the Zigsy platform."
        },
        {
            title: "Location Privacy",
            content: "Zigsy only displays general location information, such as your college or city, when necessary. Your precise residential address is never shown publicly."
        },
        {
            title: "Data Security",
            content: "We use industry-standard security practices to help protect your personal information from unauthorized access, misuse, or disclosure."
        },
        {
            title: "Account Control",
            content: "You can update your profile information, manage your privacy preferences, or request account deletion at any time through your account settings."
        },
        {
            title: "Your Rights",
            intro: "You have the right to:",
            points: [
                "Access your personal information",
                "Update inaccurate information",
                "Request account deletion",
                "Contact support regarding your privacy concerns"
            ]
        }
    ];

    return (
        <div id="account-privacy-screen" className="pb-20 max-w-lg mx-auto bg-surface-bg text-text-primary">
            {/* Top Badge Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand-cherry shrink-0">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-text-primary">Account Privacy</h2>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last Updated: July 2026</span>
                    </div>
                </div>
            </div>

            {/* Intro Header text */}
            <p className="text-sm text-text-secondary leading-relaxed mb-6 px-1 font-semibold">
                Your privacy is important to us. Manage how your information is used and how your profile is visible within the Zigsy community.
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
                            <p className="text-xs text-[#980900] font-bold bg-red-50/50 py-1.5 px-3 rounded-xl inline-block mt-1">
                                {section.meta}
                            </p>
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
                    If you have any questions about your privacy or data protection, please contact the Zigsy Support Team.
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
                    At Zigsy, protecting your privacy is a core part of building a trusted student fashion marketplace. We collect only the information necessary to provide our services and work continuously to keep your data secure.
                </p>
            </div>
        </div>
    );
}
