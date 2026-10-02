import React, { createContext, useContext, useState } from 'react';
import { UserProfile, WishlistItem, RentalItem, Address, PaymentMethod, Review, NotificationItem, RentalStatus, ActiveScreen } from '../../../types';

export type ProfileScreenName =
    | 'profile-dashboard'
    | 'edit-profile'
    | 'saved-addresses'
    | 'payment-methods'
    | 'payout-methods'
    | 'reviews'
    | 'help-center'
    | 'settings'
    | 'rental-bookings'
    | 'wishlist'
    | 'terms-conditions'
    | 'privacy-policy'
    | 'student-guidelines'
    | 'handoff-guidelines'
    | 'account-privacy'
    | 'account-security'
    | 'about-zigsy';

interface ProfileContextType {
    profile: UserProfile;
    updateProfile: (newProfile: Partial<UserProfile>) => void;
    screen: ProfileScreenName;
    setScreen: (screen: ProfileScreenName) => void;
    goBack: () => void;
    
    // Address Management
    addresses: Address[];
    addAddress: (addr: Omit<Address, 'id'>) => void;
    editAddress: (id: string, addr: Omit<Address, 'id'>) => void;
    deleteAddress: (id: string) => void;
    setDefaultAddress: (id: string) => void;

    // Payment Methods
    paymentMethods: PaymentMethod[];
    addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
    removePaymentMethod: (id: string) => void;
    setPrimaryPaymentMethod: (id: string) => void;

    // Rental History
    rentals: RentalItem[];
    updateRentalStatus: (id: string, status: RentalStatus) => void;
    addRental: (rental: RentalItem) => void;

    // Wishlist
    wishlist: WishlistItem[];
    removeFromWishlist: (id: string) => void;

    // Reviews
    reviews: Review[];
    addReview: (review: Omit<Review, 'id' | 'date'>) => void;

    // Notifications
    notifications: NotificationItem[];
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;

