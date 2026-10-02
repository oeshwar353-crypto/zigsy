import React from 'react';
import { LayoutDashboard, Shirt, Calendar, User } from 'lucide-react';
import { SellerScreen } from '../../types';

interface BottomNavProps {
    currentScreen: SellerScreen;
    setScreen: (screen: SellerScreen) => void;
    onExitSeller?: () => void;
}

export default function BottomNav({ currentScreen, setScreen, onExitSeller }: BottomNavProps) {
    const navItems = [
        {
            id: 'Dashboard' as SellerScreen,
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            id: 'MyListings' as SellerScreen,
            label: 'Listings',
            icon: Shirt,
        },
        {
            id: 'BookingRequests' as SellerScreen,
            label: 'Bookings',
            icon: Calendar,
        },
    ];

    const handleNavClick = (screen: SellerScreen) => {
        if (screen === 'Profile') {
            if (onExitSeller) {
                onExitSeller();
            } else {
                alert('Zigsy Profile view is locked in this seller module demonstration.');
            }
            return;
        }
        setScreen(screen);
    };

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#f9f9f9]/80 dark:bg-[#1a1c1c]/80 backdrop-blur-md rounded-t-2xl shadow-lg border-t border-gray-200/50">
            {navItems.map((item) => {
                const isActive = currentScreen === item.id ||
                    (item.id === 'Dashboard' && currentScreen === 'UploadOutfit') ||
                    (item.id === 'MyListings' && currentScreen === 'ListingDetails');

                const Icon = item.icon;

                return (
                    <button
                        key={item.id}
                        id={`nav-item-${item.id.toLowerCase()}`}
                        onClick={() => handleNavClick(item.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 active:scale-90 flex-1 max-w-[80px] ${isActive
                            ? 'text-[#C21807] bg-[#C21807]/10 font-semibold'
                            : 'text-gray-500 hover:text-[#C21807] font-medium'
                            }`}
                    >
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-[11px] tracking-wide uppercase">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
