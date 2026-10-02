/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useProfile } from './components/ProfileContext';
import { Star, Trash2, ShoppingBag, Heart } from 'lucide-react';
import ConfirmModal from '../ConfirmModal';

export default function Wishlist() {
    const { wishlist, removeFromWishlist, addRental } = useProfile();
    const [rentTargetItem, setRentTargetItem] = useState<typeof wishlist[0] | null>(null);

    const handleRentNow = (item: typeof wishlist[0]) => {
        setRentTargetItem(item);
    };

    const confirmRentNow = () => {
        if (!rentTargetItem) return;
        addRental({
            id: `rent-${Date.now()}`,
            name: rentTargetItem.name,
            image: rentTargetItem.image,
            sellerName: rentTargetItem.sellerName,
            sellerAvatar: rentTargetItem.sellerAvatar,
            dates: 'Starts in 2 days',
            status: 'upcoming',
            amount: rentTargetItem.price * 3,
            startsInDays: 2
        });
        removeFromWishlist(rentTargetItem.id);
        setRentTargetItem(null);
    };

    return (
        <>
        <div id="wishlist-screen" className="pb-20">
            {/* Curation Description */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-text-primary">Saved Looks</h2>
                <p className="text-xs text-text-secondary mt-1">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} curated for your next campus event
                </p>
            </div>

            {/* Grid of Wishlisted Outfits */}
            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                        >
                            {/* Product Image Frame */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Floating Price Pill */}
                                <div className="absolute bottom-3 left-3 bg-brand-cherry/90 backdrop-blur-md text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm">
                                    ₹{item.price}/day
                                </div>

                                {/* Remove Trash Button in top-right */}
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    title="Remove from saved"
                                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full text-red-600 hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Product Meta Details */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-cherry uppercase tracking-wider">
                                        {item.brand}
                                    </p>
                                    <h3 className="font-bold text-base text-text-primary mt-1 line-clamp-1">
                                        {item.name}
                                    </h3>

                                    {/* Seller details & reviews */}
                                    <div className="flex items-center gap-2 mt-2.5">
                                        <img
                                            src={item.sellerAvatar}
                                            alt={item.sellerName}
                                            className="w-5 h-5 rounded-full object-cover"
                                        />
                                        <span className="text-[11px] text-text-secondary font-medium truncate">
                                            {item.sellerName}
                                        </span>
                                        <div className="flex items-center gap-0.5 ml-auto text-accent-gold">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-[11px] font-bold text-text-primary">
                                                {item.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Frame */}
                                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                                    <button
                                        onClick={() => handleRentNow(item)}
                                        className="flex-1 bg-brand-cherry hover:bg-brand-dark text-white font-bold text-xs tracking-wider uppercase py-3 rounded-xl shadow-xs transition-all active:scale-95 duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        Rent Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Premium Empty State */
                <div id="wishlist-empty-state" className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-brand-cherry/5 rounded-full flex items-center justify-center text-brand-cherry/40 mb-6 border border-brand-cherry/10">
                        <Heart className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary">Your Wishlist is Empty</h3>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                        Ready to cure your next look? Explore our luxury catalog of premium outfits shared by college students near you.
                    </p>
                    <button
                        onClick={() => {}}
                        className="mt-6 px-6 py-3.5 bg-brand-cherry hover:bg-brand-dark text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
                    >
                        Start Curation
                    </button>
                </div>
            )}
        </div>

        <ConfirmModal
            open={rentTargetItem !== null}
            title="Confirm Rental"
            message={rentTargetItem ? `Rent "${rentTargetItem.name}" by ${rentTargetItem.brand} for ₹${rentTargetItem.price}/day? A 3-day booking will be created.` : ''}
            confirmLabel="Rent Now"
            cancelLabel="Cancel"
            onConfirm={confirmRentNow}
            onCancel={() => setRentTargetItem(null)}
        />
        </>
    );
}
