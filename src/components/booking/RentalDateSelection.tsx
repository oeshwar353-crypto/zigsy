import React, { useState } from 'react';
import { useBooking } from './BookingContext';
import { ActiveScreen } from '../../types';
import Calendar from './Calendar';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';

interface RentalDateSelectionProps {
    onNavigate: (screen: ActiveScreen) => void;
}

export default function RentalDateSelection({ onNavigate }: RentalDateSelectionProps) {
    const { currentRentalOutfit, setRentalDates } = useBooking();
    const [dates, setDates] = useState<{ start: string; end: string; days: number } | null>(null);
    
    // Track if rules are checked
    const [rulesAccepted, setRulesAccepted] = useState<Record<number, boolean>>({});

    if (!currentRentalOutfit) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No outfit selected for rental.</p>
            </div>
        );
    }

    const rules = currentRentalOutfit.rules || [
        'Handle with clean hands and hang properly',
        'Store in the provided dust bag when not in use',
        'No exposure to strong perfumes or body oils',
        'Strictly no alterations or pins allowed'
    ];

    const handleDateSelect = (startDate: string, endDate: string, totalDays: number) => {
        setDates({ start: startDate, end: endDate, days: totalDays });
    };

    const handleToggleRule = (idx: number) => {
        setRulesAccepted(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const allRulesChecked = rules.every((_, idx) => rulesAccepted[idx]);
    const canProceed = dates !== null && allRulesChecked;

    const handleProceed = () => {
        if (canProceed && dates) {
            setRentalDates(dates.start, dates.end, dates.days);
            onNavigate('checkout');
        }
    };

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-container h-16 flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <button
                    onClick={() => onNavigate('details')}
                    className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-sans font-extrabold text-xl tracking-tight text-on-surface">
                    Date Selection
                </h1>
                <div className="w-10"></div> {/* Spacer for symmetry */}
            </header>

            <main className="max-w-md mx-auto pt-24 px-4">
                {/* Outfit Info Snippet */}
                <section className="bg-white rounded-3xl p-4 border border-surface-container shadow-sm flex gap-4 mb-6">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-surface-container">
                        <img
                            src={currentRentalOutfit.image}
                            alt={currentRentalOutfit.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                        <div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{currentRentalOutfit.brand}</p>
                            <h3 className="font-bold text-sm text-on-surface line-clamp-1 mt-0.5">{currentRentalOutfit.name}</h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="font-extrabold text-base text-primary">₹{currentRentalOutfit.pricePerDay}</span>
                            <span className="text-[10px] text-on-surface-variant">/ day</span>
                        </div>
                    </div>
                </section>

                {/* Calendar Date Picker */}
                <section className="mb-6">
                    <Calendar
                        pricePerDay={currentRentalOutfit.pricePerDay}
                        currency="₹"
                        onDateSelect={handleDateSelect}
                    />
                </section>

                {/* Rental Guidelines Checkbox Card */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-primary fill-primary/10" />
                        <h4 className="font-extrabold text-xs tracking-wider text-on-surface uppercase">Rental Care Guidelines</h4>
                    </div>
                    
                    <p className="text-[10px] text-on-surface-variant leading-relaxed mb-4">
                        To maintain standard boutique quality, you must accept these owner rules before booking this outfit.
                    </p>

                    <div className="space-y-3">
                        {rules.map((rule, idx) => {
                            const isChecked = !!rulesAccepted[idx];
                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleToggleRule(idx)}
                                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all duration-150 ${
                                        isChecked 
                                            ? 'bg-primary/5 border-primary/20' 
                                            : 'bg-surface-container-low border-surface-container hover:bg-surface-container-high'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                                        isChecked 
                                            ? 'bg-primary border-primary text-white shadow-sm shadow-primary/20' 
                                            : 'border-surface-container-highest bg-white'
                                    }`}>
                                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                    <span className={`text-[11px] leading-relaxed font-semibold transition-colors ${isChecked ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                        {rule}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-surface-container py-4 px-4 z-40">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handleProceed}
                            disabled={!canProceed}
                            className={`w-full py-4.5 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.99] duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                                canProceed
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-primary/25 hover:shadow-primary/35'
                                    : 'bg-surface-container-highest text-on-surface-variant/40 shadow-none cursor-not-allowed'
                            }`}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
