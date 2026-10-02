import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    MoreVertical,
    Landmark,
    QrCode,
    History,
    ShieldCheck,
    AlertCircle,
    Check,
    X,
    IndianRupee,
    Lock,
    ArrowUpRight
} from 'lucide-react';
import { BankAccount, UPIAccount, Transaction, WalletSummary } from '../../types';
import ConfirmModal from '../ConfirmModal';

interface PayoutMethodsProps {
    onBack: () => void;
}

export default function PayoutMethods({ onBack }: PayoutMethodsProps) {
    // --- MOCK DATA STATE ---
    const [wallet, setWallet] = useState<WalletSummary>({
        availableBalance: 12480,
        pendingEarnings: 2300,
        lifetimeEarnings: 86520,
        nextPayoutDay: 'Friday',
    });

    const [bankAccount, setBankAccount] = useState<BankAccount | null>({
        bankName: 'HDFC Bank',
        accountHolder: 'Om Kumar',
        accountNumber: '987654324321', // Ends with 4321
        ifsc: 'HDFC0001234',
        isVerified: true,
    });

    const [upis, setUpis] = useState<UPIAccount[]>([
        { id: '1', upiId: 'om@okaxis', isPrimary: true, isVerified: true },
    ]);

    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: 'tx1',
            payoutId: 'PAY-8921-HDF',
            amount: 2500,
            destination: 'HDFC Bank (4321)',
            destinationType: 'bank',
            status: 'Completed',
            date: 'Yesterday',
        },
        {
            id: 'tx2',
            payoutId: 'PAY-4389-UPI',
            amount: 800,
            destination: 'om@okaxis',
            destinationType: 'upi',
            status: 'Processing',
            date: 'Today',
        },
        {
            id: 'tx3',
            payoutId: 'PAY-1102-HDF',
            amount: 4800,
            destination: 'HDFC Bank (4321)',
            destinationType: 'bank',
            status: 'Completed',
            date: '2 days ago',
        },
    ]);

    // --- UI INTERACTION STATE ---
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState<string>('');
    const [withdrawTo, setWithdrawTo] = useState<'bank' | 'upi'>('upi');
    const [withdrawError, setWithdrawError] = useState<string | null>(null);
    const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
    const [lastWithdrawnTx, setLastWithdrawnTx] = useState<Transaction | null>(null);

    // Bank Form State
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [bankFormMode, setBankFormMode] = useState<'add' | 'edit'>('add');
    const [bankForm, setBankForm] = useState({
        bankName: '',
        accountHolder: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifsc: '',
    });
    const [bankErrors, setBankErrors] = useState<Record<string, string>>({});

    // UPI Form State
    const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
    const [upiFormMode, setUpiFormMode] = useState<'add' | 'edit'>('add');
    const [selectedUpiId, setSelectedUpiId] = useState<string | null>(null);
    const [upiForm, setUpiForm] = useState({
        upiId: '',
    });
    const [upiErrors, setUpiErrors] = useState<Record<string, string>>({});

    // UPI dropdown / action menu state
    const [activeUpiMenuId, setActiveUpiMenuId] = useState<string | null>(null);

    // --- HANDLERS & LOGIC ---

    // Withdraw flow helpers
    const handleWithdrawChipClick = (percentage: number) => {
        const amount = Math.floor(wallet.availableBalance * (percentage / 100));
        setWithdrawAmount(amount.toString());
        setWithdrawError(null);
    };

    const handleWithdrawSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNum = parseFloat(withdrawAmount);

        // Validation
        if (isNaN(amountNum) || amountNum <= 0) {
            setWithdrawError('Please enter a valid transfer amount.');
            return;
        }
        if (amountNum > wallet.availableBalance) {
            setWithdrawError(`Amount exceeds available balance (₹${wallet.availableBalance.toLocaleString()}).`);
            return;
        }

        let destLabel = '';
        if (withdrawTo === 'bank') {
            if (!bankAccount) {
                setWithdrawError('No bank account connected to withdraw to.');
                return;
            }
            destLabel = `${bankAccount.bankName} (${bankAccount.accountNumber.slice(-4)})`;
        } else {
            const primaryUpi = upis.find(u => u.isPrimary) || upis[0];
            if (!primaryUpi) {
                setWithdrawError('No UPI address added to withdraw to.');
                return;
            }
            destLabel = primaryUpi.upiId;
        }

        // Deduct and create processing transaction
        const newTxId = `tx-${Date.now()}`;
        const newTx: Transaction = {
            id: newTxId,
            payoutId: `PAY-${Math.floor(1000 + Math.random() * 9000)}-${withdrawTo === 'bank' ? 'HDF' : 'UPI'}`,
            amount: amountNum,
            destination: destLabel,
            destinationType: withdrawTo,
            status: 'Processing',
            date: 'Just now',
        };

        setWallet(prev => ({
            ...prev,
            availableBalance: prev.availableBalance - amountNum,
        }));

        setTransactions(prev => [newTx, ...prev]);
        setLastWithdrawnTx(newTx);
        setIsWithdrawSuccess(true);
        setWithdrawAmount('');
        setWithdrawError(null);
    };

    const handleCloseWithdrawSheet = () => {
        setIsWithdrawOpen(false);
        // Let the success state reset with a delay so it doesn't flicker while closing
        setTimeout(() => {
            setIsWithdrawSuccess(false);
            setLastWithdrawnTx(null);
        }, 300);
    };

    // Bank Form validation
    const validateBankForm = () => {
        const errors: Record<string, string> = {};
        if (!bankForm.bankName.trim()) errors.bankName = 'Bank name is required.';
        if (!bankForm.accountHolder.trim()) errors.accountHolder = 'Account holder name is required.';

        const accNumRegex = /^\d{9,18}$/;
        if (!bankForm.accountNumber) {
            errors.accountNumber = 'Account number is required.';
        } else if (!accNumRegex.test(bankForm.accountNumber)) {
            errors.accountNumber = 'Must be between 9 and 18 digits.';
        }

        if (bankForm.accountNumber !== bankForm.confirmAccountNumber) {
            errors.confirmAccountNumber = 'Account numbers do not match.';
        }

        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!bankForm.ifsc) {
            errors.ifsc = 'IFSC code is required.';
        } else if (!ifscRegex.test(bankForm.ifsc.toUpperCase())) {
            errors.ifsc = 'Invalid format. e.g. HDFC0001234 (4 letters, 0, 6 digits/letters)';
        }

        setBankErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBankSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateBankForm()) return;

        setBankAccount({
            bankName: bankForm.bankName.trim(),
            accountHolder: bankForm.accountHolder.trim(),
            accountNumber: bankForm.accountNumber.trim(),
            ifsc: bankForm.ifsc.trim().toUpperCase(),
            isVerified: true, // Auto-verified in prototype
        });

        setIsBankModalOpen(false);
        setBankForm({
            bankName: '',
            accountHolder: '',
            accountNumber: '',
            confirmAccountNumber: '',
            ifsc: '',
        });
        setBankErrors({});
    };

    const handleOpenEditBank = () => {
        if (bankAccount) {
            setBankForm({
                bankName: bankAccount.bankName,
                accountHolder: bankAccount.accountHolder,
                accountNumber: bankAccount.accountNumber,
                confirmAccountNumber: bankAccount.accountNumber,
                ifsc: bankAccount.ifsc,
            });
            setBankFormMode('edit');
            setBankErrors({});
            setIsBankModalOpen(true);
        }
    };

    const handleOpenAddBank = () => {
        setBankForm({
            bankName: '',
            accountHolder: '',
            accountNumber: '',
            confirmAccountNumber: '',
            ifsc: '',
        });
        setBankFormMode('add');
        setBankErrors({});
        setIsBankModalOpen(true);
    };

    const [showRemoveBankConfirm, setShowRemoveBankConfirm] = useState(false);
    const [removeUpiTargetId, setRemoveUpiTargetId] = useState<string | null>(null);

    const handleRemoveBank = () => {
        setShowRemoveBankConfirm(true);
    };

    const confirmRemoveBank = () => {
        setBankAccount(null);
        setWithdrawTo('upi');
        setShowRemoveBankConfirm(false);
    };

    // UPI Form validation
    const validateUpiForm = () => {
        const errors: Record<string, string> = {};
        const upiRegex = /^[\w.\-_]+@[\w.\-_]+$/;

        if (!upiForm.upiId.trim()) {
            errors.upiId = 'UPI ID is required.';
        } else if (!upiRegex.test(upiForm.upiId.trim())) {
            errors.upiId = 'Invalid UPI ID format. E.g. name@upi';
        }

        setUpiErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateUpiForm()) return;

        if (upiFormMode === 'add') {
            const isFirst = upis.length === 0;
            const newUpi: UPIAccount = {
                id: `upi-${Date.now()}`,
                upiId: upiForm.upiId.trim().toLowerCase(),
                isPrimary: isFirst, // first added UPI is primary by default
                isVerified: true,
            };
            setUpis(prev => [...prev, newUpi]);
        } else if (upiFormMode === 'edit' && selectedUpiId) {
            setUpis(prev => prev.map(u => u.id === selectedUpiId ? { ...u, upiId: upiForm.upiId.trim().toLowerCase() } : u));
        }

        setIsUpiModalOpen(false);
        setSelectedUpiId(null);
        setUpiForm({ upiId: '' });
        setUpiErrors({});
    };

    const handleOpenAddUpi = () => {
        setUpiForm({ upiId: '' });
        setUpiFormMode('add');
        setUpiErrors({});
        setIsUpiModalOpen(true);
    };

    const handleOpenEditUpi = (upi: UPIAccount) => {
        setUpiForm({ upiId: upi.upiId });
        setUpiFormMode('edit');
        setSelectedUpiId(upi.id);
        setUpiErrors({});
        setIsUpiModalOpen(true);
        setActiveUpiMenuId(null);
    };

    const handleRemoveUpi = (id: string) => {
        setRemoveUpiTargetId(id);
    };

    const confirmRemoveUpi = () => {
        if (!removeUpiTargetId) return;
        const removingUpi = upis.find(u => u.id === removeUpiTargetId);
        const remaining = upis.filter(u => u.id !== removeUpiTargetId);
        if (removingUpi?.isPrimary && remaining.length > 0) {
            remaining[0].isPrimary = true;
        }
        setUpis(remaining);
        setActiveUpiMenuId(null);
        setRemoveUpiTargetId(null);
    };

    const handleSetPrimaryUpi = (id: string) => {
        setUpis(prev => prev.map(u => ({ ...u, isPrimary: u.id === id })));
        setActiveUpiMenuId(null);
    };

    return (
        <>
        <div className="min-h-screen bg-surface-bg pb-32">
            <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
                {/* Title and Subtitle Description */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Rental Earnings</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Manage where your rental earnings are deposited securely. Keep your banking and UPI details up-to-date for direct transfers.
                    </p>
                </div>

                {/* SECTION 1: Seller Wallet Summary */}
                <div className="bg-primary text-white rounded-3xl p-6 shadow-xl shadow-primary/10 relative overflow-hidden">
                    {/* Decorative shapes to maintain premium high-end look */}
                    <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-black/15 rounded-full blur-2xl" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/80 font-semibold uppercase tracking-wider text-[11px]">Available Balance</p>
                                <div className="text-4xl font-extrabold mt-1 flex items-baseline tracking-tight">
                                    <span className="text-2xl font-bold mr-0.5">₹</span>
                                    {wallet.availableBalance.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Next Payout: {wallet.nextPayoutDay}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/15">
                            <div>
                                <p className="text-white/70 text-[11px] font-medium uppercase tracking-wider">Pending Earnings</p>
                                <p className="text-lg font-bold mt-1">₹{wallet.pendingEarnings.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-[11px] font-medium uppercase tracking-wider">Lifetime Earnings</p>
                                <p className="text-lg font-bold mt-1">₹{wallet.lifetimeEarnings.toLocaleString()}</p>
                            </div>
                        </div>

                        <button
                            id="withdraw-funds-btn"
                            onClick={() => {
                                setWithdrawError(null);
                                setIsWithdrawOpen(true);
                            }}
                            className="w-full bg-white text-primary font-bold text-sm py-4 rounded-xl shadow-lg mt-6 hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Withdraw Funds
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* SECTION 2: Connected Bank Account */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xs uppercase text-gray-500 tracking-wider">Bank Account</h3>
                        {bankAccount ? (
                            <button
                                id="edit-bank-top-btn"
                                onClick={handleOpenEditBank}
                                className="text-primary hover:text-primary-hover font-semibold text-xs flex items-center gap-1 active:scale-95 transition-all"
                            >
                                <Edit className="w-3 h-3" /> Edit Info
                            </button>
                        ) : (
                            <button
                                id="add-bank-top-btn"
                                onClick={handleOpenAddBank}
                                className="text-primary hover:text-primary-hover font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
                            >
                                <Plus className="w-3 h-3" /> Add Account
                            </button>
                        )}
                    </div>

                    {bankAccount ? (
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-primary">
                                        <Landmark className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{bankAccount.bankName}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{bankAccount.accountHolder}</p>
                                    </div>
                                </div>
                                {bankAccount.isVerified && (
                                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-100 flex items-center gap-1">
                                        <Check className="w-2.5 h-2.5 stroke-[3]" /> Verified
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-gray-50">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Number</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                        {`********${bankAccount.accountNumber.slice(-4)}`}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">IFSC Code</p>
                                    <p className="text-sm font-semibold text-gray-800 uppercase mt-0.5">{bankAccount.ifsc}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    id="bank-edit-btn"
                                    onClick={handleOpenEditBank}
                                    className="flex-1 py-2.5 font-bold text-xs text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
                                >
                                    Edit
                                </button>
                                <button
                                    id="bank-remove-btn"
                                    onClick={handleRemoveBank}
                                    className="flex-1 py-2.5 font-bold text-xs text-red-600 bg-red-50 rounded-xl hover:bg-red-100/70 active:scale-95 transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-sm text-gray-800">No bank account connected</p>
                                <p className="text-xs text-gray-500 max-w-[240px]">Connect your bank details to withdraw rental payouts direct to savings.</p>
                            </div>
                            <button
                                id="connect-bank-empty-btn"
                                onClick={handleOpenAddBank}
                                className="bg-primary text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all"
                            >
                                + Add Bank Account
                            </button>
                        </div>
                    )}
                </div>

                {/* SECTION 3: Connected UPI */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xs uppercase text-gray-500 tracking-wider">UPI Payout</h3>
                        <button
                            id="add-upi-top-btn"
                            onClick={handleOpenAddUpi}
                            className="text-primary hover:text-primary-hover font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
                        >
                            <Plus className="w-3 h-3" /> Add UPI
                        </button>
                    </div>

                    {upis.length > 0 ? (
                        <div className="space-y-2">
                            {upis.map(upi => (
                                <div
                                    key={upi.id}
                                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm text-gray-600">
                                            <QrCode className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">{upi.upiId}</h4>
                                            {upi.isPrimary ? (
                                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                                                    <CheckCircle className="w-3 h-3 fill-emerald-50" /> Primary Account
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-gray-400 font-semibold mt-0.5 block">Verified</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button
                                            id={`upi-menu-btn-${upi.id}`}
                                            onClick={() => setActiveUpiMenuId(activeUpiMenuId === upi.id ? null : upi.id)}
                                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 active:scale-95 transition-all"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {/* Simple absolute dropdown menu for actions */}
                                        {activeUpiMenuId === upi.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setActiveUpiMenuId(null)}
                                                />
                                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 text-xs">
                                                    {!upi.isPrimary && (
                                                        <button
                                                            id={`upi-set-primary-${upi.id}`}
                                                            onClick={() => handleSetPrimaryUpi(upi.id)}
                                                            className="w-full text-left px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
                                                        >
                                                            Set as Primary
                                                        </button>
                                                    )}
                                                    <button
                                                        id={`upi-edit-${upi.id}`}
                                                        onClick={() => handleOpenEditUpi(upi)}
                                                        className="w-full text-left px-4 py-2 font-bold text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Edit UPI ID
                                                    </button>
                                                    <button
                                                        id={`upi-remove-${upi.id}`}
                                                        onClick={() => handleRemoveUpi(upi.id)}
                                                        className="w-full text-left px-4 py-2 font-bold text-red-600 hover:bg-red-50"
                                                    >
                                                        Remove UPI
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
                            <p className="font-bold text-sm text-gray-800">No UPI payout ID added</p>
                            <button
                                id="connect-upi-empty-btn"
                                onClick={handleOpenAddUpi}
                                className="text-primary hover:text-primary-hover font-bold text-xs"
                            >
                                + Add UPI ID
                            </button>
                        </div>
                    )}
                </div>

                {/* SECTION 5: Transaction History */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xs uppercase text-gray-500 tracking-wider">Recent Payouts</h3>
                        <span className="text-gray-400 font-semibold text-xs flex items-center gap-1">
                            <History className="w-3.5 h-3.5" /> History
                        </span>
                    </div>

                    <div className="space-y-2">
                        {transactions.map(tx => (
                            <div
                                key={tx.id}
                                className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.destinationType === 'bank'
                                        ? 'bg-rose-50 text-rose-600'
                                        : 'bg-indigo-50 text-indigo-600'
                                        }`}>
                                        {tx.destinationType === 'bank' ? (
                                            <Landmark className="w-4 h-4" />
                                        ) : (
                                            <QrCode className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900">
                                            ₹{tx.amount.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            {tx.destination} • {tx.date}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${tx.status === 'Completed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : tx.status === 'Processing'
                                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                                            : 'bg-rose-50 text-rose-700 border-rose-100'
                                        }`}>
                                        {tx.status}
                                    </span>
                                    <div className="text-[9px] text-gray-400 font-mono mt-1 font-medium">{tx.payoutId}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECTION 6: Security Card */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex gap-4 items-start shadow-sm">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 text-primary shadow-sm flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-sm text-gray-900">Bank-grade Secure Protection</h4>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            Your financial details are protected using 256-bit encryption. We only process transfers to verified accounts & UPI IDs.
                        </p>
                        <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 pt-2 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-primary" /> 256-bit Encryption
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-primary" /> Verified Accounts
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-primary" /> Secure Processing
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-primary" /> Protected Data
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: Withdraw Funds Bottom Sheet */}
            <AnimatePresence>
                {isWithdrawOpen && (
                    <>
                        {/* Dark Overlay */}
                        <motion.div
                            id="withdraw-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseWithdrawSheet}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center"
                        />

                        {/* Bottom Sheet Container */}
                        <motion.div
                            id="withdraw-bottom-sheet"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[2.5rem] shadow-2xl z-50 flex flex-col max-h-[92vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4 flex-shrink-0" />

                            {!isWithdrawSuccess ? (
                                <div className="p-6 pt-2 space-y-6 flex-1">
                                    <div className="space-y-1 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Withdraw Funds</h3>
                                        <p className="text-xs text-gray-500 font-medium">Transfer your earnings securely to your selected method</p>
                                    </div>

                                    {/* Available Balance Box */}
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center relative overflow-hidden">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available for Withdrawal</p>
                                        <p className="text-3xl font-extrabold text-primary mt-1 flex justify-center items-baseline tracking-tight">
                                            <span className="text-xl font-bold mr-0.5">₹</span>
                                            {wallet.availableBalance.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Amount Inputs */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                                            Amount to Transfer
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 text-lg font-bold">
                                                ₹
                                            </div>
                                            <input
                                                id="withdraw-amount-input"
                                                type="number"
                                                placeholder="0"
                                                value={withdrawAmount}
                                                onChange={(e) => {
                                                    setWithdrawAmount(e.target.value);
                                                    setWithdrawError(null);
                                                }}
                                                className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-gray-900 font-bold text-base"
                                            />
                                        </div>

                                        {/* Quick Selection Chips */}
                                        <div className="grid grid-cols-4 gap-2">
                                            {[25, 50, 75, 100].map(percentage => (
                                                <button
                                                    key={percentage}
                                                    type="button"
                                                    id={`chip-${percentage}`}
                                                    onClick={() => handleWithdrawChipClick(percentage)}
                                                    className="py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-xs text-gray-800 transition-colors active:scale-95"
                                                >
                                                    {percentage}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Withdraw Destination */}
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                                            Withdraw To
                                        </label>
                                        <div className="space-y-2">
                                            {/* UPI Option */}
                                            {upis.length > 0 ? (
                                                <label
                                                    id="withdraw-dest-upi-label"
                                                    className={`flex items-center justify-between p-4 bg-white border rounded-xl cursor-pointer transition-all ${withdrawTo === 'upi'
                                                        ? 'border-2 border-primary shadow-sm'
                                                        : 'border-gray-200 opacity-60'
                                                        }`}
                                                    onClick={() => setWithdrawTo('upi')}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <QrCode className={`w-5 h-5 ${withdrawTo === 'upi' ? 'text-primary' : 'text-gray-500'}`} />
                                                        <div>
                                                            <p className="font-bold text-xs uppercase text-gray-400 tracking-wider">UPI Destination</p>
                                                            <p className="font-bold text-sm text-gray-800 mt-0.5">
                                                                {upis.find(u => u.isPrimary)?.upiId || upis[0].upiId}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="withdrawDest"
                                                        checked={withdrawTo === 'upi'}
                                                        onChange={() => setWithdrawTo('upi')}
                                                        className="text-primary focus:ring-primary w-4.5 h-4.5 accent-primary"
                                                    />
                                                </label>
                                            ) : (
                                                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-xl text-xs flex items-center gap-2 border border-yellow-100">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                    <span>No UPI method available. Please add a UPI ID first.</span>
                                                </div>
                                            )}

                                            {/* Bank Option */}
                                            {bankAccount ? (
                                                <label
                                                    id="withdraw-dest-bank-label"
                                                    className={`flex items-center justify-between p-4 bg-white border rounded-xl cursor-pointer transition-all ${withdrawTo === 'bank'
                                                        ? 'border-2 border-primary shadow-sm'
                                                        : 'border-gray-200 opacity-60'
                                                        }`}
                                                    onClick={() => setWithdrawTo('bank')}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Landmark className={`w-5 h-5 ${withdrawTo === 'bank' ? 'text-primary' : 'text-gray-400'}`} />
                                                        <div>
                                                            <p className="font-bold text-xs uppercase text-gray-400 tracking-wider">Bank Destination</p>
                                                            <p className="font-bold text-sm text-gray-800 mt-0.5">
                                                                {`${bankAccount.bankName} (${bankAccount.accountNumber.slice(-4)})`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name="withdrawDest"
                                                        checked={withdrawTo === 'bank'}
                                                        onChange={() => setWithdrawTo('bank')}
                                                        className="text-primary focus:ring-primary w-4.5 h-4.5 accent-primary"
                                                    />
                                                </label>
                                            ) : (
                                                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-xl text-xs flex items-center gap-2 border border-yellow-100">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                    <span>No bank account available. Please add a bank account first.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Estimated Arrival Note */}
                                    <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 flex justify-between font-medium">
                                        <span>Estimated Arrival:</span>
                                        <span className="font-bold text-primary">
                                            {withdrawTo === 'bank' ? '1–2 Business Days' : 'Instant (Demo)'}
                                        </span>
                                    </div>

                                    {/* Withdraw Error Display */}
                                    {withdrawError && (
                                        <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 border border-rose-100 font-semibold">
                                            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-rose-600" />
                                            <span>{withdrawError}</span>
                                        </div>
                                    )}

                                    {/* Action button */}
                                    <button
                                        id="confirm-withdrawal-btn"
                                        onClick={handleWithdrawSubmit}
                                        disabled={wallet.availableBalance <= 0}
                                        className="w-full bg-primary text-white font-bold text-sm py-4 rounded-xl shadow-lg hover:bg-primary-hover disabled:bg-gray-300 disabled:shadow-none active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                                    >
                                        Confirm Withdrawal
                                    </button>
                                </div>
                            ) : (
                                /* Success screen */
                                <div className="p-8 text-center space-y-6 flex-1 flex flex-col justify-center items-center py-12">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                                        <Check className="w-8 h-8 stroke-[3]" />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Withdrawal Initiated</h3>
                                        <p className="text-sm text-gray-600 font-medium">Your funds are on the way!</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 w-full max-w-[320px] text-center space-y-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount Withdrawn</p>
                                            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">₹{lastWithdrawnTx?.amount.toLocaleString()}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-gray-100 text-xs text-gray-600">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Transfer To</p>
                                                <p className="font-semibold truncate text-gray-800 mt-0.5">{lastWithdrawnTx?.destination}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Payout ID</p>
                                                <p className="font-mono text-gray-800 mt-0.5">{lastWithdrawnTx?.payoutId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[280px]">
                                        {withdrawTo === 'bank'
                                            ? 'Funds are estimated to settle in your bank account in 1–2 business days.'
                                            : 'UPI transfer has been queued and is processing instantly.'}
                                    </p>

                                    <button
                                        id="success-done-btn"
                                        onClick={handleCloseWithdrawSheet}
                                        className="w-full max-w-[280px] bg-primary text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all mt-4"
                                    >
                                        Great, Thank You!
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* BANK ACCOUNT MODAL FORM */}
            <AnimatePresence>
                {isBankModalOpen && (
                    <>
                        <motion.div
                            id="bank-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBankModalOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        />
                        <motion.div
                            id="bank-modal-container"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl z-[60] w-[calc(100%-2rem)] max-w-sm space-y-5"
                        >
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <h3 className="font-extrabold text-gray-900 text-base">
                                    {bankFormMode === 'add' ? 'Add Bank Account' : 'Edit Bank Account'}
                                </h3>
                                <button
                                    id="bank-modal-close"
                                    onClick={() => setIsBankModalOpen(false)}
                                    className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleBankSubmit} className="space-y-4 text-xs">
                                {/* Bank Name */}
                                <div className="space-y-1">
                                    <label className="block font-bold text-gray-500 uppercase tracking-wider">Bank Name</label>
                                    <input
                                        type="text"
                                        id="bank-name-input"
                                        placeholder="e.g. HDFC Bank, ICICI Bank"
                                        value={bankForm.bankName}
                                        onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-gray-900 font-semibold"
                                    />
                                    {bankErrors.bankName && <p className="text-red-500 text-[10px] font-bold">{bankErrors.bankName}</p>}
                                </div>

                                {/* Account Holder */}
                                <div className="space-y-1">
                                    <label className="block font-bold text-gray-500 uppercase tracking-wider">Account Holder Name</label>
                                    <input
                                        type="text"
                                        id="bank-holder-input"
                                        placeholder="e.g. Om Kumar"
                                        value={bankForm.accountHolder}
                                        onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-gray-900 font-semibold"
                                    />
                                    {bankErrors.accountHolder && <p className="text-red-500 text-[10px] font-bold">{bankErrors.accountHolder}</p>}
                                </div>

                                {/* Account Number */}
                                <div className="space-y-1">
                                    <label className="block font-bold text-gray-500 uppercase tracking-wider">Account Number</label>
                                    <input
                                        type="password" // hide typing
                                        id="bank-acc-input"
                                        placeholder="Enter bank account number"
                                        value={bankForm.accountNumber}
                                        onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-gray-900 font-semibold"
                                    />
                                    {bankErrors.accountNumber && <p className="text-red-500 text-[10px] font-bold">{bankErrors.accountNumber}</p>}
                                </div>

                                {/* Confirm Account Number */}
                                <div className="space-y-1">
                                    <label className="block font-bold text-gray-500 uppercase tracking-wider">Confirm Account Number</label>
                                    <input
                                        type="text" // show plain text to verify
                                        id="bank-confirm-acc-input"
                                        placeholder="Re-enter bank account number"
                                        value={bankForm.confirmAccountNumber}
                                        onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-gray-900 font-semibold"
                                    />
                                    {bankErrors.confirmAccountNumber && <p className="text-red-500 text-[10px] font-bold">{bankErrors.confirmAccountNumber}</p>}
                                </div>

                                {/* IFSC Code */}
                                <div className="space-y-1">
                                    <label className="block font-bold text-gray-500 uppercase tracking-wider">IFSC Code</label>
                                    <input
                                        type="text"
                                        id="bank-ifsc-input"
                                        placeholder="e.g. HDFC0001234"
                                        value={bankForm.ifsc}
                                        onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-gray-900 font-semibold uppercase"
                                    />
                                    {bankErrors.ifsc && <p className="text-red-500 text-[10px] font-bold">{bankErrors.ifsc}</p>}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    id="bank-modal-submit"
                                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all mt-6 text-xs"
                                >
                                    {bankFormMode === 'add' ? 'Verify & Link Account' : 'Save Details'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* UPI ACCOUNT MODAL FORM */}
            <AnimatePresence>
                {isUpiModalOpen && (
                    <>
                        <motion.div
                            id="upi-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUpiModalOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        />
                        <motion.div
                            id="upi-modal-container"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl z-[60] w-[calc(100%-2rem)] max-w-sm space-y-5"
                        >
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <h3 className="font-extrabold text-gray-900 text-base">
                                    {upiFormMode === 'add' ? 'Link UPI Address' : 'Edit UPI Address'}
                                </h3>
                                <button
                                    id="upi-modal-close"
                                    onClick={() => setIsUpiModalOpen(false)}
                                    className="p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpiSubmit} className="space-y-4 text-xs">
                                {/* UPI ID */}
                                <div className="space-y-1">
                                    <label className="block font-bold text-gray-500 uppercase tracking-wider">UPI ID / VPA</label>
                                    <input
                                        type="text"
                                        id="upi-id-input"
                                        placeholder="e.g. omkumar@okaxis"
                                        value={upiForm.upiId}
                                        onChange={(e) => setUpiForm({ ...upiForm, upiId: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-gray-900 font-semibold lowercase"
                                    />
                                    {upiErrors.upiId && <p className="text-red-500 text-[10px] font-bold">{upiErrors.upiId}</p>}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    id="upi-modal-submit"
                                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-primary-hover active:scale-95 transition-all mt-6 text-xs"
                                >
                                    {upiFormMode === 'add' ? 'Verify & Link UPI' : 'Save UPI Address'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>

        <ConfirmModal
            open={showRemoveBankConfirm}
            title="Disconnect Bank Account"
            message="Are you sure you want to disconnect your bank account? You will need to re-link it to receive payouts."
            confirmLabel="Disconnect"
            cancelLabel="Cancel"
            destructive
            onConfirm={confirmRemoveBank}
            onCancel={() => setShowRemoveBankConfirm(false)}
        />

        <ConfirmModal
            open={removeUpiTargetId !== null}
            title="Remove UPI Address"
            message="Are you sure you want to remove this UPI address?"
            confirmLabel="Remove"
            cancelLabel="Cancel"
            destructive
            onConfirm={confirmRemoveUpi}
            onCancel={() => setRemoveUpiTargetId(null)}
        />
        </>
    );
}
