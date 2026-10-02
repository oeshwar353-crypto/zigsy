import React, { useState, useMemo } from 'react';
import { useBooking } from './BookingContext';
import { ActiveScreen } from '../../types';
import { ArrowLeft, CalendarDays, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface OrderExtensionScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
}

export default function OrderExtensionScreen({ onNavigate }: OrderExtensionScreenProps) {
    const { selectedOrder, extendOrder } = useBooking();
    const [selectedDays, setSelectedDays] = useState<number>(1);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!selectedOrder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No order selected for extension.</p>
            </div>
        );
    }

    const pricePerDay = selectedOrder.outfit.pricePerDay;
    const additionalCost = selectedDays * pricePerDay;

    const computeNewReturnDate = (currentEndDate: string, extraDays: number): string => {
        try {
            const dateObj = new Date(currentEndDate);
            // In JavaScript, Date parsing can sometimes have timezone offsets, but adding days works fine.
            dateObj.setDate(dateObj.getDate() + extraDays);
            return dateObj.toISOString().split('T')[0];
        } catch (e) {
            return currentEndDate;
        }
    };

    const newReturnDate = useMemo(() => {
        return computeNewReturnDate(selectedOrder.endDate, selectedDays);
    }, [selectedOrder.endDate, selectedDays]);

    const handleConfirmExtension = () => {
        setIsSuccess(true);
        setTimeout(() => {
            extendOrder(selectedOrder.id, selectedDays, additionalCost, newReturnDate);
            setIsSuccess(false);
            onNavigate('order-details');
        }, 1500);
    };

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-container h-16 flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <button
                    onClick={() => onNavigate('order-details')}
                    disabled={isSuccess}
                    className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-sans font-extrabold text-xl tracking-tight text-on-surface">
                    Extend Rental
                </h1>
                <div className="w-10"></div>
            </header>

            {/* Success Overlay Dialog */}
            {isSuccess && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center border border-surface-container flex flex-col items-center animate-scale-up">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 border-2 border-green-100">
                            <CheckCircle2 className="w-10 h-10 animate-bounce" />
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">Extension Confirmed!</h3>
                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                            We have charged ₹{additionalCost} to your card on file. Your new return date is updated to <span className="font-bold text-primary">{newReturnDate}</span>.
                        </p>
                    </div>
                </div>
            )}

            <main className="max-w-md mx-auto pt-24 px-4 space-y-6">
                {/* Outfit Info Summary */}
                <section className="bg-white rounded-3xl p-4 border border-surface-container shadow-sm flex gap-4">
                    <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-surface-container">
                        <img
                            src={selectedOrder.outfit.image}
                            alt={selectedOrder.outfit.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h4 className="font-extrabold text-xs text-on-surface line-clamp-1">{selectedOrder.outfit.name}</h4>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{selectedOrder.outfit.brand}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                            Current Return Date: <span className="font-semibold text-on-surface">{selectedOrder.endDate}</span>
                        </p>
                    </div>
                </section>

                {/* Days Selector Options */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase mb-4">Select Extension Days</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 5].map((day) => {
                            const isSelected = selectedDays === day;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDays(day)}
                                    className={`py-3.5 px-2 rounded-2xl border font-bold text-xs transition-all cursor-pointer ${
                                        isSelected 
                                            ? 'bg-primary/5 border-primary text-primary scale-105' 
                                            : 'bg-surface-container-low border-surface-container text-on-surface-variant hover:bg-surface-container'
                                    }`}
                                >
                                    +{day} {day === 1 ? 'day' : 'days'}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Date Extension Calculation Details */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm space-y-4">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase pb-3 border-b border-surface-container">Dates & Cost Breakdown</h3>
                    
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-on-surface-variant">Current Return Date:</span>
                        <span className="font-bold text-on-surface">{selectedOrder.endDate}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-on-surface-variant flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                            New Return Date:
                        </span>
                        <span className="font-bold text-primary">{newReturnDate}</span>
                    </div>

                    <div className="border-t border-surface-container pt-3.5 space-y-2.5">
                        <div className="flex justify-between text-xs text-on-surface-variant font-semibold">
                            <span>Extension Rate ({selectedDays} days × ₹{pricePerDay}):</span>
                            <span className="text-on-surface">₹{additionalCost}</span>
                        </div>
                        <div className="flex justify-between text-xs text-on-surface font-black pt-2 border-t border-surface-container-low">
                            <span>Extension Fee Charged:</span>
                            <span className="text-primary text-sm">₹{additionalCost}</span>
                        </div>
                    </div>
                </section>

                {/* Note Banner */}
                <div className="flex items-start gap-2 bg-surface-container-low p-4 rounded-2xl border border-surface-container text-left">
                    <AlertCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-on-surface-variant font-semibold">
                        Once confirmed, extensions are immediately charged and final. Please verify that the seller ({selectedOrder.outfit.sellerName}) does not have blocked dates overlapping this extension.
                    </p>
                </div>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-surface-container py-4 px-4 z-40">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handleConfirmExtension}
                            className="w-full py-4.5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all active:scale-[0.99] duration-150 cursor-pointer flex items-center justify-center gap-2"
                        >
                            Confirm & Pay ₹{additionalCost}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
