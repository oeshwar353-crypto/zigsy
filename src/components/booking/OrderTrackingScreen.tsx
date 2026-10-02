import React from 'react';
import { useBooking } from './BookingContext';
import { ActiveScreen } from '../../types';
import InteractiveTimeline from './InteractiveTimeline';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface OrderTrackingScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
}

export default function OrderTrackingScreen({ onNavigate }: OrderTrackingScreenProps) {
    const { selectedOrder } = useBooking();

    if (!selectedOrder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No order selected for tracking.</p>
            </div>
        );
    }

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-container h-16 flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <button
                    onClick={() => onNavigate('order-details')}
                    className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-sans font-extrabold text-xl tracking-tight text-on-surface">
                    Track Shipment
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="max-w-md mx-auto pt-24 px-4 space-y-6 animate-fade-in">
                {/* Product Summary */}
                <section className="bg-white rounded-3xl p-4 border border-surface-container shadow-sm flex gap-4">
                    <div className="w-14 h-18 rounded-xl overflow-hidden shrink-0 border border-surface-container">
                        <img
                            src={selectedOrder.outfit.image}
                            alt={selectedOrder.outfit.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h4 className="font-extrabold text-xs text-on-surface line-clamp-1">{selectedOrder.outfit.name}</h4>
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{selectedOrder.outfit.brand}</p>
                        <p className="text-[10px] text-primary font-bold mt-1.5 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 fill-primary/10" />
                            Rental Active: {selectedOrder.startDate} to {selectedOrder.endDate}
                        </p>
                    </div>
                </section>

                {/* Timeline Component */}
                <InteractiveTimeline order={selectedOrder} />
            </main>
        </div>
    );
}
