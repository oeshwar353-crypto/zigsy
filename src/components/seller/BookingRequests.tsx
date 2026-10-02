import React, { useState, useRef, useEffect } from 'react';
import { useSeller } from './SellerContext';
import {
    Star,
    MessageSquare,
    ArrowLeft,
    Send,
    Sparkles,
    Check,
    X,
    AlertCircle,
    HelpCircle
} from 'lucide-react';
import { BookingRequest } from '../../types';

export default function BookingRequests() {
    const {
        bookingRequests,
        acceptBookingRequest,
        rejectBookingRequest,
        sendMessageToBuyer
    } = useSeller();

    // Chat overlay state
    const [chatRequestId, setChatRequestId] = useState<string | null>(null);
    const [typedMessage, setTypedMessage] = useState('');

    const chatMessagesEndRef = useRef<HTMLDivElement>(null);

    const activeChatRequest = bookingRequests.find(r => r.id === chatRequestId);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatMessagesEndRef.current) {
            chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeChatRequest?.messages, chatRequestId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!typedMessage.trim() || !chatRequestId) return;

        sendMessageToBuyer(chatRequestId, typedMessage.trim());
        setTypedMessage('');

        // Simulated quick reply from the buyer for high fidelity
        setTimeout(() => {
            const buyerReplies = [
                "Thanks for the quick reply! That works perfectly for me.",
                "Perfect, thank you! I will make sure to return it in pristine condition.",
                "That sounds amazing! Appreciate you being so accommodating.",
                "Awesome! Looking forward to wearing this beautiful piece.",
                "Great! Let me know when the acceptance is confirmed."
            ];
            const randomReply = buyerReplies[Math.floor(Math.random() * buyerReplies.length)];

            // Append a mock buyer message
            sendMessageToBuyer(chatRequestId, randomReply, 'Buyer');
        }, 1500);
    };

    // Filter pending requests for the main list, and show accepted/rejected in history
    const pendingRequests = bookingRequests.filter(r => r.status === 'Pending');
    const processedRequests = bookingRequests.filter(r => r.status !== 'Pending');

    return (
        <div id="booking-requests-screen" className="animate-fade-in pb-24">
            {chatRequestId && activeChatRequest ? (
                /* Real-time Buyer Chat Portal Slide-over */
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col h-[550px] animate-slide-up">
                    {/* Chat Header */}
                    <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setChatRequestId(null)}
                                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>

                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                <img
                                    className="w-full h-full object-cover"
                                    alt={activeChatRequest.buyerName}
                                    src={activeChatRequest.buyerAvatar}
                                />
                            </div>

                            <div>
                                <h4 className="font-bold text-sm text-gray-900 leading-snug">
                                    {activeChatRequest.buyerName}
                                </h4>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Star className="w-3 h-3 text-[#C21807] fill-[#C21807]" />
                                    <span className="text-[10px] text-gray-500 font-medium">
                                        {activeChatRequest.buyerRating} • {activeChatRequest.buyerRentalsCount} rentals
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase">Inquiry</p>
                            <p className="text-xs font-bold text-[#C21807]">{activeChatRequest.listingTitle}</p>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50 custom-scrollbar">
                        <div className="text-center py-2">
                            <span className="text-[10px] text-gray-400 font-semibold bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">
                                Conversation Starter
                            </span>
                        </div>

                        {activeChatRequest.messages.map((msg) => {
                            const isMe = msg.sender === 'Seller';
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                                >
                                    <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${isMe
                                            ? 'bg-gradient-to-r from-[#bd1303] to-[#980900] text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[9px] text-gray-400 font-mono mt-1 px-1">{msg.timestamp}</span>
                                </div>
                            );
                        })}
                        <div ref={chatMessagesEndRef} />
                    </div>

                    {/* Message Input Form */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-3 items-center">
                        <input
                            type="text"
                            value={typedMessage}
                            onChange={e => setTypedMessage(e.target.value)}
                            placeholder={`Send a reply to ${activeChatRequest.buyerName}...`}
                            className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs focus:ring-2 focus:ring-[#C21807]/20 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!typedMessage.trim()}
                            className="p-3 bg-gradient-to-r from-[#bd1303] to-[#980900] text-white rounded-2xl shadow-md disabled:opacity-40 active:scale-95 transition-all duration-200"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            ) : (
                /* Booking Requests Screen */
                <>
                    {/* Section Description */}
                    <section className="mb-6 pt-4">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-sans">
                            Booking Requests
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage your incoming rental requests and growing fashion empire.
                        </p>
                    </section>

                    {/* Pending Requests List */}
                    {pendingRequests.length > 0 ? (
                        <div className="space-y-6">
                            {pendingRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-transform hover:scale-[1.01] duration-300 relative overflow-hidden"
                                >
                                    {/* Card Header: Buyer info */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ffdad6]">
                                                <img className="w-full h-full object-cover" alt={request.buyerName} src={request.buyerAvatar} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 leading-tight">{request.buyerName}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Star className="w-3.5 h-3.5 text-[#b7131a] fill-[#b7131a]" />
                                                    <span className="text-xs text-gray-500 font-semibold">
                                                        {request.buyerRating} <span className="font-normal text-gray-400">({request.buyerRentalsCount} rentals)</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${request.isExpiringSoon
                                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                                : 'bg-[#ffdad6] text-[#410002]'
                                            }`}>
                                            {request.isExpiringSoon ? 'Expiring soon' : 'New Request'}
                                        </span>
                                    </div>

                                    {/* Outfit Info Segment */}
                                    <div className="flex gap-4 mb-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                                            <img className="w-full h-full object-cover" alt={request.listingTitle} src={request.listingImage} />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold text-sm text-gray-900">{request.listingTitle}</h4>
                                            <p className="text-xs text-gray-400 font-medium mt-1">Rental: {request.startDate} - {request.endDate}</p>
                                            <p className="text-xl font-bold text-[#C21807] font-sans mt-2">₹{request.price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Action buttons CTA bar */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => acceptBookingRequest(request.id)}
                                            className="flex-grow py-3 bg-gradient-to-r from-[#bd1303] to-[#980900] text-white font-bold text-xs rounded-xl active:scale-95 transition-all shadow shadow-[#bd1303]/10"
                                        >
                                            Accept
                                        </button>

                                        <button
                                            onClick={() => rejectBookingRequest(request.id)}
                                            className="px-5 py-3 border border-gray-300 text-gray-500 font-semibold text-xs rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
                                        >
                                            Reject
                                        </button>

                                        <button
                                            onClick={() => setChatRequestId(request.id)}
                                            className="p-3 bg-gray-100 text-[#C21807] hover:bg-[#C21807]/10 rounded-xl transition-all active:scale-90"
                                            title="Send message to buyer"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Dotted Callout empty state */
                        <div className="p-8 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-300">
                            <Sparkles className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="font-bold text-lg text-gray-800">No more pending requests</p>
                            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                                Check your listings or optimize descriptions to ensure they stay top-of-mind for luxury renters.
                            </p>
                            <button
                                onClick={() => alert('Listings boosted! Your outfits are now pinned at the top of the search feed.')}
                                className="mt-5 px-6 py-2.5 border border-[#C21807] text-[#C21807] hover:bg-[#C21807]/5 font-semibold text-xs rounded-xl transition-colors"
                            >
                                Boost Listings
                            </button>
                        </div>
                    )}

                    {/* Processed Requests History Section */}
                    {processedRequests.length > 0 && (
                        <section className="mt-10">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                Processed Requests History
                            </h3>

                            <div className="space-y-4">
                                {processedRequests.map(req => (
                                    <div key={req.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                                <img className="w-full h-full object-cover" alt={req.buyerName} src={req.buyerAvatar} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{req.buyerName}</p>
                                                <p className="text-[10px] text-gray-400">{req.listingTitle} • {req.startDate}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${req.status === 'Accepted' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                {req.status}
                                            </span>

                                            <button
                                                onClick={() => setChatRequestId(req.id)}
                                                className="p-1.5 text-gray-400 hover:text-[#C21807] rounded-lg"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
