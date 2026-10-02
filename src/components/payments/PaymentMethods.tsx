/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProfile } from '../Profile/components/ProfileContext';
import { PaymentMethod, PaymentType } from '../../types';
import { CreditCard, Plus, Trash2, ShieldCheck, Check, Landmark, ArrowLeft, Send } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function PaymentMethods() {
    const { paymentMethods, addPaymentMethod, removePaymentMethod, setPrimaryPaymentMethod } = useProfile();

    const [isAdding, setIsAdding] = useState(false);
    const [payType, setPayType] = useState<PaymentType>('card');
    const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
    const [deleteUpiId, setDeleteUpiId] = useState<string | null>(null);

    // Form States
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('Visa Infinite');
    const [cardHolder, setCardHolder] = useState('');
    const [expires, setExpires] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isPrimary, setIsPrimary] = useState(false);

    const resetForm = () => {
        setCardNumber('');
        setCardType('Visa Infinite');
        setCardHolder('');
        setExpires('');
        setUpiId('');
        setIsPrimary(false);
        setIsAdding(false);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (payType === 'card') {
            // format card ending
            const lastFour = cardNumber.replace(/\s+/g, '').slice(-4) || '1111';
            addPaymentMethod({
                type: 'card',
                cardType,
                cardNumber: `•••• •••• •••• ${lastFour}`,
                cardHolder: cardHolder.toUpperCase() || 'OM SHRIVASTAVA',
                expires: expires || '12/29',
                isPrimary,
                provider: cardType.includes('Visa') ? 'Visa' : 'Mastercard'
            });
        } else {
            addPaymentMethod({
                type: 'upi',
                upiId: upiId || 'om@upi',
                isPrimary,
                provider: upiId.includes('ybl') ? 'PhonePe' : 'GPay'
            });
        }
        resetForm();
    };

    const getPaymentIcon = (method: PaymentMethod) => {
        if (method.type === 'card') {
            return <CreditCard className="w-5 h-5 text-brand-cherry" />;
        } else {
            return <Send className="w-5 h-5 text-purple-700" />;
        }
    };

    return (
        <>
        <div id="payment-methods-screen" className="pb-20 max-w-lg mx-auto">
            {isAdding ? (
                <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                    <h3 className="font-bold text-base text-text-primary mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-brand-cherry" />
                        Add Payment Option
                    </h3>

                    <div className="flex gap-2 mb-4 bg-gray-50 p-1.5 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setPayType('card')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${payType === 'card'
                                ? 'bg-white text-brand-cherry shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            Credit/Debit Card
                        </button>
                        <button
                            type="button"
                            onClick={() => setPayType('upi')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${payType === 'upi'
                                ? 'bg-white text-brand-cherry shadow-sm'
                                : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            UPI ID (GPay / PhonePe)
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {payType === 'card' ? (
                            <>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                        Card Class
                                    </label>
                                    <select
                                        value={cardType}
                                        onChange={(e) => setCardType(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                                    >
                                        <option value="Visa Infinite">Visa Infinite</option>
                                        <option value="Mastercard Luxury">Mastercard Luxury</option>
                                        <option value="RuPay Platinum">RuPay Platinum</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={19}
                                        placeholder="1234 5678 9876 5432"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-cherry"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                            Expiry (MM/YY)
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="09/28"
                                            maxLength={5}
                                            value={expires}
                                            onChange={(e) => setExpires(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-cherry"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                            Card Holder Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Om Shrivastava"
                                            value={cardHolder}
                                            onChange={(e) => setCardHolder(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-cherry"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                                    UPI address (VPA)
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. omshrivastava@okaxis"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-cherry"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2.5 pt-1">
                            <input
                                type="checkbox"
                                id="pm-primary-chk"
                                checked={isPrimary}
                                onChange={(e) => setIsPrimary(e.target.checked)}
                                className="w-4 h-4 rounded text-brand-cherry focus:ring-brand-cherry cursor-pointer"
                            />
                            <label htmlFor="pm-primary-chk" className="text-xs font-bold text-text-primary cursor-pointer select-none">
                                Make primary payment method
                            </label>
                        </div>

                        <div className="flex gap-2.5 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-3.5 bg-brand-cherry hover:bg-brand-dark text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-xs cursor-pointer"
                            >
                                Save Method
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-text-primary font-bold text-xs tracking-wider uppercase rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            ) : (
                <section className="space-y-6">
                    {/* Header Text */}
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Secure Wallet</h2>
                        <p className="text-xs text-text-secondary mt-1">
                            Manage your credit cards, debit cards, and UPI VPA addresses securely.
                        </p>
                    </div>

                    {/* Cards list */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block px-1">
                            Credit &amp; Debit Cards
                        </span>

                        {paymentMethods.filter(m => m.type === 'card').map((method) => (
                            <div key={method.id} className="space-y-3">
                                {/* Visual Premium Card representation if primary */}
                                {method.isPrimary ? (
                                    <div className="relative h-44 w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 flex flex-col justify-between text-white shadow-md border border-white/10 group hover:scale-[1.01] transition-transform">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-extrabold uppercase tracking-widest opacity-70">Primary Card</span>
                                                <span className="font-extrabold text-sm tracking-wide mt-1">{method.cardType}</span>
                                            </div>
                                            <CreditCard className="w-8 h-8 opacity-50" />
                                        </div>

                                        <div>
                                            <p className="font-bold text-base tracking-[0.2em] mb-4">{method.cardNumber}</p>

                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Card Holder</span>
                                                    <span className="text-xs font-semibold">{method.cardHolder}</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Expires</span>
                                                    <span className="text-xs font-semibold">{method.expires}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-cherry/5 flex items-center justify-center text-brand-cherry">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-text-primary">{method.cardType}</p>
                                                <p className="text-[11px] text-text-secondary">Ending in {method.cardNumber?.slice(-4)}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setDeleteCardId(method.id)}
                                            className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* UPI List */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary block px-1">
                            Digital UPI VPA Addresses
                        </span>

                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
                            {paymentMethods.filter(m => m.type === 'upi').map((method) => (
                                <div key={method.id} className="p-4 flex items-center justify-between hover:bg-gray-50/20 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${method.isPrimary ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-text-secondary'
                                            }`}>
                                            {getPaymentIcon(method)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-text-primary">{method.provider}</p>
                                            <p className="text-xs text-text-secondary">{method.upiId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {method.isPrimary ? (
                                            <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                Primary
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setPrimaryPaymentMethod(method.id)}
                                                className="text-[10px] font-semibold text-text-secondary hover:text-brand-cherry uppercase tracking-wider hover:underline cursor-pointer"
                                            >
                                                Set Primary
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setDeleteUpiId(method.id)}
                                            className="text-text-secondary hover:text-red-500 p-2 ml-1 cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add triggers */}
                    <button
                        id="add-payment-trigger"
                        onClick={() => setIsAdding(true)}
                        className="w-full py-4 rounded-2xl bg-brand-cherry hover:bg-brand-dark text-white flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Add Payment Method
                    </button>

                    {/* Secure Trust Stamp */}
                    <div className="pt-6 flex flex-col items-center gap-3 text-center text-text-secondary/60">
                        <div className="flex items-center gap-1.5 justify-center">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span className="text-[11px] font-semibold">Bank-grade 256-bit SSL encryption</span>
                        </div>
                        <p className="text-[10px] max-w-xs leading-normal">
                            Your billing security is our highest priority. Payment credentials are tokenized and never stored as raw text on university networks.
                        </p>
                    </div>
                </section>
            )}
        </div>

        <ConfirmModal
            open={deleteCardId !== null}
            title="Delete Card"
            message="Are you sure you want to delete this card? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            destructive
            onConfirm={() => { if (deleteCardId) removePaymentMethod(deleteCardId); setDeleteCardId(null); }}
            onCancel={() => setDeleteCardId(null)}
        />

        <ConfirmModal
            open={deleteUpiId !== null}
            title="Remove UPI Address"
            message="Are you sure you want to remove this UPI address?"
            confirmLabel="Remove"
            cancelLabel="Cancel"
            destructive
            onConfirm={() => { if (deleteUpiId) removePaymentMethod(deleteUpiId); setDeleteUpiId(null); }}
            onCancel={() => setDeleteUpiId(null)}
        />
        </>
    );
}
