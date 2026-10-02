import React, { useState, useMemo } from 'react';
import { useBooking } from './BookingContext';
import { ActiveScreen } from '../../types';
import { SAVED_ADDRESSES, PROMO_CODES } from '../../data';
import { ArrowLeft, MapPin, Truck, Store, Tag, Sparkles, AlertCircle, Check } from 'lucide-react';

interface CheckoutScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
}

export default function CheckoutScreen({ onNavigate }: CheckoutScreenProps) {
    const {
        currentRentalOutfit,
        currentRentalDates,
        currentRentalDays,
        currentRentalDeliveryOption,
        currentRentalAddress,
        currentRentalPaymentMethod,
        setDeliveryOption,
        setDeliveryAddress
    } = useBooking();

    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
    const [promoError, setPromoError] = useState<string | null>(null);

    if (!currentRentalOutfit || !currentRentalDates) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Incomplete booking state.</p>
            </div>
        );
    }

    const subtotal = currentRentalOutfit.pricePerDay * currentRentalDays;
    const securityDeposit = currentRentalOutfit.securityDeposit;

    // Delivery Fee: ₹150 for home, ₹0 for store pickup
    const deliveryFee = currentRentalDeliveryOption === 'home' ? 150 : 0;

    const discountDetails = useMemo(() => {
        if (!appliedPromo) return { amount: 0, freeShipping: false };
        const promo = PROMO_CODES[appliedPromo];
        if (!promo) return { amount: 0, freeShipping: false };

        if (promo.type === 'percent') {
            return { amount: Math.round((subtotal * promo.value) / 100), freeShipping: false };
        }
        if (promo.type === 'flat') {
            return { amount: promo.value, freeShipping: false };
        }
        if (promo.type === 'free_shipping') {
            return { amount: 0, freeShipping: true };
        }
        return { amount: 0, freeShipping: false };
    }, [appliedPromo, subtotal]);

    const finalDeliveryFee = discountDetails.freeShipping ? 0 : deliveryFee;
    const totalAmount = subtotal + securityDeposit + finalDeliveryFee - discountDetails.amount;

    const handleApplyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (PROMO_CODES[code]) {
            setAppliedPromo(code);
            setPromoError(null);
        } else {
            setPromoError('Invalid promo code');
            setAppliedPromo(null);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoError(null);
    };

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-container h-16 flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <button
                    onClick={() => onNavigate('date-selection')}
                    className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-sans font-extrabold text-xl tracking-tight text-on-surface">
                    Checkout
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="max-w-md mx-auto pt-24 px-4">
                {/* Product Summary Card */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm mb-6 flex gap-4">
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
                            <h3 className="font-bold text-sm text-on-surface mt-0.5 line-clamp-1">{currentRentalOutfit.name}</h3>
                            <p className="text-xs text-on-surface-variant font-medium mt-1">
                                {currentRentalDates.startDate} to {currentRentalDates.endDate} ({currentRentalDays} days)
                            </p>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="font-extrabold text-base text-primary">₹{currentRentalOutfit.pricePerDay}</span>
                            <span className="text-[10px] text-on-surface-variant">/ day</span>
                        </div>
                    </div>
                </section>

                {/* Delivery Option */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm mb-6">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase mb-3">Delivery Method</h3>
                    <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-2xl border border-surface-container">
                        <Store className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                        <div>
                            <span className="text-xs font-extrabold text-on-surface">Local Pickup (Free)</span>
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mt-2">Pickup Address</span>
                            <p className="text-[11px] leading-relaxed font-semibold text-on-surface mt-1">
                                Vivekananda Global University, Admin Block Lawn
                            </p>
                        </div>
                    </div>
                </section>

                {/* Promo Code Input Card */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm mb-6">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase mb-4">Promo Code</h3>
                    {appliedPromo ? (
                        <div className="flex justify-between items-center bg-green-50 text-green-700 p-4.5 rounded-2xl border border-green-200 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Tag className="w-5 h-5 animate-bounce" />
                                <div>
                                    <span className="font-bold text-xs">Code Applied: {appliedPromo}</span>
                                    <p className="text-[10px] text-green-600 font-medium">
                                        {PROMO_CODES[appliedPromo].type === 'percent' 
                                            ? `${PROMO_CODES[appliedPromo].value}% Discount Applied`
                                            : PROMO_CODES[appliedPromo].type === 'flat'
                                            ? `Flat ₹${PROMO_CODES[appliedPromo].value} Off Applied`
                                            : 'Free Shipping Waived'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemovePromo}
                                className="text-xs font-bold text-green-700 hover:text-green-800 underline cursor-pointer"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex gap-2">
                                <div className="relative flex-grow">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4.5 h-4.5" />
                                    <input
                                        type="text"
                                        placeholder="Enter code (e.g. ZIGSY20)..."
                                        value={promoInput}
                                        onChange={(e) => {
                                            setPromoInput(e.target.value);
                                            setPromoError(null);
                                        }}
                                        className="w-full bg-surface-container-low border border-surface-container focus:border-primary rounded-2xl py-3.5 pl-11 pr-4 text-xs font-semibold text-on-surface outline-none transition-all"
                                    />
                                </div>
                                <button
                                    onClick={handleApplyPromo}
                                    className="px-6 bg-primary hover:opacity-95 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer active:scale-95 duration-150"
                                >
                                    Apply
                                </button>
                            </div>
                            {promoError && (
                                <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-semibold mt-2.5 ml-1.5 animate-slide-up">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>{promoError}</span>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Price Summary Breakdown */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm mb-8">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase mb-4">Price Details</h3>
                    <div className="space-y-3.5">
                        <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                            <span>Rental Fee ({currentRentalDays} days × ₹{currentRentalOutfit.pricePerDay}):</span>
                            <span className="font-bold text-on-surface">₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                            <span>Refundable Security Deposit:</span>
                            <span className="font-bold text-on-surface">₹{securityDeposit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                            <span>Delivery/Pickup Fee:</span>
                            <span className="font-bold text-on-surface">
                                {finalDeliveryFee === 0 ? 'FREE' : `₹${finalDeliveryFee}`}
                            </span>
                        </div>
                        {appliedPromo && discountDetails.amount > 0 && (
                            <div className="flex justify-between text-xs text-green-700 font-semibold animate-slide-up">
                                <span>Promo Discount ({appliedPromo}):</span>
                                <span>-₹{discountDetails.amount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="border-t border-surface-container pt-3.5 flex justify-between text-sm font-black text-on-surface">
                            <span>Total Payable Amount:</span>
                            <span className="text-primary text-base">₹{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-surface-container py-4 px-4 z-40">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={() => onNavigate('payment')}
                            className="w-full py-4.5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all active:scale-[0.99] duration-150 cursor-pointer flex items-center justify-center gap-2"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
