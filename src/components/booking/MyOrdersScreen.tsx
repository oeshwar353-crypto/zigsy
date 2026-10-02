import React, { useState, useMemo } from 'react';
import { useBooking } from './BookingContext';
import { useBuyer } from '../home/BuyerContext';
import { ActiveScreen, Order, OrderStatus } from '../../types';
import { ArrowLeft, Home, Search, PlusCircle, Heart, User, Calendar, ArrowRight } from 'lucide-react';

interface MyOrdersScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
}

type OrderFilter = 'all' | OrderStatus;

export default function MyOrdersScreen({ onNavigate }: MyOrdersScreenProps) {
    const { orders, selectOrder } = useBooking();
    const { wishlist } = useBuyer();
    const [filter, setFilter] = useState<OrderFilter>('all');

    const filteredOrders = useMemo(() => {
        if (filter === 'all') return orders;
        return orders.filter(o => o.status === filter);
    }, [orders, filter]);

    const handleOrderClick = (order: Order) => {
        selectOrder(order);
        onNavigate('order-details');
    };

    const getStatusStyles = (status: OrderStatus) => {
        switch (status) {
            case 'active':
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'completed':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border border-red-200';
            default: // upcoming
                return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
        }
    };

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-container h-16 flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <button
                    onClick={() => onNavigate('profile')}
                    className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container cursor-pointer"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-sans font-extrabold text-xl tracking-tight text-on-surface">
                    My Rental Bookings
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="max-w-md mx-auto pt-24 px-4">
                {/* Filter Selector Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                    {(['all', 'upcoming', 'active', 'completed', 'cancelled'] as OrderFilter[]).map((tab) => {
                        const isActive = filter === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4.5 py-2 rounded-full text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${
                                    isActive
                                        ? 'bg-primary text-white shadow-sm shadow-primary/20 scale-105'
                                        : 'bg-white border border-surface-container text-on-surface-variant hover:bg-surface-container'
                                }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 border border-surface-container text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[300px]">
                        <Calendar className="w-12 h-12 text-on-surface-variant/30 mb-3" />
                        <h4 className="font-bold text-sm text-on-surface">No bookings found</h4>
                        <p className="text-[10px] text-on-surface-variant/75 mt-1">There are no orders matching this filter tab.</p>
                        <button
                            onClick={() => onNavigate('home')}
                            className="mt-5 px-6 py-2.5 bg-primary hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 duration-150"
                        >
                            Explore Outfits
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => handleOrderClick(order)}
                                className="bg-white rounded-3xl p-4.5 border border-surface-container shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex gap-4 animate-slide-up"
                            >
                                {/* Thumbnail */}
                                <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-surface-container">
                                    <img
                                        src={order.outfit.image}
                                        alt={order.outfit.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Order Info */}
                                <div className="flex-1 flex flex-col justify-between py-0.5">
                                    <div>
                                        <div className="flex justify-between items-start gap-1">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold capitalize tracking-wide ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-on-surface-variant">
                                                {order.id}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-sm text-on-surface line-clamp-1 mt-2">
                                            {order.outfit.name}
                                        </h3>
                                        <p className="text-[10px] text-on-surface-variant font-medium mt-1 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            {order.startDate} to {order.endDate}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-surface-container-low">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider">Total Paid</span>
                                            <span className="font-extrabold text-sm text-primary">
                                                ₹{order.amount.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold text-primary flex items-center gap-0.5 hover:translate-x-0.5 transition-transform">
                                            Details <ArrowRight className="w-4.5 h-4.5" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Mobile Bottom Navigation (Buyer Cohesive) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-surface-container flex justify-around items-center pt-2 pb-6 px-4 z-40">
                <button
                    onClick={() => onNavigate('home')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Home</span>
                </button>

                <button
                    onClick={() => onNavigate('search')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Search</span>
                </button>

                <button
                    onClick={() => onNavigate('category')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Explore</span>
                </button>

                <button
                    onClick={() => onNavigate('wishlist')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative"
                >
                    <Heart className="w-5 h-5" />
                    {wishlist.length > 0 && (
                        <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-primary rounded-full text-[8px] text-white flex items-center justify-center"></span>
                    )}
                    <span className="text-[10px] mt-0.5">Saved</span>
                </button>

                <button
                    onClick={() => onNavigate('profile')}
                    className="flex flex-col items-center justify-center text-primary bg-primary-container/10 rounded-xl px-3 py-1.5"
                >
                    <User className="w-5 h-5 text-primary fill-primary/10" />
                    <span className="text-[10px] font-bold mt-0.5">Profile</span>
                </button>
            </nav>
        </div>
    );
}
