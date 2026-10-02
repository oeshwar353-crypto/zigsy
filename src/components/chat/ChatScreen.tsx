import React, { useState, useRef, useEffect } from 'react';
import { useChat } from './context/ChatContext';
import {
    ArrowLeft,
    MoreVertical,
    BadgeCheck,
    ChevronRight,
    Smile,
    Image as ImageIcon,
    Camera,
    Send,
    MapPin,
    Calendar,
    AlertTriangle,
    Sparkles,
    CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ChatScreen: React.FC = () => {
    const {
        activeConversationId,
        conversations,
        messages,
        sendMessage,
        navigate,
    } = useChat();

    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversation = conversations.find((c) => c.id === activeConversationId);
    const chatMessages = activeConversationId ? messages[activeConversationId] || [] : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages.length]);

    if (!conversation) {
        return (
            <div className="flex-1 w-full max-w-md mx-auto bg-white flex flex-col h-full overflow-hidden">
                <header className="shrink-0 bg-white border-b border-gray-100 flex items-center justify-between px-3 py-3 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('messages')}
                            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-700 active:scale-95 duration-150"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="font-bold text-gray-900 text-sm">Conversation</h2>
                    </div>
                    <div className="text-lg font-black text-[#C21807] uppercase tracking-tighter">
                        ZIGSY
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
                    <div className="bg-red-50/50 rounded-3xl p-5 border border-red-100/50 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#C21807]/10 flex items-center justify-center text-[#C21807] shrink-0">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 text-sm">No Conversation Selected</h3>
                            <p className="text-xs text-gray-500 leading-normal">
                                Please go back to your messages and select a conversation to continue chatting.
                            </p>
                        </div>
                    </div>
                    <section className="space-y-3 pt-2">
                        <button
                            onClick={() => navigate('messages')}
                            className="w-full bg-[#C21807] hover:bg-[#A31405] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] duration-150"
                        >
                            <ArrowLeft size={16} />
                            Back to Messages
                        </button>
                    </section>
                </div>
            </div>
        );
    }

    const handleSend = () => {
        if (!inputValue.trim() || !activeConversationId) return;
        sendMessage(activeConversationId, inputValue.trim());
        setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const shareLocation = () => {
        if (!activeConversationId) return;
        // Send location card directly in the chat feed
        sendMessage(activeConversationId, "I've shared my pickup location details below.", undefined, {
            location: 'College Main Gate (near Library entrance)',
            date: 'Today',
            time: '04:00 PM',
            status: 'pending'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 w-full max-w-md mx-auto bg-white flex flex-col h-full overflow-hidden"
        >
            {/* Header */}
            <header className="shrink-0 bg-white border-b border-gray-100 flex flex-col sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between px-3 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('messages')}
                            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-700 active:scale-95 duration-150"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="flex items-center gap-2.5">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={conversation.user.avatar} alt={conversation.user.name} className="w-full h-full object-cover" />
                                </div>
                                {conversation.user.isOnline && (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-1">
                                    <h2 className="font-bold text-gray-900 text-sm leading-tight">{conversation.user.name}</h2>
                                    {conversation.user.isVerified && (
                                        <BadgeCheck size={14} className="text-[#C21807]" fill="currentColor" style={{ color: '#C21807', fill: '#fff' }} />
                                    )}
                                </div>
                                <p className="text-[10px] text-[#C21807] font-bold tracking-wider uppercase">Verified Seller</p>
                            </div>
                        </div>
                    </div>

                    <button className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
                        <MoreVertical size={20} />
                    </button>
                </div>

                {/* Active Rental Banner */}
                <div className="px-3 pb-3 flex">
                    <div
                        onClick={() => navigate('booking-details', conversation.id)}
                        className="w-full bg-gray-50 hover:bg-gray-100/70 active:scale-[0.99] transition-all cursor-pointer rounded-2xl p-2 flex items-center gap-3 border border-gray-100"
                    >
                        <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-white">
                            <img src={conversation.itemImage} alt={conversation.itemName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <span className="text-[10px] font-bold text-[#C21807] tracking-wider uppercase leading-none block mb-0.5">
                                {conversation.bookingStatus}
                            </span>
                            <p className="text-xs font-semibold text-gray-900 truncate leading-tight">
                                {conversation.itemName}
                            </p>
                        </div>
                        <div className="pr-1 text-gray-400">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages Canvas */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
                <div className="flex justify-center mb-2">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Monday, May 12
                    </span>
                </div>

                {chatMessages.map((msg, index) => {
                    const isMe = msg.senderId === 'buyer';

                    // Inject a visual separator before the last elements for aesthetic story alignment
                    const showTodayDivider = index === chatMessages.length - 1 && msg.id.startsWith('msg_');

                    return (
                        <React.Fragment key={msg.id}>
                            {showTodayDivider && (
                                <div className="flex justify-center my-4">
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                        Today
                                    </span>
                                </div>
                            )}

                            <div className={`flex gap-2.5 max-w-[85%] ${isMe ? 'self-end ml-auto' : 'self-start'}`}>
                                {!isMe && (
                                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 mt-auto border border-gray-100">
                                        <img src={conversation.user.avatar} alt={conversation.user.name} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="flex flex-col gap-1">
                                    {/* Standard Text or Image Message bubble */}
                                    <div
                                        className={`p-3.5 rounded-2xl ${isMe
                                            ? 'bg-[#C21807] text-white rounded-tr-sm rounded-br-2xl shadow-[0_4px_16px_rgba(194,24,7,0.06)]'
                                            : 'bg-gray-100 text-gray-900 rounded-tl-sm rounded-bl-2xl border border-gray-100'
                                            }`}
                                    >
                                        {msg.image && (
                                            <div className="rounded-xl overflow-hidden mb-2 aspect-[4/3] max-w-full">
                                                <img src={msg.image} alt="Shared preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        {msg.text && <p className="text-[13px] leading-relaxed font-normal">{msg.text}</p>}

                                        {/* Shared Location Card Bubble */}
                                        {msg.locationCard && (
                                            <div className="bg-white text-gray-900 border border-gray-200 rounded-xl p-3 space-y-2 mt-2 shadow-sm min-w-[200px]">
                                                <div className="flex items-center gap-2 text-[#C21807] font-bold text-xs uppercase tracking-wider">
                                                    <MapPin size={14} />
                                                    <span>Meeting Details</span>
                                                </div>
                                                <div className="text-xs space-y-1 text-gray-600">
                                                    <p><strong className="text-gray-900">Where:</strong> {msg.locationCard.location}</p>
                                                    <p><strong className="text-gray-900">When:</strong> {msg.locationCard.date} @ {msg.locationCard.time}</p>
                                                </div>
                                                <div className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md text-center">
                                                    ✓ Schedule Sent to Seller
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timestamp & Read Receipt */}
                                    <div className={`flex items-center gap-1.5 text-[10px] text-gray-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <span>{msg.timestamp}</span>
                                        {isMe && <CheckCheck size={12} className="text-[#C21807]" />}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <footer className="shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-100 pt-2.5 pb-6 px-4 space-y-3 sticky bottom-0 z-10">
                {/* Quick Actions Scrollable */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                    <button
                        onClick={shareLocation}
                        className="whitespace-nowrap shrink-0 bg-white hover:bg-gray-50 border border-gray-100 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 transition-all active:scale-95 duration-150"
                    >
                        <MapPin size={14} className="text-[#C21807]" />
                        Share Pickup Location
                    </button>

                    <button
                        onClick={() => navigate('schedule-return')}
                        className="whitespace-nowrap shrink-0 bg-white hover:bg-gray-50 border border-gray-100 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 transition-all active:scale-95 duration-150"
                    >
                        <Calendar size={14} className="text-[#C21807]" />
                        Schedule Return
                    </button>

                    <button
                        onClick={() => {
                            // Simulates uploading an outfit photo directly into active chat
                            sendMessage(
                                activeConversationId!,
                                "Here's a photo check of the outfit! Ready for return.",
                                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400"
                            );
                        }}
                        className="whitespace-nowrap shrink-0 bg-white hover:bg-gray-50 border border-gray-100 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 transition-all active:scale-95 duration-150"
                    >
                        <Sparkles size={14} className="text-[#C21807]" />
                        Send Outfit Photo
                    </button>

                    <button
                        onClick={() => navigate('report-issue')}
                        className="whitespace-nowrap shrink-0 bg-white hover:bg-gray-50 border border-gray-100 text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 transition-all active:scale-95 duration-150"
                    >
                        <AlertTriangle size={14} className="text-[#C21807]" />
                        Report Issue
                    </button>
                </div>

                {/* Chat input box */}
                <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C21807]/20 border border-gray-100 rounded-2xl p-2 pl-4 transition-all duration-200">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-transparent border-none text-sm text-gray-950 placeholder-gray-400 outline-none focus:ring-0 py-1.5"
                    />

                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 rounded-full transition-colors active:scale-90">
                            <Smile size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 rounded-full transition-colors active:scale-90">
                            <ImageIcon size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 rounded-full transition-colors active:scale-90">
                            <Camera size={18} />
                        </button>

                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${inputValue.trim()
                                ? 'bg-[#C21807] text-white shadow-md active:scale-90'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send size={15} className="ml-0.5" />
                        </button>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
};
