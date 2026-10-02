import React from 'react';
import { useProfile } from './components/ProfileContext';
import { FileText, Calendar } from 'lucide-react';

export default function TermsConditions() {
    const { goBack } = useProfile();

    const sections = [
        {
            title: "1. Eligibility",
            points: [
                "You must be at least 18 years old or have legal permission to use Zigsy.",
                "Certain features may require verification as a college student.",
                "Users are responsible for providing accurate information during registration."
            ]
        },
        {
            title: "2. Account Responsibility",
            points: [
                "Keep your account credentials secure.",
                "Do not share your account with others.",
                "You are responsible for all activities performed using your account.",
                "Zigsy may suspend accounts involved in fraudulent or suspicious activities."
            ]
        },
        {
            title: "3. Listing Outfits",
            points: [
                "You are the rightful owner of the item.",
                "Photos accurately represent the outfit.",
                "Product descriptions are truthful.",
                "Counterfeit or prohibited items are not allowed.",
                "Zigsy may remove listings that violate community standards."
            ]
        },
        {
            title: "4. Security Deposit",
            points: [
                "Security Deposits are automatically calculated by Zigsy.",
                "Users cannot modify or negotiate the deposit amount.",
                "Deposits are refundable after the item is returned and passes inspection.",
                "Zigsy reserves the right to deduct applicable charges for verified damages or policy violations."
            ]
        },
        {
            title: "5. Rental Process",
            points: [
                "Return outfits on or before the agreed return date.",
                "Use rented items responsibly.",
                "Avoid altering, damaging, or reselling rented items.",
                "Report any issues immediately through the Zigsy platform."
            ]
        },
        {
            title: "6. High-Value Outfit Verification",
            intro: "Certain premium outfits may require additional identity verification before booking. Verification may include:",
            points: [
                "Government-issued ID",
                "Selfie verification",
                "College ID verification",
                "College details",
                "Residential address"
            ],
            outro: "Verification is required only for selected high-value rentals to improve marketplace security."
        },
        {
            title: "7. Cancellations",
            points: [
                "Users may cancel bookings within the permitted cancellation period.",
                "Refund eligibility depends on the booking status and cancellation timing.",
                "Repeated cancellations may affect account standing."
            ]
        },
        {
            title: "8. Late Returns",
            intro: "Late returns may result in:",
            points: [
                "Additional rental charges",
                "Temporary account restrictions",
                "Reduced trust score",
                "Suspension for repeated violations"
            ]
        },
        {
            title: "9. Damage & Loss",
            intro: "Renters are responsible for returning items in substantially the same condition as received. If an item is damaged or lost:",
            points: [
                "Zigsy may investigate the incident.",
                "Repair or replacement costs may be deducted from the security deposit where appropriate.",
                "Additional charges may apply if damages exceed the deposit amount, subject to review."
            ]
        },
        {
            title: "10. Payments",
            points: [
                "All payments should be completed through Zigsy.",
                "Users should never make payments outside the platform unless explicitly instructed by Zigsy."
            ]
        },
        {
            title: "11. Community Standards",
            intro: "Users must:",
            points: [
                "Treat others respectfully.",
                "Use appropriate language.",
                "Avoid harassment or discrimination.",
                "Upload genuine listings.",
                "Respect college community guidelines."
            ]
        },
        {
            title: "12. Prohibited Activities",
            intro: "The following are strictly prohibited:",
            points: [
                "Fake listings",
                "Fraudulent transactions",
                "Counterfeit products",
                "Selling or renting prohibited items",
                "Impersonating another person",
                "Misusing the platform",
                "Attempting to bypass Zigsy policies"
            ],
            outro: "Violation may result in permanent account suspension."
        },
        {
            title: "13. Intellectual Property",
            points: [
                "All Zigsy logos, branding, designs, and platform content are the property of Zigsy unless otherwise stated.",
                "Users may not copy, reproduce, or distribute Zigsy content without permission."
            ]
        },
        {
            title: "14. Privacy",
            points: [
                "Your personal information is handled in accordance with the Zigsy Privacy Policy.",
                "Verification documents are collected only when required and are protected using appropriate security measures."
            ]
        },
        {
            title: "15. Limitation of Liability",
            points: [
                "Zigsy provides a platform that connects renters and listers.",
                "While Zigsy works to create a safe marketplace, users remain responsible for their own conduct and for complying with applicable laws and platform policies."
            ]
        },
        {
            title: "16. Changes to These Terms",
            points: [
                "Zigsy may update these Terms & Conditions from time to time.",
                "Continued use of the platform after updates constitutes acceptance of the revised Terms."
            ]
        },
        {
            title: "17. Contact Us",
            points: [
                "For questions, support, or dispute resolution, contact the Zigsy Support Team through the Help & Support section of the application."
            ]
        }
    ];

    return (
        <div id="terms-conditions-screen" className="pb-20 max-w-lg mx-auto bg-surface-bg text-text-primary">
            {/* Top Badge Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand-cherry shrink-0">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-text-primary">Terms & Conditions</h2>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last Updated: July 2026</span>
                    </div>
                </div>
            </div>

            {/* Intro text */}
            <p className="text-sm text-text-secondary leading-relaxed mb-6 px-1">
                Welcome to <strong>Zigsy</strong>, India's student fashion rental marketplace. By creating an account, listing an outfit, renting an item, or using any Zigsy service, you agree to the following Terms & Conditions.
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
                <h4 className="text-xs font-black text-[#980900] uppercase tracking-wider mb-2">Thank You</h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                    By using Zigsy, you're helping build a trusted, sustainable, and student-first fashion community. Thank you for being part of the Zigsy marketplace.
                </p>
            </div>
        </div>
    );
}
