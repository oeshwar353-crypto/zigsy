import React from 'react';
import { useProfile } from './components/ProfileContext';
import { Info, Mail } from 'lucide-react';

export default function AboutZigsy() {
    const { goBack } = useProfile();

    const sections = [
        {
            title: "Our Story",
            content: "College life is full of events, fests, parties, presentations, and celebrations—but buying a new outfit for every occasion isn't always practical or affordable.\n\nZigsy was created to solve this problem by helping students rent outfits from one another safely and conveniently, giving every garment a second life while helping students save money and earn extra income."
        },
        {
            title: "Our Mission",
            content: "To build India's most trusted student fashion rental community by making renting as easy as buying while promoting sustainability and responsible fashion."
        },
        {
            title: "What You Can Do",
            intro: "With Zigsy, you can:",
            points: [
                "Rent stylish outfits from fellow students.",
                "Earn money by listing your own clothes.",
                "Discover fashion for every occasion.",
                "Connect with verified college students.",
                "Enjoy a secure and trusted rental experience."
            ]
        },
        {
            title: "Our Values",
            intro: "Core pillars we build on:",
            paragraphs: [
                { subtitle: "Trust", text: "Every feature is designed to create a safe and reliable marketplace for students." },
                { subtitle: "Sustainability", text: "By extending the life of clothing, we help reduce textile waste and encourage responsible fashion choices." },
                { subtitle: "Community", text: "Zigsy is built around students helping students through sharing, renting, and supporting one another." },
                { subtitle: "Innovation", text: "We continuously improve our platform to deliver a seamless, secure, and enjoyable rental experience." }
            ]
        },
        {
            title: "Why Zigsy?",
            intro: "Benefits for members:",
            points: [
                "Student-first marketplace",
                "Verified college community",
                "Secure rental process",
                "Fair security deposit system",
                "Sustainable fashion ecosystem",
                "Easy listing and booking experience"
            ]
        },
        {
            title: "Our Vision",
            content: "To become India's leading student fashion marketplace, empowering millions of students to rent, share, and earn while making fashion more sustainable for future generations."
        }
    ];

    return (
        <div id="about-zigsy-screen" className="pb-20 max-w-lg mx-auto bg-surface-bg text-text-primary">
            {/* Top Badge Card */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand-cherry shrink-0 font-black text-xl italic text-[#980900]">
                    Z
                </div>
                <div>
                    <h2 className="text-base font-bold text-text-primary">About Zigsy</h2>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary font-semibold mt-1">
                        <span>Version 1.0.0</span>
                    </div>
                </div>
            </div>

            {/* Intro text */}
            <p className="text-sm text-text-secondary leading-relaxed mb-6 px-1 font-semibold">
                Welcome to <strong>Zigsy</strong> — India's student-first fashion rental marketplace. Our mission is simple: <strong>make fashion more affordable, sustainable, and accessible for every college student.</strong>
            </p>

            {/* Sections */}
            <div className="space-y-5">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
                        <h3 className="text-sm font-bold text-text-primary border-b border-gray-50 pb-2.5">
                            {section.title}
                        </h3>
                        {section.content && (
                            <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                                {section.content}
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
                        {section.paragraphs && (
                            <div className="space-y-3 pt-1">
                                {section.paragraphs.map((p, pIdx) => (
                                    <div key={pIdx} className="space-y-1">
                                        <p className="text-xs font-bold text-text-primary">{p.subtitle}</p>
                                        <p className="text-xs text-text-secondary leading-relaxed">{p.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* App Info Panel */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mt-6 space-y-3">
                <h3 className="text-sm font-bold text-text-primary border-b border-gray-50 pb-2.5">
                    App Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <p className="text-text-secondary font-semibold">Application:</p>
                        <p className="text-text-primary font-bold">Zigsy</p>
                    </div>
                    <div>
                        <p className="text-text-secondary font-semibold">Version:</p>
                        <p className="text-text-primary font-bold">1.0.0</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-text-secondary font-semibold">Platform:</p>
                        <p className="text-text-primary font-bold">Student Fashion Rental Marketplace</p>
                    </div>
                </div>
            </div>

            {/* Contact section */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs mt-6 space-y-3">
                <h3 className="text-sm font-bold text-text-primary border-b border-gray-50 pb-2.5">
                    Contact Us
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                    Have questions, suggestions, or feedback?
                </p>
                <div className="pt-2">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Email:</p>
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
                <h4 className="text-xs font-black text-[#980900] uppercase tracking-wider mb-2">Thank You</h4>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                    Thank you for being part of Zigsy. Every rental, every listing, and every shared outfit helps build a smarter, more affordable, and more sustainable fashion community for students.
                </p>
            </div>
        </div>
    );
}
