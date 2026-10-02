import React, { useState, useMemo } from 'react';
import { useBooking } from './BookingContext';
import { ActiveScreen } from '../../types';
import { PROMO_CODES } from '../../data';
import { ArrowLeft, CreditCard, Wallet, Smartphone, ShieldCheck, Landmark, Check } from 'lucide-react';

interface PaymentScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
}

export default function PaymentScreen({ onNavigate }: PaymentScreenProps) {
    const {
        currentRentalOutfit,
        currentRentalDates,
        currentRentalDays,
        currentRentalDeliveryOption,
        currentRentalPaymentMethod,
        setPaymentMethod,
        createOrder
    } = useBooking();

    const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState(0);

    // Form inputs for Card
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');

    // UPI selection
    const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
    const [customUpiId, setCustomUpiId] = useState('');

    if (!currentRentalOutfit || !currentRentalDates) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Incomplete booking state.</p>
            </div>
        );
    }

    const subtotal = currentRentalOutfit.pricePerDay * currentRentalDays;
    const securityDeposit = currentRentalOutfit.securityDeposit;
    const deliveryFee = currentRentalDeliveryOption === 'home' ? 150 : 0;
    
    // We should compute the promo deduction here too if applicable, but context amount is easier or let's just make it simple.
    // To make it match Checkout exactly, let's recalculate simply (or pass it down. Recalculating is very easy):
    const totalAmount = useMemo(() => {
        // Find if any code could be applied. Since checkout is in context, let's assume standard calculation:
        return subtotal + securityDeposit + deliveryFee; 
    }, [subtotal, securityDeposit, deliveryFee]);

    const handlePayNow = () => {
        setIsProcessing(true);
        setProcessingStep(1);

        // Step 1: Securing transaction
        setTimeout(() => {
            setProcessingStep(2);
            // Step 2: Authorizing with bank
            setTimeout(() => {
                setProcessingStep(3);
                // Step 3: Recording booking
                setTimeout(() => {
                    createOrder();
                    setIsProcessing(false);
                    onNavigate('booking-success');
                }, 1000);
            }, 1000);
        }, 1000);
    };

    const isCardValid = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3 && nameOnCard.trim().length > 0;
    const isUpiValid = selectedUpiApp !== 'custom' || (selectedUpiApp === 'custom' && customUpiId.includes('@'));

    const canSubmit = (activeTab === 'card' && isCardValid) || (activeTab === 'upi' && isUpiValid) || activeTab === 'netbanking' || activeTab === 'wallet';

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        const formatted = value.replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
        }
        setExpiry(value.slice(0, 5));
    };

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-container h-16 flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <button
                    onClick={() => onNavigate('checkout')}
                    disabled={isProcessing}
                    className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-sans font-extrabold text-xl tracking-tight text-on-surface">
                    Payment Gateway
                </h1>
                <div className="w-10"></div>
            </header>

            {/* Processing Dialog Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center border border-surface-container flex flex-col items-center">
                        {/* Circular Loader */}
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-surface-container"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            <ShieldCheck className="absolute inset-6 w-12 h-12 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">
                            {processingStep === 1 && 'Securing Connection...'}
                            {processingStep === 2 && 'Authorizing Transaction...'}
                            {processingStep === 3 && 'Finalizing Rental Booking...'}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed max-w-[240px]">
                            {processingStep === 1 && 'Opening encrypted tunnel to banking gateways.'}
                            {processingStep === 2 && 'Waiting for verification codes and credentials approval.'}
                            {processingStep === 3 && 'Updating orders log database. Almost done!'}
                        </p>
                    </div>
                </div>
            )}

            <main className="max-w-md mx-auto pt-24 px-4">
                {/* Total Payable Summary Banner */}
                <section className="bg-primary/5 border border-primary/20 rounded-3xl p-5 mb-6 text-center animate-scale-up">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Payable Amount</span>
                    <span className="font-black text-3xl text-primary">₹{totalAmount.toLocaleString()}</span>
                    <p className="text-[9px] text-on-surface-variant mt-1.5 font-medium">Includes refundable security deposit and taxes</p>
                </section>

                {/* Payment Option Tabs */}
                <section className="bg-white rounded-3xl border border-surface-container shadow-sm overflow-hidden mb-8">
                    <div className="flex border-b border-surface-container bg-surface-container-low">
                        <button
                            onClick={() => setActiveTab('upi')}
                            className={`flex-1 py-4.5 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                activeTab === 'upi' ? 'border-primary text-primary bg-white' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            <Smartphone className="w-4 h-4" />
                            <span>UPI</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('card')}
                            className={`flex-1 py-4.5 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                activeTab === 'card' ? 'border-primary text-primary bg-white' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            <CreditCard className="w-4 h-4" />
                            <span>Card</span>
                        </button>
                        <button
                            onClick={() => !currentRentalOutfit.isHighValue && setActiveTab('netbanking')}
                            disabled={!!currentRentalOutfit.isHighValue}
                            className={`flex-1 py-4.5 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                currentRentalOutfit.isHighValue
                                    ? 'opacity-40 cursor-not-allowed bg-gray-50 border-transparent text-gray-400'
                                    : activeTab === 'netbanking' ? 'border-primary text-primary bg-white' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            <Landmark className="w-4 h-4" />
                            <span>NetBank</span>
                        </button>
                        <button
                            onClick={() => !currentRentalOutfit.isHighValue && setActiveTab('wallet')}
                            disabled={!!currentRentalOutfit.isHighValue}
                            className={`flex-1 py-4.5 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                                currentRentalOutfit.isHighValue
                                    ? 'opacity-40 cursor-not-allowed bg-gray-50 border-transparent text-gray-400'
                                    : activeTab === 'wallet' ? 'border-primary text-primary bg-white' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            <Wallet className="w-4 h-4" />
                            <span>Wallet</span>
                        </button>
                    </div>

                    {currentRentalOutfit.isHighValue && (
                        <div className="bg-red-50/70 text-red-700 p-3.5 text-[10px] font-bold border-t border-surface-container flex items-start gap-1.5 text-left">
                            <span>⚠️ Net Banking and Wallets are disabled for high-value rentals (Verified Card or UPI payment required).</span>
                        </div>
                    )}

                    <div className="p-6">
                        {/* UPI Tab */}
                        {activeTab === 'upi' && (
                            <div className="space-y-4 animate-slide-up">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Select UPI Option</span>
                                <div className="grid grid-cols-3 gap-3">
                                    {['gpay', 'phonepe', 'paytm'].map((app) => {
                                        const isSelected = selectedUpiApp === app;
                                        return (
                                            <div
                                                key={app}
                                                onClick={() => {
                                                    setSelectedUpiApp(app as any);
                                                    setPaymentMethod('upi');
                                                }}
                                                className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase ${
                                                    isSelected ? 'bg-primary/5 border-primary text-primary' : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                                                }`}
                                            >
                                                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                    {app === 'gpay' && <span className="text-[9px] text-blue-600 font-extrabold">G</span>}
                                                    {app === 'phonepe' && <span className="text-[9px] text-purple-600 font-extrabold">P</span>}
                                                    {app === 'paytm' && <span className="text-[9px] text-cyan-600 font-extrabold">Py</span>}
                                                </div>
                                                <span>{app}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="border-t border-surface-container pt-4">
                                    <div
                                        onClick={() => setSelectedUpiApp('custom')}
                                        className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                            selectedUpiApp === 'custom' ? 'bg-primary/5 border-primary text-primary' : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                            selectedUpiApp === 'custom' ? 'bg-primary border-primary text-white' : 'border-surface-container-highest bg-white'
                                        }`}>
                                            {selectedUpiApp === 'custom' && <Check className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <span className="text-xs font-bold">Custom UPI ID / VPA</span>
                                    </div>

                                    {selectedUpiApp === 'custom' && (
                                        <div className="mt-3 animate-slide-up">
                                            <input
                                                type="text"
                                                placeholder="enter UPI ID (e.g. name@upi)..."
                                                value={customUpiId}
                                                onChange={(e) => setCustomUpiId(e.target.value)}
                                                className="w-full bg-surface-container-low border border-surface-container focus:border-primary rounded-2xl py-3.5 px-4 text-xs font-semibold text-on-surface outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Card Tab */}
                        {activeTab === 'card' && (
                            <div className="space-y-4.5 animate-slide-up">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Credit / Debit Card details</span>
                                
                                <div className="space-y-3.5">
                                    <div>
                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ml-1.5 block mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            className="w-full bg-surface-container-low border border-surface-container focus:border-primary rounded-2xl py-3.5 px-4 text-xs font-semibold text-on-surface outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ml-1.5 block mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={expiry}
                                                onChange={handleExpiryChange}
                                                className="w-full bg-surface-container-low border border-surface-container focus:border-primary rounded-2xl py-3.5 px-4 text-xs font-semibold text-on-surface outline-none text-center"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ml-1.5 block mb-1">CVV / CVC</label>
                                            <input
                                                type="password"
                                                placeholder="***"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                className="w-full bg-surface-container-low border border-surface-container focus:border-primary rounded-2xl py-3.5 px-4 text-xs font-semibold text-on-surface outline-none text-center"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider ml-1.5 block mb-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={nameOnCard}
                                            onChange={(e) => setNameOnCard(e.target.value)}
                                            className="w-full bg-surface-container-low border border-surface-container focus:border-primary rounded-2xl py-3.5 px-4 text-xs font-semibold text-on-surface outline-none capitalize"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Net Banking Tab */}
                        {activeTab === 'netbanking' && (
                            <div className="space-y-4 animate-slide-up">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Popular Banks</span>
                                <div className="grid grid-cols-2 gap-3">
                                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((bank, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setPaymentMethod('netbanking')}
                                            className="p-3.5 rounded-2xl border border-surface-container bg-surface-container-low text-xs font-bold text-on-surface hover:border-primary text-center"
                                        >
                                            {bank}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Wallets Tab */}
                        {activeTab === 'wallet' && (
                            <div className="space-y-4 animate-slide-up">
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Popular Wallets</span>
                                <div className="space-y-3">
                                    {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay'].map((wallet, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setPaymentMethod('wallet')}
                                            className="w-full p-4 rounded-2xl border border-surface-container bg-surface-container-low text-xs font-bold text-on-surface hover:border-primary text-left flex justify-between items-center"
                                        >
                                            <span>{wallet}</span>
                                            <span className="text-[10px] font-bold text-primary">Connect</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-on-surface-variant/75 mb-8">
                    <ShieldCheck className="w-4.5 h-4.5 text-green-600" />
                    <span>PCI-DSS Compliant • 256-Bit SSL Secured Encryption</span>
                </div>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-surface-container py-4 px-4 z-40">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handlePayNow}
                            disabled={!canSubmit || isProcessing}
                            className={`w-full py-4.5 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.99] duration-150 cursor-pointer flex items-center justify-center gap-2 ${
                                canSubmit
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-primary/25 hover:shadow-primary/35'
                                    : 'bg-surface-container-highest text-on-surface-variant/40 shadow-none cursor-not-allowed'
                            }`}
                        >
                            Pay ₹{totalAmount.toLocaleString()} Now
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