    onSellerDashboard: () => void;
    onSignOut?: () => void;
    onNavigate: (screen: ActiveScreen) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

interface ProfileProviderProps {
    children: React.ReactNode;
    userProfile: UserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    onBackToHome: () => void;
    onSellerDashboard: () => void;
    onSignOut?: () => void;
    onNavigate: (screen: ActiveScreen) => void;
}

// Mock initial data matching components
const initialAddresses: Address[] = [
    {
        id: 'addr-1',
        label: 'Hostel Lobby (Boys)',
        type: 'Hostel',
        isDefault: true,
        detail: 'Room 304, Satpura Hostel, IIT Delhi campus, Pincode 110016'
    },
    {
        id: 'addr-2',
        label: "Parents' Home",
        type: 'Home',
        isDefault: false,
        detail: 'C-24, Green Park Extension, Near metro station, New Delhi, Pincode 110016'
    }
];

const initialPaymentMethods: PaymentMethod[] = [
    {
        id: 'pay-1',
        type: 'card',
        cardType: 'Visa Infinite',
        cardNumber: '•••• •••• •••• 8842',
        cardHolder: 'OM SHRIVASTAVA',
        expires: '09/28',
        isPrimary: true,
        provider: 'Visa'
    },
    {
        id: 'pay-2',
        type: 'upi',
        upiId: 'omshrivastava@okaxis',
        isPrimary: false,
        provider: 'GPay'
    }
];

const initialReviews: Review[] = [
    {
        id: 'rev-1',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        date: '3 days ago',
        text: 'Om returned the jacket in pristine condition! Super polite and on-time meet up at the library lobby. Would rent to him again anytime. 👍',
        type: 'received'
    },
    {
        id: 'rev-2',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        date: '1 week ago',
        text: 'Very smooth hand-off, outfit fit perfectly and got lots of compliments at the college fest!',
        type: 'given'
    }
];

const initialRentals: RentalItem[] = [
    {
        id: 'rent-1',
        name: 'Gucci Dionysus Leather Shoulder Bag',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400',
        sellerName: 'Elena V.',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        dates: 'July 2 - July 5',
        status: 'upcoming',
        amount: 90,
        startsInDays: 3
    },
    {
        id: 'rent-2',
        name: 'Saint Laurent Teddy Jacket',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
        sellerName: 'Sarah J.',
        sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        dates: 'June 28 - July 1',
        status: 'active',
        amount: 120,
        endsTomorrowText: 'Ends Tomorrow'
    },
    {
        id: 'rent-3',
        name: 'Prada Nylon Gabardine Trousers',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400',
        sellerName: 'Jordan K.',
        sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        dates: 'June 15 - June 18',
        status: 'completed',
        amount: 75
    }
];

const initialWishlist: WishlistItem[] = [
    {
        id: 'wish-1',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400',
        name: 'Midnight Velvet Gala Dress',
        brand: 'Jacquemus',
        price: 45,
        sellerName: 'Elena V.',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        rating: 4.9
    },
    {
        id: 'wish-2',
        image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=400',
        name: 'Classic Camel Trench Coat',
        brand: 'Burberry',
        price: 50,
        sellerName: 'Sarah J.',
        sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        rating: 4.8
    }
];

const initialNotifications: NotificationItem[] = [
    {
        id: 'n-1',
        type: 'booking',
        title: 'Booking Confirmed',
        description: "Your booking for 'Gucci Dionysus' has been approved by Elena. Meet up on July 2nd.",
        timestamp: '2 hours ago',
        group: 'Today',
        isRead: false
    },
    {
        id: 'n-2',
        type: 'chat',
        title: 'New Message',
        description: "Sarah J. asked: 'Could you meet near the library lobby instead of hostel?'",
        timestamp: 'Yesterday',
        group: 'Yesterday',
        isRead: true
    },
    {
        id: 'n-3',
        type: 'returns',
        title: 'Return Hand-off Request',
        description: "Reminder: Handover the 'Prada Nylon Trousers' to Jordan today by 5 PM.",
        timestamp: '4 days ago',
        group: 'Earlier',
        isRead: true
    }
];

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
    children,
    userProfile,
    setUserProfile,
    onBackToHome,
    onSellerDashboard,
    onSignOut,
    onNavigate
}) => {
    const [screen, setScreen] = useState<ProfileScreenName>('profile-dashboard');
    const [screenHistory, setScreenHistory] = useState<ProfileScreenName[]>([]);

    const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
    const [rentals, setRentals] = useState<RentalItem[]>(initialRentals);
    const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

    const changeScreen = (newScreen: ProfileScreenName) => {
        setScreenHistory((prev) => [...prev, screen]);
        setScreen(newScreen);
    };

    const goBack = () => {
        if (screenHistory.length > 0) {
            const prev = screenHistory[screenHistory.length - 1];
            setScreenHistory((history) => history.slice(0, -1));
            setScreen(prev);
        } else {
            if (screen === 'profile-dashboard') {
                onBackToHome();
            } else {
                setScreen('profile-dashboard');
            }
        }
    };

    const updateProfile = (newProfile: Partial<UserProfile>) => {
        setUserProfile((prev) => ({
            ...prev,
            ...newProfile
        }));
    };

    // Address Handlers
    const addAddress = (addr: Omit<Address, 'id'>) => {
        const newAddr: Address = {
            ...addr,
            id: `addr-${Date.now()}`
        };
        if (addr.isDefault) {
            setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
        } else {
            setAddresses((prev) => [...prev, newAddr]);
        }
    };

    const editAddress = (id: string, updatedFields: Omit<Address, 'id'>) => {
        setAddresses((prev) => {
            let list = prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
            if (updatedFields.isDefault) {
                list = list.map((a) => (a.id !== id ? { ...a, isDefault: false } : a));
            }
            return list;
        });
    };

    const deleteAddress = (id: string) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
    };

    const setDefaultAddress = (id: string) => {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    };

    // Payment Method Handlers
    const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
        const newMethod: PaymentMethod = {
            ...method,
            id: `pay-${Date.now()}`
        };
        if (method.isPrimary) {
            setPaymentMethods((prev) => prev.map((m) => ({ ...m, isPrimary: false })).concat(newMethod));
        } else {
            setPaymentMethods((prev) => [...prev, newMethod]);
        }
    };

    const removePaymentMethod = (id: string) => {
        setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    };

    const setPrimaryPaymentMethod = (id: string) => {
        setPaymentMethods((prev) => prev.map((m) => ({ ...m, isPrimary: m.id === id })));
    };

    // Rental Handlers
    const updateRentalStatus = (id: string, status: RentalStatus) => {
        setRentals((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    };

    const addRental = (rental: RentalItem) => {
        setRentals((prev) => [...prev, rental]);
    };

    // Wishlist Handlers
    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    // Review Handlers
    const addReview = (review: Omit<Review, 'id' | 'date'>) => {
        const newReview: Review = {
            ...review,
            id: `rev-${Date.now()}`,
            date: 'Just now'
        };
        setReviews((prev) => [newReview, ...prev]);
    };

    // Notification Handlers
    const markNotificationAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    };

    const markAllNotificationsAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    return (
        <ProfileContext.Provider
            value={{
                profile: userProfile,
                updateProfile,
                screen,
                setScreen: changeScreen,
                goBack,
                addresses,
                addAddress,
                editAddress,
                deleteAddress,
                setDefaultAddress,
                paymentMethods,
                addPaymentMethod,
                removePaymentMethod,
                setPrimaryPaymentMethod,
                rentals,
                updateRentalStatus,
                addRental,
                wishlist,
                removeFromWishlist,
                reviews,
                addReview,
                notifications,
                markNotificationAsRead,
                markAllNotificationsAsRead,
                onSellerDashboard,
                onSignOut,
                onNavigate
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};
