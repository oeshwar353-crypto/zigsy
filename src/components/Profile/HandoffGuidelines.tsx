import React from 'react';
import { useProfile } from './components/ProfileContext';
import { HeartHandshake, Calendar } from 'lucide-react';

export default function HandoffGuidelines() {
    const { goBack } = useProfile();

    const sections = [
        {
            title: "1. Choose Safe Hand-off Locations",
            intro: "For every rental, meet in safe and public locations whenever possible. Recommended locations include:",
            points: [
                "College campus common areas",
                "University gates",
                "Student activity centers",
                "Cafeterias",
                "Library entrances",
                "Other well-lit public spaces"
            ],
            outro: "Avoid isolated or unsafe locations."
        },
        {
            title: "2. Verify Before Hand-off",
            intro: "Before exchanging an outfit:",
            points: [
                "Confirm the booking inside the Zigsy app.",
                "Verify the renter's or lister's profile.",
                "Ensure the booking status is active.",
                "Match the outfit with the listing photos."
            ],
            outro: "Never exchange items outside an active Zigsy booking."
        },
        {
            title: "3. Inspect the Outfit",
            intro: "Before accepting an outfit:",
            points: [
                "Check for stains or damage.",
                "Verify the correct size and color.",
                "Ensure all accessories included in the listing are present.",
                "Take a quick look at the overall condition."
            ],
            outro: "Report any issues immediately through Zigsy Support before completing the hand-off."
        },
        {
            title: "4. Handle Outfits with Care",
            intro: "Every rental helps reduce fashion waste. Please:",
            points: [
                "Avoid unnecessary wear or damage.",
                "Keep outfits away from food spills, harsh chemicals, and sharp objects.",
                "Store clothing properly when not in use.",
                "Follow any care instructions provided by the owner."
            ],
            outro: "Treat every outfit as if it were your own."
        },
        {
            title: "5. Return Items Clean",
            intro: "Unless otherwise agreed between both parties:",
            points: [
                "Return outfits in a clean and presentable condition.",
                "Remove personal belongings from pockets.",
                "Fold or package the outfit neatly.",
                "Return any accessories included with the rental."
            ],
            outro: "Good care helps extend the life of every garment."
        },
        {
            title: "6. Return on Time",
            intro: "Respect the agreed return date. Late returns may:",
            points: [
                "Delay future bookings.",
                "Affect your reputation within the Zigsy community.",
                "Result in additional charges according to Zigsy policies."
            ]
        },
        {
            title: "7. Reduce Environmental Impact",
            intro: "Support sustainable fashion by:",
            points: [
                "Renting instead of buying for one-time occasions.",
                "Reusing quality clothing.",
                "Extending the life of garments.",
                "Avoiding unnecessary textile waste.",
                "Choosing responsible fashion habits."
            ],
            outro: "Every rental contributes to a more sustainable future."
        },
        {
            title: "8. Report Problems Immediately",
            intro: "If an outfit is damaged, lost, incorrect, missing accessories, or returned in poor condition:",
            points: [
                "Contact Zigsy Support as soon as possible through the app."
            ],
            outro: "Prompt reporting helps resolve issues fairly for both parties."
        },
        {
            title: "9. Respect Community Safety",
            intro: "For everyone's protection:",
            points: [
                "Never exchange items outside the Zigsy platform.",
                "Do not share OTPs or account credentials.",
                "Avoid accepting unofficial payment requests.",
                "Follow all applicable campus policies during hand-offs."
            ],
            outro: "If you ever feel unsafe, leave the location and contact Zigsy Support."
        },
        {
            title: "10. Together for Sustainable Fashion",
            intro: "Every successful rental helps:",
            points: [
                "Reduce clothing waste",
                "Lower environmental impact",
                "Save money for students",
                "Promote responsible fashion",
                "Build a trusted student community"
            ]
        }
    ];

    return (
        <div id="handoff-guidelines-screen" className="pb-20 max-w-lg mx-auto bg-surface-bg text-text-primary">
            {/* Top Badge Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand-cherry shrink-0">
                    <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-text-primary">Eco-Friendly Hand-off Safety Guidelines</h2>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last Updated: July 2026</span>
                    </div>
                </div>
            </div>

            {/* Intro text */}
            <p className="text-sm text-text-secondary leading-relaxed mb-6 px-1">
                At Zigsy, every rental is more than a fashion choice—it's a step toward reducing textile waste and building a trusted student community. These guidelines help ensure every outfit exchange is safe, responsible, and environmentally friendly.
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
                <h4 className="text-xs font-black text-[#980900] uppercase tracking-wider mb-2">Together for Sustainable Fashion</h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                    Thank you for making Zigsy a safer, greener, and more sustainable marketplace for everyone.
                </p>
            </div>
        </div>
    );
}
