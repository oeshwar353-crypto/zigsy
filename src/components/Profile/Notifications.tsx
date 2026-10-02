/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useProfile } from './components/ProfileContext';
import { NotificationType, NotificationItem } from '../../types';
import {
    Calendar,
    CreditCard,
    MessageCircle,
    AlertCircle,
    Sparkles,
    Bell,
    Check,
    Trash2,
    ChevronRight,
    Info
} from 'lucide-react';

export default function Notifications() {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useProfile();

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'booking':
                return <Calendar className="w-5 h-5 text-blue-600" />;
            case 'payment':
                return <CreditCard className="w-5 h-5 text-green-600" />;
            case 'chat':
                return <MessageCircle className="w-5 h-5 text-purple-600" />;
            case 'returns':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'promotions':
                return <Sparkles className="w-5 h-5 text-amber-600" />;
            default:
                return <Info className="w-5 h-5 text-gray-600" />;
        }
    };

    // Group notifications
    const groups: { label: 'Today' | 'Yesterday' | 'Earlier'; items: NotificationItem[] }[] = [
        { label: 'Today', items: notifications.filter(n => n.group === 'Today') },
        { label: 'Yesterday', items: notifications.filter(n => n.group === 'Yesterday') },
        { label: 'Earlier', items: notifications.filter(n => n.group === 'Earlier') }
    ];

    return (
        <div id="notifications-screen" className="pb-20 max-w-lg mx-auto">
            {/* Header with Mark All as Read */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">Notification Center</h2>
                    <p className="text-xs text-text-secondary mt-1">
                        Stay updated with your campus fashion bookings and hand-offs.
                    </p>
                </div>

                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs font-bold text-brand-cherry hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                        <Check className="w-4.5 h-4.5" />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notification Lists Grouped by date */}
            <div className="space-y-6">
                {notifications.length > 0 ? (
                    groups.map((group) => {
                        if (group.items.length === 0) return null;
                        return (
                            <div key={group.label} className="space-y-3 animate-fade-in">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-1">
                                    {group.label}
                                </span>

                                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs divide-y divide-gray-100">
                                    {group.items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => markNotificationAsRead(item.id)}
                                            className={`p-4 flex gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors relative ${!item.isRead ? 'bg-brand-cherry/[0.02]' : ''
                                                }`}
                                        >
                                            {/* Left Icon Panel */}
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                {getNotificationIcon(item.type)}
                                            </div>

                                            {/* Content panel */}
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-start justify-between gap-1">
                                                    <h4 className={`text-sm text-text-primary ${!item.isRead ? 'font-bold' : 'font-semibold'}`}>
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-[10px] text-text-secondary font-medium shrink-0 whitespace-nowrap">
                                                        {item.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Right indicator dots for read/unread */}
                                            {!item.isRead && (
                                                <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-cherry" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* Empty Notifications State */
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-6">
                        <Bell className="w-10 h-10 text-text-secondary/40 mx-auto mb-3" />
                        <p className="text-base font-bold text-text-primary">All caught up!</p>
                        <p className="text-xs text-text-secondary mt-1.5 max-w-xs mx-auto">
                            Any alerts regarding active bookings, messages, and student promos will be delivered here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
