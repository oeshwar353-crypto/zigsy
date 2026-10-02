import React from 'react';
import { useProfile } from './components/ProfileContext';
import { Shield, Calendar } from 'lucide-react';

export default function PrivacyPolicy() {
    const { goBack } = useProfile();

    const sections = [
        {
            title: "1. Information We Collect",
            intro: "When you create a Zigsy account, we may collect:",
            points: [
                "Full Name",
                "Email Address",
                "Phone Number",
                "Profile Photo",
                "College Name",
                "Student Verification Details",
                "Residential City",
                "Account Preferences"
            ],
            outro: "For sellers, we may also collect outfit listings, product images, rental information, and pricing details."
        },
        {
            title: "2. Identity Verification",
            intro: "For selected features, such as high-value outfit rentals, Zigsy may request additional verification, including:",
            points: [
                "Government-issued ID",
                "College ID Card",
                "Selfie Verification",
                "Residential Address"
            ],
            outro: "These documents are collected only to improve marketplace security and reduce fraud."
        },
        {
            title: "3. How We Use Your Information",
            intro: "Your information helps us:",
            points: [
                "Create and manage your account",
                "Verify your identity",
                "Process bookings",
                "Display your listings",
                "Improve recommendations",
                "Prevent fraud",
                "Provide customer support",
                "Maintain marketplace safety"
            ],
            outro: "We only use your information for legitimate platform operations."
        },
        {
            title: "4. Payments",
            points: [
                "Payment information is processed through trusted payment partners.",
                "Zigsy does not store your complete debit card, credit card, or banking credentials on its servers."
            ]
        },
        {
            title: "5. Location Information",
            intro: "If you allow location access, Zigsy may use it to:",
            points: [
                "Show nearby listings",
                "Suggest campus pickup locations",
                "Improve delivery and hand-off experiences"
            ],
            outro: "Location access is optional where supported."
        },
        {
            title: "6. Photos & Uploaded Content",
            intro: "When you upload outfit photos, profile pictures, or verification documents:",
            points: [
                "You grant Zigsy permission to display or process that content only as necessary to operate the platform."
            ],
            outro: "Verification documents are never displayed publicly."
        },
        {
            title: "7. Data Security",
            points: [
                "We use reasonable technical and organizational measures to help protect your information from unauthorized access, misuse, or disclosure.",
                "While no online service can guarantee absolute security, Zigsy works to safeguard your personal data."
            ]
        },
        {
            title: "8. Information Sharing",
            intro: "Zigsy does not sell your personal information. We may share limited information only when necessary to:",
            points: [
                "Process payments",
                "Complete bookings",
                "Comply with legal obligations",
                "Investigate fraud or security issues",
                "Provide trusted third-party services that support the platform"
            ]
        },
        {
            title: "9. Your Rights",
            intro: "You can:",
            points: [
                "Update your profile information",
                "Change your password",
                "Delete your listings",
                "Request account deletion",
                "Contact support regarding your personal information"
            ],
            outro: "Some information may be retained where required by law or to resolve disputes."
        },
        {
            title: "10. Cookies & Analytics",
            intro: "Zigsy may use cookies or similar technologies to:",
            points: [
                "Keep you signed in",
                "Remember preferences",
                "Improve app performance",
                "Understand feature usage"
            ]
        },
        {
            title: "11. Children's Privacy",
            points: [
                "Zigsy is intended for eligible users who meet the platform's requirements.",
                "If we become aware that an account has been created in violation of our eligibility requirements, we may suspend or remove it."
            ]
        },
        {
            title: "12. Policy Updates",
            points: [
                "We may update this Privacy Policy from time to time.",
                "Any significant changes will be communicated through the Zigsy app or website."
            ]
        },
        {
            title: "13. Contact Us",
            points: [
                "If you have questions about this Privacy Policy or how your information is handled, please contact the Zigsy Support Team through the Help & Support section of the app."
            ]
        }
    ];

    return (
        <div id="privacy-policy-screen" className="pb-20 max-w-lg mx-auto bg-surface-bg text-text-primary">
            {/* Top Badge Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand-cherry shrink-0">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-text-primary">Privacy Policy</h2>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last Updated: July 2026</span>
                    </div>
                </div>
            </div>

            {/* Intro text */}
            <p className="text-sm text-text-secondary leading-relaxed mb-6 px-1">
                At <strong>Zigsy</strong>, your privacy matters. This Privacy Policy explains what information we collect, how we use it, and how we protect it while providing a safe and trusted student fashion marketplace.
            </p>

            {/* Sections */}
            <div className="space-y-5">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
                        <h3 className="text-sm font-bold text-text-primary border-b border-gray-50 pb-2.5">
                            {section.title}
                        </h3>
                        {section.intro && (
                            <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                                {section.intro}
                            </p>
                        )}
                        <ul className="list-disc pl-4 space-y-2">
                            {section.points.map((pt, pIdx) => (
                                <li key={pIdx} className="text-xs text-text-secondary leading-relaxed">
                                    {pt}
                                </li>
                            ))}
                        </ul>
                        {section.outro && (
                            <p className="text-xs text-text-secondary leading-relaxed font-semibold pt-1">
                                {section.outro}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Outro / Footer Card */}
            <div className="bg-[#FAF0EE] border border-[#980900]/10 p-5 rounded-3xl mt-6 text-center">
                <h4 className="text-xs font-black text-[#980900] uppercase tracking-wider mb-2">Your Privacy Matters</h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                    Zigsy is committed to building a secure, transparent, and trusted student fashion marketplace. We collect only the information needed to provide our services and work to protect your data throughout your experience.
                </p>
            </div>
        </div>
    );
}
