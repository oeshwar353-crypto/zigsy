import React, { useState } from 'react';
import { useBooking } from './BookingContext';
import { ActiveScreen } from '../../types';
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

interface OrderCancellationScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
}

export default function OrderCancellationScreen({ onNavigate }: OrderCancellationScreenProps) {
    const { selectedOrder, cancelOrder } = useBooking();
    const [selectedReason, setSelectedReason] = useState<string>('Change of plans');
    const [isSuccess, setIsSuccess] = useState(false);

    if (!selectedOrder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No order selected for cancellation.</p>
            </div>
        );
    }

    const reasons = [
        'Change of plans',
        'Incorrect dates selected',
        'Found a cheaper alternative',
        'Owner communication issues',
        'Shipping address errors'
    ];

    // Compute Refund: 100% refund of total amount since booking is 'upcoming'
    const refundAmount = selectedOrder.amount;

    const handleConfirmCancellation = () => {
        setIsSuccess(true);
        setTimeout(() => {
            cancelOrder(selectedOrder.id, selectedReason, refundAmount);
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
                    Cancel Booking
                </h1>
                <div className="w-10"></div>
            </header>

            {/* Success Overlay Dialog */}
            {isSuccess && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center border border-surface-container flex flex-col items-center animate-scale-up">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 border-2 border-red-100">
                            <CheckCircle2 className="w-10 h-10 animate-bounce" />
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">Booking Cancelled!</h3>
                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                            Your booking has been cancelled successfully. A full refund of <span className="font-bold text-primary">₹{refundAmount}</span> has been processed.
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
                            Reference ID: <span className="font-semibold text-on-surface">{selectedOrder.id}</span>
                        </p>
                    </div>
                </section>

                {/* Reason Selection Radio Group */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase mb-4">Reason for Cancellation</h3>
                    <div className="space-y-3">
                        {reasons.map((reason, idx) => {
                            const isSelected = selectedReason === reason;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedReason(reason)}
                                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                        isSelected 
                                            ? 'bg-primary/5 border-primary text-primary' 
                                            : 'bg-surface-container-low border-surface-container text-on-surface-variant hover:bg-surface-container'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                        isSelected ? 'border-primary' : 'border-surface-container-highest bg-white'
                                    }`}>
                                        {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                    </div>
                                    <span className="text-xs font-semibold leading-relaxed">
                                        {reason}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Refund breakdown Summary */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm space-y-4">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase pb-3 border-b border-surface-container">Refund Summary</h3>
                    
                    <div className="space-y-2 text-xs font-semibold text-on-surface-variant">
                        <div className="flex justify-between">
                            <span>Amount Charged:</span>
                            <span className="text-on-surface font-bold">₹{selectedOrder.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Cancellation Penalty (0%):</span>
                            <span className="text-green-600 font-bold">-₹0</span>
                        </div>
                        <div className="flex justify-between text-xs text-on-surface font-black pt-3 border-t border-surface-container">
                            <span>Total Refund Credited:</span>
                            <span className="text-primary text-base">₹{refundAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                {/* Warning note */}
                <div className="flex items-start gap-2 bg-red-50 p-4 rounded-2xl border border-red-100 text-left">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-red-700 font-semibold">
                        Confirming cancellation will release this outfit back to open availability on the dates selected. Refund processes may take 2-3 business days to credit back to your card.
                    </p>
                </div>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-surface-container py-4 px-4 z-40">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handleConfirmCancellation}
                            className="w-full py-4.5 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-600/25 hover:shadow-red-600/35 transition-all active:scale-[0.99] duration-150 cursor-pointer flex items-center justify-center gap-2"
                        >
                            Confirm Cancellation
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
