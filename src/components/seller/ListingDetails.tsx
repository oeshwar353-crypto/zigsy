import React, { useState } from 'react';
import { useSeller } from './SellerContext';
import {
    Edit3,
    Pause,
    Play,
    Trash2,
    Eye,
    ShoppingBag,
    DollarSign,
    MapPin,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Save,
    CalendarDays,
    ShieldCheck
} from 'lucide-react';
import { SellerScreen, Listing, ListingStatus } from '../../types';
import { estimateOriginalValue, calculateSecurityDeposit } from '../../utils/deposit';
import ConfirmModal from '../ConfirmModal';

interface ListingDetailsProps {
    listingId: string;
    setScreen: (screen: SellerScreen) => void;
}

export default function ListingDetails({ listingId, setScreen }: ListingDetailsProps) {
    const { listings, updateListing, deleteListing } = useSeller();

    // Find current listing
    const listing = listings.find(l => l.id === listingId);

    // If listing doesn't exist, provide a graceful return
    if (!listing) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 text-sm">Listing not found.</p>
                <button
                    onClick={() => setScreen('MyListings')}
                    className="mt-4 px-4 py-2 bg-[#C21807] text-white rounded-xl text-xs font-semibold"
                >
                    Return to listings
                </button>
            </div>
        );
    }

    // Edit form state toggles
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editTitle, setEditTitle] = useState(listing.title);
    const [editDesc, setEditDesc] = useState(listing.description);
    const [editSize, setEditSize] = useState(listing.size);
    const [editPrice, setEditPrice] = useState(listing.price.toString());
    const [editLocation, setEditLocation] = useState(listing.pickupLocation);

    const calculatedEditOriginalValue = estimateOriginalValue(Number(editPrice) || 0, listing.category);
    const calculatedEditDeposit = calculateSecurityDeposit(Number(editPrice) || 0, listing.category, calculatedEditOriginalValue);

    // Image slideshow state mockup (index)
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const extraImages = listing.images || [listing.image];

    // Toggle pause state
    const handleTogglePause = () => {
        const isCurrentlyActive = listing.status === 'Active';
        const updatedStatus: ListingStatus = isCurrentlyActive ? 'Drafts' : 'Active';
        updateListing({
            ...listing,
            status: updatedStatus
        });
    };

    // Handle Delete
    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        deleteListing(listing.id);
        setScreen('MyListings');
    };

    // Save edits
    const handleSaveEdits = () => {
        if (!editTitle.trim()) {
            return;
        }
        if (!editPrice || isNaN(Number(editPrice))) {
            return;
        }

        updateListing({
            ...listing,
            title: editTitle.trim(),
            description: editDesc.trim(),
            size: editSize.trim(),
            price: Number(editPrice),
            securityDeposit: 0, // Recalculated on context backend
            pickupLocation: editLocation.trim()
        });
        setIsEditing(false);
    };

    // Toggle calendar block/unblock
    const toggleDateBlock = (dayNum: number) => {
        const dateStr = `2023-10-${dayNum < 10 ? '0' + dayNum : dayNum}`;

        // Booked dates are locked and cannot be blocked/unblocked
        const isBooked = listing.bookedDates.includes(dateStr);
        if (isBooked) {
            alert('This date has already been booked by a renter.');
            return;
        }

        const currentlyBlocked = listing.blockedDates.includes(dateStr);
        let newBlockedDates = [...listing.blockedDates];

        if (currentlyBlocked) {
            newBlockedDates = newBlockedDates.filter(d => d !== dateStr);
        } else {
            newBlockedDates.push(dateStr);
        }

        updateListing({
            ...listing,
            blockedDates: newBlockedDates
        });
    };

    return (
        <>
        <div id="listing-details-screen" className="animate-fade-in pb-32">
            {/* Editorial Slide Image Header */}
            <section className="relative mb-6">
                <div className="flex overflow-hidden rounded-[24px] aspect-[4/5] bg-gray-50 relative border border-gray-100">
                    <img
                        className="w-full h-full object-cover transition-all duration-500"
                        alt={listing.title}
                        src={extraImages[activeImageIdx]}
                    />

                    {/* Dots Indicator */}
                    {extraImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            {extraImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIdx(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeImageIdx ? 'bg-white scale-125' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Floating Status Tag */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${listing.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        <span className="text-xs font-semibold text-gray-800 uppercase tracking-widest">
                            {listing.status === 'Active' ? 'Active' : 'Paused/Draft'}
                        </span>
                    </div>
                </div>
            </section>

            {/* Metrics Grid */}
            <section className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Views</span>
                    <span className="text-xl font-bold text-gray-900 font-mono">
                        {listing.views.toLocaleString()}
                    </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Bookings</span>
                    <span className="text-xl font-bold text-gray-900 font-mono">
                        {listing.bookingsCount}
                    </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-l-4 border-l-[#C21807] border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Revenue</span>
                    <span className="text-xl font-bold text-[#C21807] font-mono">
                        ₹{listing.totalRevenue.toLocaleString('en-IN')}
                    </span>
                </div>
            </section>

            {/* Availability Calendar Grid */}
            <section className="mb-6">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 font-sans tracking-tight">Availability Calendar</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Tap dates to block (unavailable) or unblock</p>
                    </div>
                    <button
                        onClick={() => alert('Calendar detail grid view locked in this model.')}
                        className="text-[#C21807] text-xs font-semibold uppercase tracking-wider"
                    >
                        View All
                    </button>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-sm text-gray-800">October 2023</span>
                        <div className="flex gap-2">
                            <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                            <button className="p-1 rounded hover:bg-gray-100"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                            <div key={d} className="text-[10px] text-gray-400 font-bold py-1">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {/* Previous Month trailing */}
                        <div className="aspect-square flex items-center justify-center text-[11px] text-gray-200">28</div>
                        <div className="aspect-square flex items-center justify-center text-[11px] text-gray-200">29</div>
                        <div className="aspect-square flex items-center justify-center text-[11px] text-gray-200">30</div>

                        {/* October days */}
                        {Array.from({ length: 25 }).map((_, idx) => {
                            const day = idx + 1;
                            const dateStr = `2023-10-${day < 10 ? '0' + day : day}`;
                            const isBooked = listing.bookedDates.includes(dateStr);
                            const isBlocked = listing.blockedDates.includes(dateStr);

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDateBlock(day)}
                                    className={`aspect-square text-[11px] rounded-lg transition-all flex items-center justify-center ${isBooked
                                        ? 'bg-[#C21807] text-white font-bold'
                                        : isBlocked
                                            ? 'bg-gray-200 text-gray-400 line-through'
                                            : 'hover:bg-gray-100 text-gray-700 font-medium'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex gap-4 text-[10px] border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C21807]"></span>
                            <span className="text-gray-500">Booked (Locked)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
                            <span className="text-gray-500">Blocked (Tap to block)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Listing details section */}
            <section className="mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 font-sans tracking-tight">Listing Details</h3>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-[#C21807] text-xs font-semibold flex items-center gap-1 bg-[#C21807]/10 px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
                        >
                            <Edit3 className="w-3 h-3" /> Edit
                        </button>
                    )}
                </div>

                {isEditing ? (
                    /* Inline edit form */
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Title</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#C21807]/20 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={editDesc}
                                onChange={e => setEditDesc(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#C21807]/20 outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Size</label>
                                <input
                                    type="text"
                                    value={editSize}
                                    onChange={e => setEditSize(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#C21807]/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Price / Day</label>
                                <input
                                    type="text"
                                    value={editPrice}
                                    onChange={e => setEditPrice(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#C21807]/20 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Deposit</label>
                                <div className="w-full px-4 py-3 bg-gray-100/70 rounded-xl text-sm font-extrabold text-gray-850 flex items-center gap-1.5 h-11 shrink-0 select-none">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>₹{calculatedEditDeposit}</span>
                                    <span className="text-[8px] text-gray-400 font-normal font-sans">(Calculated by Zigsy)</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Pickup Location</label>
                                <input
                                    type="text"
                                    value={editLocation}
                                    onChange={e => setEditLocation(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#C21807]/20 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleSaveEdits}
                                className="flex-1 py-3 bg-gradient-to-r from-[#bd1303] to-[#980900] text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                            >
                                <Save className="w-3.5 h-3.5" /> Save Changes
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditTitle(listing.title);
                                    setEditDesc(listing.description);
                                    setEditSize(listing.size);
                                    setEditPrice(listing.price.toString());
                                    setEditLocation(listing.pickupLocation);
                                }}
                                className="flex-1 py-3 border border-gray-300 text-gray-600 font-semibold text-xs rounded-xl"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Normal display details */
                    <div className="space-y-5 text-sm">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Title</span>
                            <p className="text-gray-800 font-semibold text-base">{listing.title}</p>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Description</span>
                            <p className="text-gray-500 leading-relaxed text-sm">{listing.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Size</span>
                                <p className="text-gray-800 font-semibold">{listing.size}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Price</span>
                                <p className="text-gray-800 font-semibold">₹{listing.price} / day</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Security Deposit</span>
                                <p className="text-gray-800 font-semibold">₹{listing.securityDeposit}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Pickup Location</span>
                                <p className="text-gray-800 font-semibold flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {listing.pickupLocation}
                                </p>
                            </div>
                        </div>

                        {/* Badges / Tags row */}
                        <div className="flex flex-wrap gap-2 pt-3">
                            <span className="px-3.5 py-1.5 bg-[#e5e2e1] text-[#1c1b1b] rounded-full text-xs font-medium">
                                {listing.category}
                            </span>
                            <span className="px-3.5 py-1.5 bg-[#e5e2e1] text-[#1c1b1b] rounded-full text-xs font-medium">
                                {listing.brand}
                            </span>
                            <span className="px-3.5 py-1.5 bg-[#e5e2e1] text-[#1c1b1b] rounded-full text-xs font-medium">
                                {listing.color}
                            </span>
                            <span className="px-3.5 py-1.5 bg-[#e5e2e1] text-[#1c1b1b] rounded-full text-xs font-medium">
                                {listing.condition}
                            </span>
                        </div>
                    </div>
                )}
            </section>

            {/* Main Action Buttons */}
            {!isEditing && (
                <section className="space-y-4">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#bd1303] to-[#980900] text-white font-bold shadow-md hover:opacity-95 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm"
                    >
                        <Edit3 className="w-4 h-4" /> Edit Listing
                    </button>

                    <button
                        onClick={handleTogglePause}
                        className="w-full py-4 rounded-2xl border-2 border-gray-300 text-gray-800 hover:text-[#C21807] hover:border-[#C21807]/20 font-bold bg-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm"
                    >
                        {listing.status === 'Active' ? (
                            <>
                                <Pause className="w-4 h-4" /> Pause Listing
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 text-green-600 fill-green-600" /> Resume Listing
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDelete}
                        className="w-full py-4 text-[#ba1a1a] hover:bg-red-50 font-bold rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 text-sm"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Listing
                    </button>
                </section>
            )}
        </div>

        <ConfirmModal
            open={showDeleteConfirm}
            title="Delete Listing"
            message={`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            destructive
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
        />
        </>
    );
}
