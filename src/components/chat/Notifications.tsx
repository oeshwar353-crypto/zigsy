import React from 'react';
import { useChat } from './context/ChatContext';
import {
    CheckCircle,
    MessageSquare,
    Calendar,
    Sparkles,
    ShoppingBag,
    Bell,
    ArrowLeft,
    Settings,
    X,
    CreditCard,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Notifications: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    const { notifications, markNotificationsAsRead, markNotificationAsRead, navigate } = useChat();

    // Group notifications
    const todayNotifications = notifications.filter((n) => n.timeLabel === 'Today');
    const yesterdayNotifications = notifications.filter((n) => n.timeLabel === 'Yesterday');
    const earlierNotifications = notifications.filter((n) => n.timeLabel === 'Earlier');

    const getIcon = (type: string) => {
        switch (type) {
            case 'BOOKING_CONFIRMED':
            case 'SELLER_ACCEPTED':
                return <CheckCircle size={20} className="text-[#C21807]" />;
            case 'PAYMENT_SUCCESSFUL':
            case 'DEPOSIT_REFUNDED':
                return <CreditCard size={20} className="text-green-600" />;
            case 'NEW_MESSAGE':
                return <MessageSquare size={20} className="text-gray-600" />;
            case 'RENTAL_REMINDER':
            case 'RETURN_REMINDER':
                return <Calendar size={20} className="text-amber-600" />;
            case 'PROMO':
                return <Sparkles size={20} className="text-white" />;
            case 'SYSTEM':
                return <ShieldCheck size={20} className="text-blue-600" />;
            default:
                return <ShoppingBag size={20} className="text-gray-600" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'BOOKING_CONFIRMED':
            case 'SELLER_ACCEPTED':
                return 'bg-red-50';
            case 'PAYMENT_SUCCESSFUL':
            case 'DEPOSIT_REFUNDED':
                return 'bg-green-50';
            case 'NEW_MESSAGE':
                return 'bg-gray-100';
            case 'RENTAL_REMINDER':
            case 'RETURN_REMINDER':
                return 'bg-amber-50';
            case 'PROMO':
                return 'bg-[#C21807]';
            case 'SYSTEM':
                return 'bg-blue-50';
            default:
                return 'bg-gray-100';
        }
    };

    const handleNotificationClick = (n: any) => {
        markNotificationAsRead(n.id);
        if (n.type === 'NEW_MESSAGE') {
            navigate('chat', 'sarah');
        } else if (n.type === 'BOOKING_CONFIRMED') {
            navigate('booking-details', 'sarah');
        }
    };

    const hasUnread = notifications.some((n) => !n.isRead);

    const NotificationCard = ({ item }: { item: typeof notifications[0]; key?: string }) => (
        <div
            onClick={() => handleNotificationClick(item)}
            className={`relative group rounded-3xl p-4 flex gap-3.5 border transition-all duration-300 cursor-pointer ${!item.isRead
                ? 'bg-white border-gray-100 shadow-[0_4px_16px_rgba(194,24,7,0.03)]'
                : 'bg-gray-50/50 border-transparent opacity-90 hover:bg-white hover:border-gray-100 hover:shadow-sm'
                }`}
        >
            {/* Icon Area */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getIconBg(item.type)}`}>
                {getIcon(item.type)}
            </div>

            {/* Text Details */}
            <div className="flex-1 space-y-1 min-w-0 pr-2">
                <div className="flex justify-between items-start gap-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                    <span className="text-[10px] text-gray-400 font-medium shrink-0 pt-0.5">{item.timestamp}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">{item.description}</p>

                {/* Action Button inside notification */}
                {item.type === 'BOOKING_CONFIRMED' && !item.isRead && (
                    <div className="pt-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(item);
                            }}
                            className="bg-[#C21807] hover:bg-[#A31405] text-white px-5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all active:scale-95 duration-150 shadow-sm"
                        >
                            View Details
                        </button>
                    </div>
                )}

                {/* Inline Promo Image */}
                {item.itemImage && (
                    <div className="mt-2.5 h-32 w-full rounded-2xl overflow-hidden border border-gray-100">
                        <img src={item.itemImage} alt="Promo banner" className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-700" />
                    </div>
                )}
            </div>

            {/* Unread dot */}
            {!item.isRead && (
                <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#C21807] rounded-full ring-4 ring-white"></span>
            )}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 w-full max-w-md mx-auto bg-white flex flex-col h-full overflow-hidden"
        >
            {/* Header */}
            <header className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack || (() => navigate('messages'))}
                        className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-700 active:scale-95 duration-150 cursor-pointer"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notifications</h1>
                </div>

            </header>

            {/* Notifications Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 space-y-6">
                {/* Today Section */}
                {todayNotifications.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Today</h3>
                            {hasUnread && (
                                <button
                                    onClick={markNotificationsAsRead}
                                    className="text-xs font-bold text-[#C21807] hover:text-[#A31405] transition-colors"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {todayNotifications.map((notif) => (
                                <NotificationCard key={notif.id} item={notif} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Yesterday Section */}
                {yesterdayNotifications.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Yesterday</h3>
                        <div className="space-y-3">
                            {yesterdayNotifications.map((notif) => (
                                <NotificationCard key={notif.id} item={notif} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Earlier Section */}
                {earlierNotifications.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Earlier</h3>
                        <div className="space-y-3">
                            {earlierNotifications.map((notif) => (
                                <NotificationCard key={notif.id} item={notif} />
                            ))}
                        </div>
                    </div>
                )}

                {notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
                            <Bell size={24} />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Stay tuned</h3>
                        <p className="text-xs text-gray-500 max-w-xs">
                            We'll notify you here about rental events, active contracts, and custom promo passes!
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
