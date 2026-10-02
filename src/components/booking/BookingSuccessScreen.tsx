import React from 'react';
import { useBooking } from './BookingContext';
import { ActiveScreen } from '../../types';
import { CheckCircle2, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

interface BookingSuccessScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
}

export default function BookingSuccessScreen({ onNavigate }: BookingSuccessScreenProps) {
    const { selectedOrder } = useBooking();

    if (!selectedOrder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No active booking found.</p>
            </div>
        );
    }

    return (
        <div className="bg-surface min-h-screen text-on-surface flex flex-col justify-between pb-10">
            {/* Header placeholder */}
            <div className="h-16"></div>

            <main className="max-w-md mx-auto px-6 flex-grow flex flex-col justify-center items-center text-center">
                {/* Celebratory Checkmark */}
                <div className="relative w-24 h-24 mb-6 flex items-center justify-center text-green-600 bg-green-50 rounded-full border-2 border-green-100 shadow-inner animate-scale-up">
                    <CheckCircle2 className="w-14 h-14" />
                </div>

                <h2 className="text-2xl font-black tracking-tight text-on-surface">Booking Confirmed!</h2>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Thank you for renting with Zigsy</p>

                <p className="text-xs text-on-surface-variant leading-relaxed mt-4 max-w-[280px]">
                    Your request has been sent to <span className="font-bold text-primary">{selectedOrder.outfit.sellerName}</span>. We will notify you once the shipment begins.
                </p>

                {/* Details Invoice Card */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm mt-8 w-full text-left space-y-4 animate-slide-up">
                    <div className="flex justify-between items-center pb-3 border-b border-surface-container">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Booking Reference</span>
                        <span className="font-extrabold text-xs text-primary">{selectedOrder.id}</span>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-15 rounded-xl overflow-hidden shrink-0 border border-surface-container">
                            <img
                                src={selectedOrder.outfit.image}
                                alt={selectedOrder.outfit.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-xs text-on-surface line-clamp-1">{selectedOrder.outfit.name}</h4>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{selectedOrder.outfit.brand}</p>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-surface-container">
                        <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Duration:</span>
                            <span className="text-on-surface">{selectedOrder.rentalDays} days</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
                            <span>Rental Dates:</span>
                            <span className="text-on-surface">{selectedOrder.startDate} to {selectedOrder.endDate}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold">
                            <span>Refundable Deposit:</span>
                            <span className="text-on-surface">₹{selectedOrder.securityDeposit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-on-surface font-black pt-1.5 border-t border-surface-container-low">
                            <span>Amount Charged:</span>
                            <span className="text-primary text-sm">₹{selectedOrder.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                {/* Info Note */}
                <div className="flex items-start gap-2 bg-surface-container-low p-3.5 rounded-2xl border border-surface-container text-left mt-6 w-full">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-on-surface-variant font-semibold">
                        Your security deposit is safely escrowed and will be fully returned to your original payment method once the outfit is returned in good condition.
                    </p>
                </div>
            </main>

            {/* Sticky Action Footer */}
            <div className="px-6 w-full max-w-md mx-auto space-y-3">
                <button
                    onClick={() => onNavigate('my-orders')}
                    className="w-full py-4.5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all active:scale-[0.99] duration-150 cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>View Booking Status</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                    onClick={() => onNavigate('home')}
                    className="w-full py-4 border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl font-bold text-xs transition-all active:scale-95 duration-150 cursor-pointer flex items-center justify-center"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}
