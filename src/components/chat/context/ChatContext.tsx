import React, { createContext, useContext, useState } from 'react';
import { Conversation, Message, NotificationItem, ReturnSchedule, IssueReport, ActiveScreen } from '../../../types';

interface ChatContextType {
    conversations: Conversation[];
    messages: Record<string, Message[]>;
    notifications: NotificationItem[];
    activeConversationId: string | null;
    currentScreen: 'messages' | 'chat' | 'notifications' | 'schedule-return' | 'report-issue' | 'booking-details';
    activeSchedule: ReturnSchedule | null;
    reportedIssues: IssueReport[];
    navigate: (screen: ChatContextType['currentScreen'], conversationId?: string) => void;
    sendMessage: (convId: string, text?: string, image?: string, locationCard?: Message['locationCard']) => void;
    markNotificationsAsRead: () => void;
    markNotificationAsRead: (id: string) => void;
    scheduleReturn: (schedule: ReturnSchedule) => void;
    submitIssue: (report: IssueReport) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const seedUsers = {
    sarah: { id: 'sarah', name: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', isVerified: true, isOnline: true },
    sierra: { id: 'sierra', name: 'Sierra J.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', isVerified: true, isOnline: true },
    marcus: { id: 'marcus', name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isVerified: false, isOnline: false },
    chloe: { id: 'chloe', name: 'Chloe Wright', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', isVerified: true, isOnline: true },
    jordan: { id: 'jordan', name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', isVerified: false, isOnline: false },
};

const initialConversations: Conversation[] = [
    {
        id: 'sarah',
        user: seedUsers.sarah,
        lastMessage: 'Of course! Here is the lobby area. I\'ll leave the bag at the concierge desk under your name...',
        timestamp: '10:15 AM',
        unreadCount: 0,
        bookingStatus: 'Active Rental',
        itemName: 'Prada Cleo Shoulder Bag',
        itemImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=300',
    },
    {
        id: 'sierra',
        user: seedUsers.sierra,
        lastMessage: 'Hey! Is the red blazer still available for this Friday?',
        timestamp: '2m ago',
        unreadCount: 1,
        bookingStatus: 'Rental Ending Soon',
        itemName: 'Velvet Night Blazer',
        itemImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300',
    },
    {
        id: 'marcus',
        user: seedUsers.marcus,
        lastMessage: 'The drop-off at the student center worked perfectly. Thanks!',
        timestamp: '1h ago',
        unreadCount: 0,
        bookingStatus: 'Completed',
        itemName: 'Classic Charcoal Trench',
        itemImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300',
    },
    {
        id: 'chloe',
        user: seedUsers.chloe,
        lastMessage: 'Sent you the rental agreement for the Dior bag!',
        timestamp: '4h ago',
        unreadCount: 2,
        bookingStatus: 'Booking Pending',
        itemName: 'Lady Dior Micro Bag',
        itemImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=300',
    },
    {
        id: 'jordan',
        user: seedUsers.jordan,
        lastMessage: 'Great pieces! Just followed your closet.',
        timestamp: 'Yesterday',
        unreadCount: 0,
        bookingStatus: 'Inquiry',
        itemName: 'Vintage Leather Moto Jacket',
        itemImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=300',
    },
];

const initialMessages: Record<string, Message[]> = {
    sarah: [
        {
            id: 'm1',
            senderId: 'sarah',
            text: "Hi there! The Prada bag is all ready for you. I've just finished the professional cleaning. Are you still okay to pick it up this afternoon?",
            timestamp: '09:42 AM',
            isRead: true,
        },
        {
            id: 'm2',
            senderId: 'buyer',
            text: "That's amazing, thank you! Yes, I can come by around 4 PM. Could you send over the exact pickup location again?",
            timestamp: '09:45 AM',
            isRead: true,
        },
        {
            id: 'm3',
            senderId: 'sarah',
            text: "Of course! Here is the lobby area. I'll leave the bag at the concierge desk under your name. See you soon!",
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600',
            timestamp: '10:15 AM',
            isRead: true,
        },
    ],
    sierra: [
        {
            id: 'm_sierra1',
            senderId: 'sierra',
            text: 'Hey! Is the red blazer still available for this Friday?',
            timestamp: '2m ago',
            isRead: false,
        },
    ],
    marcus: [
        {
            id: 'm_marcus1',
            senderId: 'buyer',
            text: 'Hey Marcus, hope you loved the trench coat! Let me know if everything is alright with it.',
            timestamp: 'Yesterday, 4:00 PM',
            isRead: true,
        },
        {
            id: 'm_marcus2',
            senderId: 'marcus',
            text: 'The drop-off at the student center worked perfectly. Thanks!',
            timestamp: '1h ago',
            isRead: true,
        },
    ],
    chloe: [
        {
            id: 'm_chloe1',
            senderId: 'chloe',
            text: 'Hi! I saw you requested the Lady Dior bag.',
            timestamp: '5h ago',
            isRead: true,
        },
        {
            id: 'm_chloe2',
            senderId: 'chloe',
            text: 'Sent you the rental agreement for the Dior bag!',
            timestamp: '4h ago',
            isRead: false,
        },
    ],
    jordan: [
        {
            id: 'm_jordan1',
            senderId: 'jordan',
            text: 'Great pieces! Just followed your closet.',
            timestamp: 'Yesterday',
            isRead: true,
        },
    ],
};

const initialNotifications: NotificationItem[] = [
    {
        id: 'n1',
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed',
        description: "Your rental for the 'Midnight Velvet Gala Dress' has been confirmed. Get ready to shine!",
        timestamp: '2m ago',
        timeLabel: 'Today',
        isRead: false,
    },
    {
        id: 'n2',
        type: 'NEW_MESSAGE',
        title: 'New Message',
        description: "Sarah sent you a message regarding the 'Prada Mini' return process.",
        timestamp: '45m ago',
        timeLabel: 'Today',
        isRead: false,
    },
    {
        id: 'n3',
        type: 'RENTAL_REMINDER',
        title: 'Rental Reminder',
        description: "Reminder: Your 'Gucci Dionysus' rental ends tomorrow. Please prepare for return shipping.",
        timestamp: 'Yesterday, 6:00 PM',
        timeLabel: 'Yesterday',
        isRead: true,
    },
    {
        id: 'n4',
        type: 'PROMO',
        title: 'Exclusive Weekend Pass',
        description: 'Enjoy 20% off all designer accessories this weekend. Use code ZIGSYSTYLE at checkout.',
        timestamp: 'Yesterday, 10:15 AM',
        timeLabel: 'Yesterday',
        isRead: true,
        itemImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=500',
    },
    {
        id: 'n5',
        type: 'SYSTEM',
        title: 'System Update',
        description: 'Our privacy policy has been updated. Review the changes in your settings panel.',
        timestamp: '3 days ago',
        timeLabel: 'Earlier',
        isRead: true,
    },
    {
        id: 'n6',
        type: 'RETURN_REMINDER',
        title: 'Rental Completed',
        description: "Thank you for returning the 'Versace Silk Shirt'. We hope you enjoyed wearing it!",
        timestamp: '5 days ago',
        timeLabel: 'Earlier',
        isRead: true,
    },
];

interface ChatProviderProps {
    children: React.ReactNode;
    activeSubScreen: ActiveScreen;
    setActiveSubScreen: (screen: ActiveScreen) => void;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, activeSubScreen, setActiveSubScreen }) => {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
    const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [activeSchedule, setActiveSchedule] = useState<ReturnSchedule | null>(null);
    const [reportedIssues, setReportedIssues] = useState<IssueReport[]>([]);

    const currentScreenMap: Record<string, ChatContextType['currentScreen']> = {
        'chat-inbox': 'messages',
        'chat-screen': 'chat',
        'chat-booking-details': 'booking-details',
        'chat-schedule-return': 'schedule-return',
        'chat-report-issue': 'report-issue',
        'chat-notifications': 'notifications',
    };
    const currentScreen = currentScreenMap[activeSubScreen] || 'messages';

    const activeScreenMap: Record<ChatContextType['currentScreen'], ActiveScreen> = {
        'messages': 'chat-inbox',
        'chat': 'chat-screen',
        'booking-details': 'chat-booking-details',
        'schedule-return': 'chat-schedule-return',
        'report-issue': 'chat-report-issue',
        'notifications': 'chat-notifications',
    };

    const navigate = (screen: ChatContextType['currentScreen'], conversationId?: string) => {
        const targetScreen = activeScreenMap[screen];
        if (targetScreen) {
            setActiveSubScreen(targetScreen);
        }
        if (conversationId) {
            setActiveConversationId(conversationId);
            // Mark conversation as read
            setConversations((prev) =>
                prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
            );
        }
    };

    const sendMessage = (convId: string, text?: string, image?: string, locationCard?: Message['locationCard']) => {
        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId: 'buyer',
            text,
            image,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
            locationCard,
        };

        setMessages((prev) => ({
            ...prev,
            [convId]: [...(prev[convId] || []), newMessage],
        }));

        // Update last message in conversation list
        setConversations((prev) => {
            const sorted = prev.map((c) => {
                if (c.id === convId) {
                    return {
                        ...c,
                        lastMessage: text || (image ? '📷 Sent an image' : '📍 Shared a location'),
                        timestamp: 'Just now',
                    };
                }
                return c;
            });
            // Move active conversation to the top
            const activeIdx = sorted.findIndex((c) => c.id === convId);
            if (activeIdx > 0) {
                const activeItem = sorted[activeIdx];
                const rest = sorted.filter((_, idx) => idx !== activeIdx);
                return [activeItem, ...rest];
            }
            return sorted;
        });

        // Simulate an automatic polite response from Sarah after a brief delay if it is her chat
        if (convId === 'sarah' && !locationCard) {
            setTimeout(() => {
                const autoResponse: Message = {
                    id: `msg_auto_${Date.now()}`,
                    senderId: 'sarah',
                    text: "Perfect! I have noted that down. Let me know if anything else comes up. ✨",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isRead: true,
                };
                setMessages((prev) => ({
                    ...prev,
                    sarah: [...(prev.sarah || []), autoResponse],
                }));
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === 'sarah'
                            ? {
                                ...c,
                                lastMessage: "Perfect! I have noted that down. Let me know if anything else...",
                                timestamp: 'Just now',
                            }
                            : c
                    )
                );
            }, 2000);
        }
    };

