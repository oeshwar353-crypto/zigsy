import React, { useState } from 'react';
import { useChat } from './context/ChatContext';
import { Search, MoreVertical, BadgeCheck, CheckCheck, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const Messages: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const { conversations, navigate } = useChat();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'rented' | 'verified'>('all');

    const filteredConversations = conversations.filter((c) => {
        // Search filter
        const matchesSearch =
            c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Tab filter
        if (activeFilter === 'unread') return c.unreadCount > 0;
        if (activeFilter === 'rented') return c.bookingStatus === 'Active Rental' || c.bookingStatus === 'Rental Ending Soon' || c.bookingStatus === 'Completed';
        if (activeFilter === 'verified') return c.user.isVerified;

        return true;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 w-full max-w-md mx-auto bg-white flex flex-col h-full overflow-hidden"
        >
            {/* Header */}
            <header className="px-4 py-4 flex items-center gap-2 border-b border-gray-100 bg-white sticky top-0 z-10">
                <button
                    onClick={onExit}
                    className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-700 active:scale-95 duration-150 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex-1">Messages</h1>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>

            {/* Search and Filters */}
            <div className="px-4 py-3 bg-white space-y-3 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border-none rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-cherry transition-all duration-200"
                        style={{ '--tw-ring-color': '#C21807' } as React.CSSProperties}
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {(['all', 'unread', 'rented', 'verified'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide capitalize transition-all duration-200 ${activeFilter === filter
                                ? 'bg-[#C21807] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {filter === 'all' ? 'All' : filter === 'verified' ? 'Verified Only' : filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-2.5">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map((c, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.25 }}
                            key={c.id}
                            onClick={() => navigate('chat', c.id)}
                            className={`flex gap-3.5 p-3.5 rounded-[22px] border transition-all duration-300 cursor-pointer active:scale-[0.98] ${c.unreadCount > 0
                                ? 'bg-white border-gray-100 shadow-[0_4px_16px_rgba(194,24,7,0.04)]'
                                : 'bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-100 hover:shadow-sm'
                                }`}
                        >
                            {/* Avatar & Online status */}
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100">
                                    <img src={c.user.avatar} referrerPolicy="no-referrer" alt={c.user.name} className="w-full h-full object-cover" />
                                </div>
                                {c.user.isOnline && (
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></span>
                                )}
                            </div>

                            {/* Message Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div className="flex justify-between items-start gap-1">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-[15px] truncate">{c.user.name}</h3>
                                        {c.user.isVerified && (
                                            <BadgeCheck size={16} className="text-[#C21807] shrink-0" fill="currentColor" style={{ color: '#C21807', fill: '#fff' }} />
                                        )}
                                    </div>
                                    <span className={`text-[11px] shrink-0 font-medium ${c.unreadCount > 0 ? 'text-[#C21807]' : 'text-gray-400'}`}>
                                        {c.timestamp}
                                    </span>
                                </div>

                                <div className="flex justify-between items-end gap-2 mt-1">
                                    <p className={`text-[13px] truncate flex-1 ${c.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                        {c.lastMessage}
                                    </p>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {/* Read status icon */}
                                        {c.unreadCount === 0 && (
                                            c.id === 'sarah' ? (
                                                <CheckCheck size={14} className="text-[#C21807]" />
                                            ) : (
                                                <Check size={14} className="text-gray-400" />
                                            )
                                        )}

                                        {/* Unread Badge */}
                                        {c.unreadCount > 0 && (
                                            <span className="min-w-[18px] h-[18px] px-1 bg-[#C21807] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {c.unreadCount}
                                            </span>
                                        )}

                                        {/* Item Thumbnail */}
                                        <div className="w-7 h-8 rounded-md overflow-hidden bg-gray-100 border border-gray-100 ml-1">
                                            <img src={c.itemImage} referrerPolicy="no-referrer" alt={c.itemName} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
                            <Search size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">No chats found</h3>
                        <p className="text-xs text-gray-500 max-w-xs">
                            Try adjusting your search criteria or filter tabs to find the conversation.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
