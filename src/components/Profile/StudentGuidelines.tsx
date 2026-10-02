import React from 'react';
import { useProfile } from './components/ProfileContext';
import { Users, Calendar } from 'lucide-react';

export default function StudentGuidelines() {
    const { goBack } = useProfile();

    const sections = [
        {
            title: "1. Be Respectful",
            intro: "Treat every member of the Zigsy community with kindness and respect.",
            points: [
                "Use polite language.",
                "Respect different cultures and backgrounds.",
                "Do not harass, threaten, or intimidate other users.",
                "Avoid offensive, discriminatory, or abusive behavior."
            ]
        },
        {
            title: "2. Create Honest Listings",
            intro: "Only upload outfits that you genuinely own or have permission to rent. Every listing should include:",
            points: [
                "Clear and recent photos",
                "Accurate descriptions",
                "Correct size and condition",
                "Honest pricing"
            ],
            outro: "Do not upload misleading or fake listings."
        },
        {
            title: "3. Respect Rental Commitments",
            intro: "Once a booking is confirmed:",
            points: [
                "Deliver the outfit on time.",
                "Return rented outfits before the agreed return date.",
                "Communicate promptly if any issue arises.",
                "Avoid last-minute cancellations whenever possible."
            ],
            outro: "Reliable users help build a stronger community."
        },
        {
            title: "4. Care for Every Outfit",
            intro: "Treat rented outfits with the same care you would give your own belongings. Please avoid:",
            points: [
                "Permanent alterations",
                "Stains caused by negligence",
                "Intentional damage",
                "Losing accessories that belong with the outfit"
            ],
            outro: "Report accidental damage immediately through Zigsy Support."
        },
        {
            title: "5. Meet Safely",
            intro: "Whenever possible:",
            points: [
                "Meet in well-lit public or campus-approved locations.",
                "Verify the booking inside the Zigsy app before exchanging the outfit.",
                "Never share your account password or OTP.",
                "If something feels unsafe, cancel the hand-off and contact Zigsy Support."
            ]
        },
        {
            title: "6. Keep Conversations Professional",
            intro: "Use Zigsy Chat only for rental-related communication. Do not:",
            points: [
                "Send spam",
                "Share inappropriate content",
                "Use offensive language",
                "Request payments outside Zigsy"
            ],
            outro: "Respect other users' privacy at all times."
        },
        {
            title: "7. Payments Through Zigsy",
            intro: "For your protection:",
            points: [
                "Complete payments only through Zigsy's official payment system.",
                "Never ask or encourage users to pay outside the platform.",
                "Report suspicious payment requests immediately."
            ]
        },
        {
            title: "8. Protect the Community",
            intro: "Help us keep Zigsy safe by reporting:",
            points: [
                "Fake profiles",
                "Fraudulent listings",
                "Counterfeit products",
                "Harassment",
                "Suspicious behavior",
                "Policy violations"
            ],
            outro: "Your reports help protect everyone."
        },
        {
            title: "9. Build Trust",
            intro: "Positive actions help strengthen your reputation. Examples include:",
            points: [
                "Returning outfits on time",
                "Responding quickly to messages",
                "Maintaining accurate listings",
                "Receiving positive reviews",
                "Following community guidelines consistently"
            ]
        },
        {
            title: "10. Consequences of Violations",
            intro: "Users who repeatedly violate these guidelines may face:",
            points: [
                "Listing removal",
                "Temporary feature restrictions",
                "Account suspension",
                "Permanent account termination",
                "Additional action where required under applicable laws"
            ]
        }
    ];

    return (
        <div id="student-guidelines-screen" className="pb-20 max-w-lg mx-auto bg-surface-bg text-text-primary">
            {/* Top Badge Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand-cherry shrink-0">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-text-primary">Student Community Guidelines</h2>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last Updated: July 2026</span>
                    </div>
                </div>
            </div>

            {/* Intro text */}
            <p className="text-sm text-text-secondary leading-relaxed mb-6 px-1">
                Welcome to the Zigsy student community! Our goal is to create a trusted, respectful, and sustainable fashion marketplace where students can rent and share outfits safely. By using Zigsy, you agree to follow these community guidelines.
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
                <h4 className="text-xs font-black text-[#980900] uppercase tracking-wider mb-2">Our Community Promise</h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                    Zigsy is more than a rental marketplace—it's a student community built on trust, respect, and sustainability. Every responsible rental helps reduce fashion waste, supports fellow students, and creates a safer, more connected campus experience.
                </p>
            </div>
        </div>
    );
}
