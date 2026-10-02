import React, { useState } from 'react';
import { useSeller } from './SellerContext';
import { Plus, Edit, Eye, Heart, DollarSign, ArrowRight } from 'lucide-react';
import { SellerScreen, ListingStatus } from '../../types';

interface MyListingsProps {
    setScreen: (screen: SellerScreen) => void;
    setSelectedListingId: (id: string) => void;
}

export default function MyListings({ setScreen, setSelectedListingId }: MyListingsProps) {
    const { listings } = useSeller();
    const [activeTab, setActiveTab] = useState<ListingStatus>('Active');

    const userListings = listings.filter(l => l.ownerId === 'user_123');

    const tabs: { label: string; value: ListingStatus }[] = [
        { label: 'Active', value: 'Active' },
        { label: 'Rented', value: 'Rented' },
        { label: 'Pending Approval', value: 'Pending Approval' },
        { label: 'Drafts', value: 'Drafts' },
    ];

    // Filter listings based on active tab
    const filteredListings = userListings.filter((l) => l.status === activeTab);

    const handleCardClick = (id: string) => {
        setSelectedListingId(id);
        setScreen('ListingDetails');
    };

    const handleCreateNew = () => {
        setScreen('UploadOutfit');
    };

    return (
        <div id="my-listings-screen" className="animate-fade-in pb-24">
            {/* Header section */}
            <section className="mb-6 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-sans">
                        My Listings
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your luxury rental inventory and track performance.
                    </p>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="bg-[#C21807] hover:opacity-90 text-white font-semibold text-sm px-6 py-3 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-[#C21807]/10"
                >
                    <Plus className="w-4 h-4" />
                    New Listing
                </button>
            </section>

            {/* Segmented Tab Control */}
            <nav className="mb-6 overflow-x-auto no-scrollbar py-1">
                <div className="inline-flex p-1 bg-gray-100 rounded-2xl min-w-full md:min-w-0">
                    {tabs.map((tab) => {
                        const isSelected = activeTab === tab.value;
                        const tabListingsCount = userListings.filter((l) => l.status === tab.value).length;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`px-5 py-2.5 rounded-xl font-medium text-xs transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${isSelected
                                    ? 'bg-white text-[#C21807] shadow-sm font-semibold scale-[1.02]'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[#C21807]/10 text-[#C21807]' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {tabListingsCount}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredListings.map((listing) => (
                        <article
                            key={listing.id}
                            onClick={() => handleCardClick(listing.id)}
                            className="bg-white rounded-[24px] border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                        >
                            {/* Image & Status Tag */}
                            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={listing.title}
                                    src={listing.image}
                                />

                                {/* Status indicator tag */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm ${listing.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : listing.status === 'Rented'
                                            ? 'bg-amber-100 text-amber-800'
                                            : listing.status === 'Pending Approval'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {listing.status}
                                    </span>
                                </div>

                                {/* If Rented overlay */}
                                {listing.status === 'Rented' && (
                                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[#C21807] font-bold text-xs tracking-wider shadow-md">
                                            Unavailable
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Title & Price Information */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <h3 className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-[#C21807] transition-colors">
                                        {listing.title}
                                    </h3>
                                    <p className="font-bold text-[#C21807] text-base flex-shrink-0">
                                        ₹{listing.price}<span className="text-[10px] font-normal text-gray-400">/day</span>
                                    </p>
                                </div>

                                {/* Premium Metrics Strip */}
                                <div className="grid grid-cols-3 gap-1 py-3 my-3 border-y border-gray-100 text-center text-xs">
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">Views</p>
                                        <p className="font-bold text-gray-800 font-mono mt-0.5">
                                            {listing.views >= 1000 ? `${(listing.views / 1000).toFixed(1)}k` : listing.views}
                                        </p>
                                    </div>
                                    <div className="border-x border-gray-100">
                                        <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">Wishes</p>
                                        <p className="font-bold text-gray-800 font-mono mt-0.5">{listing.wishes}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">Total</p>
                                        <p className="font-bold text-[#C21807] font-mono mt-0.5">
                                            ₹{listing.totalRevenue >= 1000 ? `${(listing.totalRevenue / 1000).toFixed(1)}k` : listing.totalRevenue}
                                        </p>
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(listing.id);
                                    }}
                                    className="w-full py-2.5 border border-[#C21807] hover:bg-[#C21807] text-[#C21807] hover:text-white font-semibold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit &amp; Manage
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                /* Stylish Empty State */
                <div className="text-center py-16 px-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm mb-4">No listings currently under "{activeTab}"</p>
                    <button
                        onClick={handleCreateNew}
                        className="px-5 py-2.5 bg-[#C21807] text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-all shadow"
                    >
                        Create your first listing
                    </button>
                </div>
            )}
        </div>
    );
}