    const markNotificationsAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    };

    const scheduleReturn = (schedule: ReturnSchedule) => {
        setActiveSchedule(schedule);

        // Create a notification
        const newNotif: NotificationItem = {
            id: `notif_${Date.now()}`,
            type: 'RETURN_REMINDER',
            title: 'Return Scheduled',
            description: `Your meeting at ${schedule.location} is set for ${schedule.date} at ${schedule.timeSlot}.`,
            timestamp: 'Just now',
            timeLabel: 'Today',
            isRead: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);

        // Send a message in active chat if available
        if (activeConversationId) {
            sendMessage(activeConversationId, undefined, undefined, {
                location: schedule.location,
                date: schedule.date,
                time: schedule.timeSlot,
                status: 'confirmed',
            });
        }
    };

    const submitIssue = (report: IssueReport) => {
        setReportedIssues((prev) => [...prev, report]);

        // Create a system confirmation notification
        const newNotif: NotificationItem = {
            id: `notif_${Date.now()}`,
            type: 'SYSTEM',
            title: 'Support Ticket Raised',
            description: `Your report regarding the '${report.category}' issue has been logged. We will review it shortly.`,
            timestamp: 'Just now',
            timeLabel: 'Today',
            isRead: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);
    };

    return (
        <ChatContext.Provider
            value={{
                conversations,
                messages,
                notifications,
                activeConversationId,
                currentScreen,
                activeSchedule,
                reportedIssues,
                navigate,
                sendMessage,
                markNotificationsAsRead,
                markNotificationAsRead,
                scheduleReturn,
                submitIssue,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
