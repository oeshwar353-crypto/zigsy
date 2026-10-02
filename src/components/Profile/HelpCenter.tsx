import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, AlertTriangle, FileText, Lock, Users, ShieldAlert, HeartHandshake } from 'lucide-react';
import { useProfile } from './components/ProfileContext';

export default function HelpCenter() {
    const { setScreen } = useProfile();
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

    const faqs = [
        {
            category: 'Sizing',
            question: 'How do I ensure the outfit will fit me?',
            answer: 'Each seller lists precise measurements (chest, waist, length) along with the size in their description. We recommend chatting directly with the seller to ask about fit, fabric stretch, or to see photos of the item worn.'
        },
        {
            category: 'Delivery',
            question: 'How do campus hand-offs work?',
            answer: 'Zigsy is built entirely on student-to-student hand-offs. Once your rental booking is confirmed, you and the seller can message each other directly via our secure chat to coordinate a safe, convenient meeting spot on campus (e.g., student center, library, hostel lobby).'
        },
        {
            category: 'Damage',
            question: 'What happens if I accidentally stain or damage a garment?',
            answer: 'Don\'t worry! Our standard rentals include Zigsy Safeguard Coverage, which covers minor, treatable stains or loose threads. For major, irreversible structural damage, please report it to our Support Team immediately so we can evaluate the repairs with our campus tailoring network.'
        },
        {
            category: 'Refunds',
            question: 'What is your refund policy if the dress does not fit?',
            answer: 'If you meet up with the seller and find that the outfit does not fit, you can cancel the handover immediately in the app before taking possession of the item. You will be issued a full refund minus a small platform processing fee.'
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSupportContact = () => {
        const to = "zigsy.in@gmail.com";
        const subject = "Zigsy Support Request";
        const body = `Hello Zigsy Support Team,\n\nI'm facing an issue with:\n\n[ ] Booking\n[ ] Listing\n[ ] Payment\n[ ] Verification\n[ ] Account\n[ ] Other\n\nDescription:\n\n\n\n\n\n\nDevice:\nApp Version:\n\nThank you.`;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleBugReport = () => {
        const to = "zigsy.in@gmail.com";
        const subject = "Bug Report - Zigsy";
        const body = `Bug Title:\n\nDescription:\n\nSteps to Reproduce:\n\n1.\n2.\n3.\n\nExpected Result:\n\nActual Result:\n\nDevice:\n\nOS Version:\n\nApp Version:\n\nScreenshots:\n(Please attach if possible)\n\nThank you!`;
        window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div id="help-center-screen" className="pb-20 max-w-lg mx-auto space-y-6 animate-fade-in">
            {/* Title greeting */}
            <div className="text-center">
                <h2 className="text-2xl font-extrabold tracking-tight text-text-primary">How can we help?</h2>
                <p className="text-xs text-text-secondary mt-1">Search our articles or contact our student help team 24/7</p>
            </div>

            {/* Dynamic Search Bar */}
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center px-4 py-3 focus-within:border-brand-cherry focus-within:ring-1 focus-within:ring-brand-cherry transition-all">
                <Search className="w-5 h-5 text-text-secondary mr-3" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for questions about rental, payments..."
                    className="w-full bg-transparent border-none text-xs text-text-primary focus:outline-none placeholder:text-text-secondary/50 font-medium"
                />
            </div>

            {/* Collapsible FAQs */}
            <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary px-1">
                    Frequently Asked Questions
                </h3>

                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, idx) => (
                            <div key={idx} className="p-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                                    className="w-full flex items-center justify-between text-left font-bold text-sm text-text-primary cursor-pointer"
                                >
                                    <span>{faq.question}</span>
                                    {openFaqIdx === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {openFaqIdx === idx && (
                                    <p className="text-xs text-text-secondary leading-relaxed mt-2.5 pt-2 border-t border-gray-50">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-xs text-text-secondary text-center">No results found for "{searchQuery}". Try searching "hand-off", "fit" or "damage".</p>
                    )}
                </div>
            </section>

            {/* Action Support Portal Banner */}
            <section className="bg-brand-cherry p-5 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="font-extrabold text-base">Still need help?</h4>
                    <p className="text-[11px] text-white/80 mt-1">Our college support team is active for hand-off mediation.</p>
                </div>

                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={handleSupportContact}
                        className="px-4 py-2 bg-white text-brand-cherry rounded-xl font-bold text-xs tracking-wider uppercase shadow-sm cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        Contact Support
                    </button>
                    <button
                        onClick={handleBugReport}
                        className="px-4 py-2 bg-brand-dark text-white rounded-xl font-bold text-xs tracking-wider uppercase border border-white/10 cursor-pointer hover:bg-brand-cherry active:scale-95 transition-all"
                    >
                        Report Bug
                    </button>
                </div>
            </section>

            {/* Safety & Legal Standards Lists */}
            <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary px-1">
                    Trust &amp; Legal Standards
                </h3>

                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setScreen('terms-conditions'); }}
                        className="p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-text-secondary group-hover:text-brand-cherry transition-colors" />
                            <span className="font-bold text-xs text-text-primary">Terms &amp; Conditions</span>
                        </div>
                        <span className="text-[10px] font-bold text-brand-cherry uppercase tracking-wider group-hover:underline">Read</span>
                    </a>

                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setScreen('privacy-policy'); }}
                        className="p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-text-secondary group-hover:text-brand-cherry transition-colors" />
                            <span className="font-bold text-xs text-text-primary">Privacy Policy</span>
                        </div>
                        <span className="text-[10px] font-bold text-brand-cherry uppercase tracking-wider group-hover:underline">Read</span>
                    </a>

                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setScreen('student-guidelines'); }}
                        className="p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-text-secondary group-hover:text-brand-cherry transition-colors" />
                            <span className="font-bold text-xs text-text-primary">Student Community Guidelines</span>
                        </div>
                        <span className="text-[10px] font-bold text-brand-cherry uppercase tracking-wider group-hover:underline">Read</span>
                    </a>

                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setScreen('handoff-guidelines'); }}
                        className="p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <HeartHandshake className="w-5 h-5 text-text-secondary group-hover:text-brand-cherry transition-colors" />
                            <span className="font-bold text-xs text-text-primary">Eco-Friendly Hand-off Safety Guidelines</span>
                        </div>
                        <span className="text-[10px] font-bold text-brand-cherry uppercase tracking-wider group-hover:underline">Read</span>
                    </a>
                </div>
            </section>
        </div>
    );
}
