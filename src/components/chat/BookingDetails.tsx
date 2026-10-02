import React from 'react';
import { useChat } from './context/ChatContext';
import {
    ArrowLeft,
    Calendar,
    MessageSquare,
    AlertTriangle,
    MapPin,
    CheckCircle,
    ShieldCheck,
    ChevronRight,
    Info
} from 'lucide-react';
import { motion } from 'motion/react';

export const BookingDetails: React.FC = () => {
    const { navigate, activeConversationId, conversations } = useChat();

    const conversation = conversations.find((c) => c.id === (activeConversationId || 'sarah'));

    if (!conversation) {
        return (
            <div className="flex-1 w-full max-w-md mx-auto bg-white flex flex-col h-full overflow-hidden">
                <header className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('messages')}
                            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-700 active:scale-95 duration-150"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
                    </div>
                    <div className="text-lg font-black text-[#C21807] uppercase tracking-tighter">
                        ZIGSY
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
                    <div className="bg-red-50/50 rounded-3xl p-5 border border-red-100/50 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#C21807]/10 flex items-center justify-center text-[#C21807] shrink-0">
                            <Info size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 text-sm">No Active Rental Found</h3>
                            <p className="text-xs text-gray-500 leading-normal">
                                We could not locate an active rental for this conversation. Please go back and select a conversation with an active rental.
                            </p>
                        </div>
                    </div>
                    <section className="space-y-3 pt-2">
                        <button
                            onClick={() => navigate('messages')}
                            className="w-full bg-[#C21807] hover:bg-[#A31405] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] duration-150"
                        >
                            <MessageSquare size={16} />
                            Go to Messages
                        </button>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 w-full max-w-md mx-auto bg-white flex flex-col h-full overflow-hidden"
        >
            {/* Header */}
            <header className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('chat', conversation.id)}
                        className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-700 active:scale-95 duration-150"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
                </div>
                <div className="text-lg font-black text-[#C21807] uppercase tracking-tighter">
                    ZIGSY
                </div>
            </header>

            {/* Main Details Body */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-24">
                {/* Status Header Block */}
                <div className="bg-red-50/50 rounded-3xl p-5 border border-red-100/50 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C21807]/10 flex items-center justify-center text-[#C21807] shrink-0">
                        <CheckCircle size={22} fill="currentColor" style={{ color: '#C21807', fill: '#fff' }} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-gray-900 text-sm">Active Rental Confirmed</h3>
                        <p className="text-xs text-gray-500 leading-normal">
                            Your rental contract is fully verified. Keep the item in pristine condition.
                        </p>
                    </div>
                </div>

                {/* Item Card */}
                <section className="flex gap-4 items-center bg-gray-50 p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-200 bg-white">
                        <img
                            src={conversation.itemImage}
                            alt={conversation.itemName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 space-y-0.5">
                        <span className="text-[9px] font-bold text-[#C21807] bg-red-50 border border-red-100/50 px-2.5 py-0.5 rounded-full inline-block">
                            ACTIVE RENTAL
                        </span>
                        <h2 className="font-bold text-gray-900 text-base leading-tight truncate">{conversation.itemName}</h2>
                        <p className="text-xs text-gray-500 font-semibold">Seller: {conversation.user.name}</p>
                    </div>
                </section>

                {/* Rental Spec & Dates */}
                <section className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rental Period</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</span>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#C21807]" />
                                <span className="text-sm font-semibold text-gray-900">Oct 28, 2023</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Date</span>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-[#C21807]" />
                                <span className="text-sm font-semibold text-gray-900">Nov 01, 2023</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <ShieldCheck size={14} className="text-green-600" />
                            <span>Complimentary dry-cleaning verified</span>
                        </div>
                    </div>
                </section>

                {/* Financial Specs */}
                <section className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price Breakdown</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Rental rate (4 days x ₹48.00)</span>
                            <span className="font-semibold text-gray-900">₹192.00</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Insurance policy fee</span>
                            <span className="font-semibold text-gray-900">₹12.00</span>
                        </div>
                        <div className="flex justify-between text-gray-500 pb-2 border-b border-gray-50">
                            <span>Refundable safety deposit</span>
                            <span className="font-semibold text-gray-900">₹150.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 pt-1 text-base">
                            <span>Total charged</span>
                            <span className="text-[#C21807]">₹354.00</span>
                        </div>
                    </div>
                </section>

                {/* Action Flows */}
                <section className="space-y-3 pt-2">
                    <button
                        onClick={() => navigate('chat', conversation.id)}
                        className="w-full bg-[#C21807] hover:bg-[#A31405] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] duration-150"
                    >
                        <MessageSquare size={16} />
                        Message Seller
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate('schedule-return')}
                            className="bg-white border border-gray-200 hover:border-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider py-4 rounded-2xl transition-all duration-150 active:scale-[0.98]"
                        >
                            Schedule Return
                        </button>
                        <button
                            onClick={() => navigate('report-issue')}
                            className="bg-white border border-red-200 hover:border-red-300 text-[#C21807] text-xs font-bold uppercase tracking-wider py-4 rounded-2xl transition-all duration-150 active:scale-[0.98]"
                        >
                            Report Issue
                        </button>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};
