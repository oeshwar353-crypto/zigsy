import React from 'react';
import { useSeller } from './SellerContext';
import {
    TrendingUp,
    Layers,
    ShoppingBag,
    Clock,
    Star,
    Plus,
    FolderHeart,
    MessageSquareDot
} from 'lucide-react';
import { SellerScreen } from '../../types';

interface SellerDashboardProps {
    setScreen: (screen: SellerScreen) => void;
}

export default function SellerDashboard({ setScreen }: SellerDashboardProps) {
    const { listings, bookingRequests } = useSeller();
    const userListings = listings.filter(l => l.ownerId === 'user_123');

    // Dynamic calculations with defensive parsing to prevent NaN
    const totalEarningsVal = userListings.reduce((sum, item) => {
        const val = typeof item.totalRevenue === 'number' ? item.totalRevenue : parseFloat(String(item.totalRevenue || 0).replace(/[^0-9.]/g, ''));
        return sum + (isNaN(val) ? 0 : val);
    }, 0);
    const listingsCount = userListings.length;
    const rentalsCount = userListings.reduce((sum, item) => {
        const val = typeof item.bookingsCount === 'number' ? item.bookingsCount : parseInt(String(item.bookingsCount || 0).replace(/[^0-9]/g, ''), 10);
        return sum + (isNaN(val) ? 0 : val);
    }, 0);
    const pendingRequestsCount = bookingRequests.filter(r => r.status === 'Pending').length;

    return (
        <div id="seller-dashboard-screen" className="animate-fade-in pb-24">
            {/* Editorial Welcome Header */}
            <section className="mb-8 pt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-sans">
                            Seller Dashboard
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Grow your luxury rental inventory and fashion empire.
                        </p>
                    </div>
                </div>
            </section>

            {/* Hero Financial Indicator Card */}
            <div className="bg-white rounded-3xl p-6 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C21807]/5 rounded-bl-full -mr-8 -mt-8 transition-all duration-500 group-hover:scale-110"></div>
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#C21807]/10 p-3 rounded-2xl text-[#C21807]">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                </div>
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                        Total Earnings
                    </p>
                    <h3 className="text-4xl font-extrabold text-[#C21807] tracking-tight font-sans">
                        ₹{totalEarningsVal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </h3>
                </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Active Listings */}
                <div
                    onClick={() => setScreen('MyListings')}
                    className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#C21807]/20 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 group"
                >
                    <div className="text-gray-400 mb-3 group-hover:text-[#C21807] transition-colors">
                        <Layers className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Listings
                    </p>
                    <h4 className="text-2xl font-bold text-gray-800 font-sans">
                        {listingsCount}
                    </h4>
                </div>

                {/* Total Rentals */}
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#C21807]/20 transition-all duration-300 hover:-translate-y-0.5 group">
                    <div className="text-gray-400 mb-3 group-hover:text-[#C21807] transition-colors">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Rentals
                    </p>
                    <h4 className="text-2xl font-bold text-gray-800 font-sans">
                        {rentalsCount}
                    </h4>
                </div>

                {/* Pending Requests */}
                <div
                    onClick={() => setScreen('BookingRequests')}
                    className="bg-[#C21807]/5 p-5 rounded-3xl border border-[#C21807]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:bg-[#C21807]/10 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 group"
                >
                    <div className="text-[#C21807] mb-3">
                        <Clock className="w-6 h-6 animate-pulse" />
                    </div>
                    <p className="text-xs font-semibold text-[#C21807] uppercase tracking-wider mb-1">
                        Pending
                    </p>
                    <h4 className="text-2xl font-bold text-[#C21807] font-sans">
                        {pendingRequestsCount < 10 ? `0${pendingRequestsCount}` : pendingRequestsCount}
                    </h4>
                </div>

                {/* Average Rating */}
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex gap-0.5 text-[#C21807] mb-3">
                        <Star className="w-5 h-5 fill-[#C21807]" />
                        <Star className="w-5 h-5 fill-[#C21807]" />
                        <Star className="w-5 h-5 fill-[#C21807]" />
                        <Star className="w-5 h-5 fill-[#C21807]" />
                        <Star className="w-5 h-5 fill-none" />
                    </div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Avg Rating
                    </p>
                    <h4 className="text-2xl font-bold text-gray-800 font-sans flex items-baseline gap-1">
                        4.9 <span className="text-xs font-normal text-gray-400">(42 reviews)</span>
                    </h4>
                </div>
            </div>

            {/* Interactive Quick Actions Dashboard */}
            <section className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight uppercase">
                    Quick Actions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Action 1: New Listing */}
                    <button
                        onClick={() => setScreen('UploadOutfit')}
                        className="flex items-center gap-4 p-5 bg-gradient-to-br from-[#bd1303] to-[#980900] rounded-3xl text-white text-left shadow-md hover:opacity-95 transition-all duration-300 active:scale-[0.98] group"
                    >
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg leading-snug">New Listing</h4>
                            <p className="text-xs text-white/80 mt-0.5">Upload a stunning luxury outfit</p>
                        </div>
                    </button>

                    {/* Action 2: My Listings */}
                    <button
                        onClick={() => setScreen('MyListings')}
                        className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-3xl text-left shadow-sm hover:border-[#C21807]/30 transition-all duration-300 active:scale-[0.98] group"
                    >
                        <div className="bg-gray-100 p-3 rounded-2xl text-gray-700 group-hover:text-[#C21807] group-hover:bg-[#C21807]/10 transition-colors">
                            <FolderHeart className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-gray-900 leading-snug">My Listings</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Manage, edit & pause outfits</p>
                        </div>
                    </button>

                    {/* Action 3: Booking Requests */}
                    <button
                        onClick={() => setScreen('BookingRequests')}
                        className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-3xl text-left shadow-sm hover:border-[#C21807]/30 transition-all duration-300 active:scale-[0.98] group relative"
                    >
                        <div className="bg-gray-100 p-3 rounded-2xl text-gray-700 group-hover:text-[#C21807] group-hover:bg-[#C21807]/10 transition-colors">
                            <MessageSquareDot className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-gray-900 leading-snug">Booking Requests</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Accept, reject & chat with buyers</p>
                        </div>
                        {pendingRequestsCount > 0 && (
                            <span className="absolute top-4 right-4 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C21807] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C21807]"></span>
                            </span>
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
}
