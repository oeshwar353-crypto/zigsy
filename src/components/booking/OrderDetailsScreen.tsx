import React, { useState } from 'react';
import { useBooking } from './BookingContext';
import { ActiveScreen } from '../../types';
import { ArrowLeft, Calendar, MapPin, Truck, Store, MessageSquare, Send, X, ShieldAlert, Sparkles, CheckCircle2, Download } from 'lucide-react';
import { useChat } from '../chat/context/ChatContext';
interface OrderDetailsScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
}

interface TempMsg {
    id: string;
    sender: 'buyer' | 'seller';
    text: string;
    time: string;
}

export default function OrderDetailsScreen({ onNavigate }: OrderDetailsScreenProps) {
    const { selectedOrder, cancelOrder } = useBooking();
    const { navigate: chatNavigate } = useChat();
    const [invoiceSuccess, setInvoiceSuccess] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<TempMsg[]>([
        { id: '1', sender: 'seller', text: `Hi there! I've received your booking request for the ${selectedOrder?.outfit.name || 'outfit'}. I'm getting it dry-cleaned and ready for your rental period!`, time: '10:30 AM' },
        { id: '2', sender: 'buyer', text: 'Thank you so much! Looking forward to it.', time: '10:32 AM' }
    ]);

    if (!selectedOrder) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>No order selected.</p>
            </div>
        );
    }

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        const newMsg: TempMsg = {
            id: `msg-${Date.now()}`,
            sender: 'buyer',
            text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
        setChatInput('');

        // Simulate seller quick reply
        setTimeout(() => {
            const sellerReply: TempMsg = {
                id: `msg-${Date.now() + 1}`,
                sender: 'seller',
                text: 'Got it! I will update the tracking status once it is dispatched.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, sellerReply]);
        }, 1200);
    };

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-container h-16 flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <button
                    onClick={() => onNavigate('my-orders')}
                    className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-sans font-extrabold text-xl tracking-tight text-on-surface">
                    Booking Invoice
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="max-w-md mx-auto pt-24 px-4 space-y-6">
                {/* Status Card Banner */}
                <section className={`rounded-3xl p-5 border text-center flex flex-col items-center justify-center ${
                    selectedOrder.status === 'active'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : selectedOrder.status === 'completed'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : selectedOrder.status === 'cancelled'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                }`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest block">Booking Status</span>
                    <h3 className="font-black text-2xl capitalize mt-1">{selectedOrder.status}</h3>
                    <p className="text-[10px] text-on-surface-variant mt-2 font-semibold">
                        Reference ID: <span className="font-bold text-on-surface">{selectedOrder.id}</span>
                    </p>
                </section>

                {/* Outfit Details Card */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm flex gap-4">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-surface-container">
                        <img
                            src={selectedOrder.outfit.image}
                            alt={selectedOrder.outfit.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-grow">
                        <div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{selectedOrder.outfit.brand}</p>
                            <h3 className="font-bold text-sm text-on-surface mt-0.5">{selectedOrder.outfit.name}</h3>
                            <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase">
                                Seller: {selectedOrder.outfit.sellerName}
                            </p>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <div className="flex items-baseline gap-1">
                                <span className="font-extrabold text-base text-primary">₹{selectedOrder.outfit.pricePerDay}</span>
                                <span className="text-[10px] text-on-surface-variant">/ day</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Booking Dates & Extension info if applicable */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm space-y-4">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase pb-3 border-b border-surface-container">Rental Period</h3>
                    
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 font-semibold">
                            <Calendar className="w-4 h-4 text-primary shrink-0" />
                            <span>Rental Duration:</span>
                        </div>
                        <span className="font-bold text-on-surface">{selectedOrder.rentalDays} days</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-on-surface-variant">Selected Dates:</span>
                        <span className="font-bold text-on-surface">{selectedOrder.startDate} to {selectedOrder.endDate}</span>
                    </div>

                    {selectedOrder.extendedReturnDate && (
                        <div className="bg-primary/5 p-3.5 rounded-2xl border border-primary/10 space-y-2 animate-slide-up">
                            <div className="flex items-center gap-1.5 text-primary font-bold text-[10px] uppercase">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Extension Active</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-on-surface-variant font-semibold">Extended Days:</span>
                                <span className="font-bold text-primary">+{selectedOrder.extensionDays} days</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-on-surface-variant font-semibold">Extension Cost Charged:</span>
                                <span className="font-bold text-primary">₹{selectedOrder.extensionCost?.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Delivery details */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm space-y-4">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase pb-3 border-b border-surface-container">Logistics</h3>
                    
                    <div className="flex items-start gap-3 text-xs">
                        {selectedOrder.deliveryOption === 'home' ? (
                            <>
                                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block">Home Delivery Address</span>
                                    <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1 font-semibold">
                                        {selectedOrder.address}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Store className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold block">Local Store Pickup</span>
                                    <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1 font-semibold">
                                        Vivekananda Global University, Admin Block Lawn
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Price Summary Breakdown / Cancellation Summary */}
                <section className="bg-white rounded-3xl p-5 border border-surface-container shadow-sm space-y-4">
                    <h3 className="font-extrabold text-xs tracking-wider text-on-surface-variant uppercase pb-3 border-b border-surface-container">Invoice breakdown</h3>
                    
                    <div className="space-y-2 text-xs font-semibold text-on-surface-variant">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="text-on-surface font-bold">₹{((selectedOrder.rentalDays - (selectedOrder.extensionDays || 0)) * selectedOrder.outfit.pricePerDay).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Refundable Deposit:</span>
                            <span className="text-on-surface font-bold">₹{selectedOrder.securityDeposit.toLocaleString()}</span>
                        </div>
                        {selectedOrder.extensionCost && (
                            <div className="flex justify-between">
                                <span>Extension Cost:</span>
                                <span className="text-on-surface font-bold">₹{selectedOrder.extensionCost.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xs text-on-surface font-black pt-3 border-t border-surface-container">
                            <span>Amount Charged:</span>
                            <span className="text-primary text-sm">₹{selectedOrder.amount.toLocaleString()}</span>
                        </div>
                    </div>

                    {selectedOrder.status === 'cancelled' && (
                        <div className="bg-red-50 p-4.5 rounded-2xl border border-red-100 mt-4 space-y-2 animate-slide-up">
                            <div className="flex items-center gap-1.5 text-red-600 font-bold text-[10px] uppercase">
                                <ShieldAlert className="w-4 h-4" />
                                <span>Booking Cancelled</span>
                            </div>
                            <p className="text-[10px] text-on-surface-variant font-semibold">
                                Reason: "{selectedOrder.cancellationReason}"
                            </p>
                            <div className="flex justify-between text-xs border-t border-red-200/50 pt-2 font-bold text-red-700">
                                <span>Refund Processed:</span>
                                <span>₹{selectedOrder.cancellationRefund?.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Invoice Download Toast Notification */}
                {invoiceSuccess && (
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce text-xs">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Receipt downloaded as ZGS-{selectedOrder.id}-invoice.pdf</span>
                    </div>
                )}

                {/* Flow Control Action Buttons */}
                <section className="space-y-3">
                    <button
                        onClick={() => {
                            chatNavigate('chat', 'sarah');
                        }}
                        className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-sm shadow-md shadow-primary/20 hover:opacity-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span>Chat with Seller</span>
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onNavigate('order-tracking')}
                            className="py-3.5 bg-white border border-surface-container rounded-2xl font-bold text-xs hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-center gap-1.5 text-on-surface"
                        >
                            <Truck className="w-4 h-4 text-primary" />
                            <span>Track Order</span>
                        </button>

                        <button
                            onClick={() => {
                                chatNavigate('schedule-return', 'sarah');
                            }}
                            className="py-3.5 bg-white border border-surface-container rounded-2xl font-bold text-xs hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-center gap-1.5 text-on-surface"
                        >
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>Schedule Return</span>
                        </button>

                        <button
                            onClick={() => {
                                chatNavigate('report-issue', 'sarah');
                            }}
                            className="py-3.5 bg-white border border-surface-container rounded-2xl font-bold text-xs hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-center gap-1.5 text-on-surface animate-pulse"
                        >
                            <ShieldAlert className="w-4 h-4 text-primary" />
                            <span>Report Issue</span>
                        </button>

                        <button
                            onClick={() => {
                                setInvoiceSuccess(true);
                                setTimeout(() => setInvoiceSuccess(false), 2500);
                            }}
                            className="py-3.5 bg-white border border-surface-container rounded-2xl font-bold text-xs hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-center gap-1.5 text-on-surface"
                        >
                            <Download className="w-4 h-4 text-primary" />
                            <span>Invoice</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={() => onNavigate('order-extension')}
                            disabled={selectedOrder.status === 'cancelled' || selectedOrder.status === 'completed'}
                            className={`py-2 rounded-xl border font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedOrder.status === 'cancelled' || selectedOrder.status === 'completed'
                                    ? 'border-surface-container-highest text-on-surface-variant/40 cursor-not-allowed bg-surface-container-low'
                                    : 'border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 active:scale-95 duration-150'
                            }`}
                        >
                            Extend Rental
                        </button>
                        
                        <button
                            onClick={() => onNavigate('order-cancellation')}
                            disabled={selectedOrder.status !== 'upcoming'}
                            className={`py-2 rounded-xl border font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                selectedOrder.status !== 'upcoming'
                                    ? 'border-surface-container-highest text-on-surface-variant/40 cursor-not-allowed bg-surface-container-low'
                                    : 'border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 active:scale-95 duration-150'
                            }`}
                        >
                            Cancel Booking
                        </button>
                    </div>
                </section>
            </main>

            {/* Chat Dialog Drawer */}
            {isChatOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end flex-col animate-fade-in">
                    <div className="bg-white rounded-t-[32px] max-w-md w-full mx-auto h-[80vh] flex flex-col shadow-2xl animate-slide-up border-t border-surface-container">
                        {/* Drawer Header */}
                        <div className="flex justify-between items-center p-5 border-b border-surface-container">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary">
                                    <img
                                        src={selectedOrder.outfit.sellerImage}
                                        alt={selectedOrder.outfit.sellerName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-sm">{selectedOrder.outfit.sellerName}</h4>
                                    <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="p-2 bg-surface-container hover:bg-surface-container-high rounded-full cursor-pointer text-on-surface-variant transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Drawer Messages list */}
                        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-surface">
                            {messages.map((msg) => {
                                const isMe = msg.sender === 'buyer';
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-scale-up`}
                                    >
                                        <div className={`max-w-[75%] p-4.5 rounded-3xl text-xs font-semibold leading-relaxed shadow-sm ${
                                            isMe 
                                                ? 'bg-primary text-white rounded-tr-none' 
                                                : 'bg-white border border-surface-container text-on-surface rounded-tl-none'
                                        }`}>
                                            <p>{msg.text}</p>
                                            <span className={`text-[8px] mt-1.5 block text-right font-medium ${isMe ? 'text-white/60' : 'text-on-surface-variant/75'}`}>
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Drawer Input */}
                        <div className="p-4 border-t border-surface-container bg-white flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="type message here..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-grow bg-surface-container-low border border-surface-container focus:border-primary rounded-2xl py-3.5 px-4 text-xs font-semibold text-on-surface outline-none"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="p-3.5 bg-primary hover:opacity-95 text-white rounded-2xl transition-all cursor-pointer active:scale-95 duration-150"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
