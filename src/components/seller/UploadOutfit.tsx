import React, { useState } from 'react';
import { useSeller } from './SellerContext';
import { useBuyer } from '../home/BuyerContext';
import { Camera, Image, X, MapPin, CheckCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { SellerScreen, Listing, ListingStatus } from '../../types';
import { estimateOriginalValue, calculateSecurityDeposit } from '../../utils/deposit';

interface UploadOutfitProps {
    setScreen: (screen: SellerScreen) => void;
    setSelectedListingId: (id: string) => void;
}

export default function UploadOutfit({ setScreen, setSelectedListingId }: UploadOutfitProps) {
    const { addListing, listings, setIsLimitModalOpen } = useSeller();
    const { user } = useBuyer();

    // Form states
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Dresses');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [condition, setCondition] = useState('New');
    const [description, setDescription] = useState('');
    const [pickupLocation, setPickupLocation] = useState('Vivekananda Global University, Admin Block Lawn');
    const [deliveryAvailable, setDeliveryAvailable] = useState(true);
    const [price, setPrice] = useState('');
    const [gender, setGender] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');

    // Custom uploaded images mockup (one preselected premium red dress image)
    const defaultDressImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuChE4WsviqEbswzz3-ZkeLj_u1lbpe8TYIY5ERcg1Co5zgclRE2NnSM76JkscSGrChJll8xj_3DSKocj53mmk7qowrqKe_80thMJRNT_DRSAfa-BJpepMM9f0bQSEyjuboi9pv_8Wdl3mc4MvXEF3ZRMmwfqgJ-C25psRBQGfTSJ4IJBfB-PsnTCLlGy9oJXwKYybGArdg_riDQuRKkj5mOV0c3rXOjEKMscMhux4KepDHlE-CUIyw3';
    const [imagesList, setImagesList] = useState<string[]>([defaultDressImage]);
    const [blackoutDays, setBlackoutDays] = useState<string[]>([]);

    const handleRemoveImage = (index: number) => {
        setImagesList(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageUploadDummy = () => {
        // Generate a high-quality fashion image as additional attachment
        const randomGownImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnJ8tV3v5UmoBW5S0CUZRXU6Mqn9TsTPtqQcTvr7nABwvQnfdUH5EbLfDakBP3Wkin_svxrdoOyThq3MmlWP5B5eNCdL4IzCjPdUSzOD40UWqQH8Ye6hiW1CIJYWMoqOHr2hMfK6BnvaRMb4Cev6mgNriiME3hfzOfzBJSFBnWzdn_a3-h8Ul-WIMcC2vnyQP2yiU1DmhqBMSsjj9yIAO442QGUPkzYa1GieQrlpAamTnSVrUN-OTA';
        if (imagesList.length < 8) {
            setImagesList(prev => [...prev, randomGownImg]);
        } else {
            alert('Maximum of 8 photos reached.');
        }
    };

    const handlePublish = (statusVal: ListingStatus) => {
        if (!title.trim()) {
            alert('Please enter an outfit title.');
            return;
        }
        if (!brand.trim()) {
            alert('Please enter the brand name.');
            return;
        }
        if (!gender) {
            alert('Please select a target gender.');
            return;
        }
        if (!size.trim()) {
            alert('Please specify the size.');
            return;
        }
        if (!color.trim()) {
            alert('Please specify the color.');
            return;
        }
        if (!description.trim()) {
            alert('Please enter an outfit description.');
            return;
        }
        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            alert('Please enter a valid price / day greater than 0.');
            return;
        }
        if (!originalPrice || isNaN(Number(originalPrice)) || Number(originalPrice) <= 0) {
            alert('Please enter a valid original retail price.');
            return;
        }
        if (!pickupLocation.trim()) {
            alert('Please specify the pickup location.');
            return;
        }
        if (imagesList.length === 0) {
            alert('Please upload at least one image.');
            return;
        }

        const activeListingsCount = listings.filter(l => l.ownerId === 'user_123' && l.status === 'Active').length;
        if (user.isVerifiedStudent && statusVal === 'Active' && activeListingsCount >= 5) {
            setIsLimitModalOpen(true);
            return;
        }

        const mainImg = imagesList[0] || defaultDressImage;

        const newListingData = {
            title: title.trim(),
            description: description.trim(),
            size: size.trim(),
            price: Number(price),
            estimatedOriginalValue: Number(originalPrice),
            securityDeposit: 0, // Recalculated securely by the system on context backend
            image: mainImg,
            images: imagesList.length > 0 ? imagesList : [defaultDressImage],
            status: statusVal,
            category,
            brand: brand.trim(),
            color: color.trim(),
            condition,
            blockedDates: blackoutDays,
            pickupLocation: pickupLocation.trim(),
            deliveryAvailable,
            gender,
        };

        // We generate an ID and add it
        const listId = `list_${Date.now()}`;

        // Add to state via Context
        addListing(newListingData);

        // Save actual ID to redirect to details
        setSelectedListingId(listId);

        // Force direct transition to ListingDetails
        setScreen('ListingDetails');
    };

    // Availability calendar date helper click toggle (mock dates for October)
    const toggleBlackoutDay = (day: string) => {
        if (blackoutDays.includes(day)) {
            setBlackoutDays(prev => prev.filter(d => d !== day));
        } else {
            setBlackoutDays(prev => [...prev, day]);
        }
    };

    const calculatedOriginalValueForDeposit = estimateOriginalValue(Number(price) || 0, category);
    const calculatedDeposit = calculateSecurityDeposit(Number(price) || 0, category, calculatedOriginalValueForDeposit);
    const isHighValue = calculatedOriginalValueForDeposit > 10000;

    return (
        <div id="upload-outfit-screen" className="animate-fade-in pb-32">
            {/* Intro Header */}
            <section className="mb-6 pt-4">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight font-sans">
                    Upload Outfit
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    List your luxury high-fashion item for the premium rental community.
                </p>
            </section>

            {user.isVerifiedStudent && (() => {
                const activeCount = listings.filter(l => l.ownerId === 'user_123' && l.status === 'Active').length;
                const progressPercentage = Math.min(100, (activeCount / 5) * 100);
                const isFull = activeCount >= 5;

                return (
                    <div className="mb-6 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                                {isFull ? '🔴' : '🟢'} Active Listings
                            </span>
                            <span className="font-extrabold text-brand-cherry text-sm">{activeCount} / 5 Used</span>
                        </div>
                        
                        {/* Progress Bar Track */}
                        <div className="w-full h-3.5 bg-gray-50 rounded-full p-0.5 border border-gray-100/50">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        <p className="text-xs font-semibold text-gray-600 leading-relaxed pt-0.5">
                            {isFull ? (
                                <span className="text-red-600 font-extrabold">Limit Reached. Archive or delete an outfit to free a slot.</span>
                            ) : (
                                <span>You can publish <span className="text-emerald-600 font-extrabold">{5 - activeCount} more</span> active outfit{5 - activeCount !== 1 ? 's' : ''}.</span>
                            )}
                        </p>
                    </div>
                );
            })()}

            {/* Image Upload Bento Area */}
            <section className="mb-6">
                <div
                    onClick={handleImageUploadDummy}
                    className="relative group border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 hover:bg-gray-100 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#C21807] cursor-pointer"
                >
                    <div className="bg-[#C21807]/10 text-[#C21807] w-12 h-12 rounded-full flex items-center justify-center mb-3">
                        <Camera className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-800">Drag and drop up to 8 photos</h3>
                    <p className="text-xs text-gray-400 mt-1">High-quality editorial portraits preferred (4:5 ratio)</p>
                    <p className="text-[10px] text-[#C21807] font-medium mt-1">Tap to simulate adding high-fashion photo</p>
                </div>

                {/* Upload Previews Grid */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                    {imagesList.map((img, idx) => (
                        <div key={idx} className="aspect-[4/5] rounded-2xl overflow-hidden relative group shadow-sm border border-gray-100">
                            <img className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} src={img} />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(idx);
                                }}
                                className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-[#C21807] hover:text-white rounded-full p-1 shadow transition-colors duration-200"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Empty slot placeholders */}
                    {Array.from({ length: Math.max(0, 4 - imagesList.length) }).map((_, placeholderIdx) => (
                        <div
                            key={placeholderIdx}
                            onClick={handleImageUploadDummy}
                            className="aspect-[4/5] rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all cursor-pointer"
                        >
                            <Image className="w-5 h-5" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Listing Details Form */}
            <section className="space-y-5">
                {/* Title input */}
                <div className="relative">
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="peer w-full h-16 pt-5 pb-1 px-4 rounded-2xl bg-gray-100/70 border-none focus:ring-2 focus:ring-[#C21807]/20 focus:bg-white text-gray-800 text-sm transition-all outline-none"
                        placeholder=" "
                    />
                    <label
                        htmlFor="title"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#C21807] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                    >
                        Outfit Title
                    </label>
                </div>

                {/* Category Selection Chips */}
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Category</label>
                    <div className="flex flex-wrap gap-2.5">
                        {[
                            { value: 'Dresses', label: 'Dresses' },
                            { value: 'Lehengas', label: 'Lehengas' },
                            { value: 'Suits', label: 'Suits' },
                            { value: 'Blazers', label: 'Blazers' },
                            { value: 'Jackets', label: 'Jackets' },
                            { value: 'Shirts', label: 'Shirts' },
                            { value: 'T-Shirts', label: 'T-Shirts' },
                            { value: 'Jeans', label: 'Jeans' },
                            { value: 'Shoes', label: 'Shoes' },
                            { value: 'Accessories', label: 'Accessories' }
                        ].map((cat) => {
                            const isSel = category === cat.value;
                            return (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setCategory(cat.value)}
                                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 active:scale-95 cursor-pointer border ${isSel
                                        ? 'bg-[#C21807] border-[#C21807] text-white shadow-md shadow-[#C21807]/10'
                                        : 'bg-gray-100/70 border-transparent text-gray-700 hover:bg-gray-200/80'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Brand & Size row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="peer w-full h-16 pt-5 pb-1 px-4 rounded-2xl bg-gray-100/70 border-none focus:ring-2 focus:ring-[#C21807]/20 focus:bg-white text-gray-800 text-sm transition-all outline-none"
                            placeholder=" "
                        />
                        <label
                            htmlFor="brand"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#C21807] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                        >
                            Brand (e.g. Valentino)
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            id="size"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="peer w-full h-16 pt-5 pb-1 px-4 rounded-2xl bg-gray-100/70 border-none focus:ring-2 focus:ring-[#C21807]/20 focus:bg-white text-gray-800 text-sm transition-all outline-none"
                            placeholder=" "
                        />
                        <label
                            htmlFor="size"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#C21807] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                        >
                            Size
                        </label>
                    </div>
                </div>

                {/* Gender Selection Chips */}
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Target Gender</label>
                    <div className="flex gap-2.5">
                        {[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
                            { value: 'Unisex', label: 'Unisex' }
                        ].map((g) => {
                            const isSel = gender === g.value;
                            return (
                                <button
                                    key={g.value}
                                    type="button"
                                    onClick={() => setGender(g.value)}
                                    className={`flex-1 py-3.5 rounded-2xl font-bold text-xs transition-all duration-150 active:scale-95 cursor-pointer border ${isSel
                                        ? 'bg-[#C21807] border-[#C21807] text-white shadow-md shadow-[#C21807]/10'
                                        : 'bg-gray-100/70 border-transparent text-gray-700 hover:bg-gray-200/80'
                                        }`}
                                >
                                    {g.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Color & Condition row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            id="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="peer w-full h-16 pt-5 pb-1 px-4 rounded-2xl bg-gray-100/70 border-none focus:ring-2 focus:ring-[#C21807]/20 focus:bg-white text-gray-800 text-sm transition-all outline-none"
                            placeholder=" "
                        />
                        <label
                            htmlFor="color"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#C21807] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                        >
                            Color
                        </label>
                    </div>

                    <div className="relative flex flex-col justify-center">
                        <div className="flex gap-1.5 w-full">
                            {['New', 'Like New', 'Good'].map((cond) => {
                                const isSel = condition === cond;
                                return (
                                    <button
                                        key={cond}
                                        type="button"
                                        onClick={() => setCondition(cond)}
                                        className={`flex-1 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer border ${isSel
                                            ? 'bg-[#C21807] border-[#C21807] text-white shadow-sm'
                                            : 'bg-gray-100/70 border-transparent text-gray-700 hover:bg-gray-200/80'
                                            }`}
                                    >
                                        {cond}
                                    </button>
                                );
                            })}
                        </div>
                        <label className="absolute -top-2 left-2 px-1.5 bg-white text-gray-400 text-[10px] font-bold tracking-wider uppercase pointer-events-none">
                            Condition
                        </label>
                    </div>
                </div>

                {/* Description */}
                <div className="relative">
                    <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="peer w-full pt-6 pb-2 px-4 rounded-2xl bg-gray-100/70 border-none focus:ring-2 focus:ring-[#C21807]/20 focus:bg-white text-gray-800 text-sm transition-all outline-none resize-none"
                        placeholder=" "
                    />
                    <label
                        htmlFor="description"
                        className="absolute left-4 top-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#C21807] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                    >
                        Outfit Description
                    </label>
                </div>
            </section>

            {/* Pricing & Logistics Section */}
            <section className="mt-8 space-y-6">
                <h3 className="text-xl font-bold text-gray-950 font-sans tracking-tight">
                    Pricing &amp; Rental
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Price Per Day */}
                    <div className="relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 font-semibold text-gray-800">₹</div>
                        <input
                            type="text"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="peer w-full h-16 pt-5 pb-1 pl-8 pr-4 rounded-2xl bg-gray-100/70 border-none focus:ring-2 focus:ring-[#C21807]/20 focus:bg-white text-gray-800 text-sm font-semibold transition-all outline-none"
                            placeholder=" "
                        />
                        <label
                            htmlFor="price"
                            className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#C21807] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                        >
                            Price / Day
                        </label>
                    </div>

                    {/* Original Retail Price */}
                    <div className="relative">
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 font-semibold text-gray-800">₹</div>
                        <input
                            type="text"
                            id="originalPrice"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            className="peer w-full h-16 pt-5 pb-1 pl-8 pr-4 rounded-2xl bg-gray-100/70 border-none focus:ring-2 focus:ring-[#C21807]/20 focus:bg-white text-gray-800 text-sm font-semibold transition-all outline-none"
                            placeholder=" "
                        />
                        <label
                            htmlFor="originalPrice"
                            className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#C21807] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                        >
                            Real Price of Product
                        </label>
                    </div>
                </div>

                {/* Security Deposit Display */}
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100/80 px-4 rounded-2xl h-16 shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="text-left flex-grow">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Security Deposit</span>
                        <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">
                            ₹{calculatedDeposit} <span className="text-[9px] text-gray-400 font-normal font-sans">(Calculated by Zigsy)</span>
                        </span>
                    </div>
                    {isHighValue && (
                        <div className="text-[8px] font-bold bg-[#C21807]/10 text-[#C21807] px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
                            <span>High-Value Verification</span>
                        </div>
                    )}
                </div>

                {/* Calendar Bento widget */}
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">Blackout Dates</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">Select days to mark your outfit as unavailable</p>
                        </div>
                        <span className="text-[#C21807] text-xs font-semibold uppercase tracking-wider">Set dates</span>
                    </div>

                    {/* October Calendar mockup */}
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                            <div key={d} className="text-[10px] text-gray-400 font-bold py-1">{d}</div>
                        ))}

                        {/* Week of Oct 1st */}
                        <div className="h-8 flex items-center justify-center text-xs text-gray-300 pointer-events-none">28</div>
                        <div className="h-8 flex items-center justify-center text-xs text-gray-300 pointer-events-none">29</div>
                        <div className="h-8 flex items-center justify-center text-xs text-gray-300 pointer-events-none">30</div>

                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(day => {
                            const dayStr = `2023-10-${day < 10 ? '0' + day : day}`;
                            const isSelected = blackoutDays.includes(dayStr);
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleBlackoutDay(dayStr)}
                                    className={`h-8 w-8 mx-auto flex items-center justify-center text-xs rounded-xl transition-all ${isSelected
                                        ? 'bg-[#C21807] text-white font-bold'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-3 flex gap-4 text-[10px]">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C21807]"></span>
                            <span className="text-gray-500">Blackout (Blocked)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full border border-gray-200 bg-white"></span>
                            <span className="text-gray-500">Available Date</span>
                        </div>
                    </div>
                </div>

                {/* Pickup Location */}
                <div className="relative">
                    <input
                        type="text"
                        id="pickupLocation"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="peer w-full h-16 pt-5 pb-1 pl-4 pr-12 rounded-2xl bg-gray-100/70 border-none focus:ring-2 focus:ring-[#C21807]/20 focus:bg-white text-gray-800 text-sm transition-all outline-none"
                        placeholder=" "
                    />
                    <label
                        htmlFor="pickupLocation"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#C21807] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-400"
                    >
                        Pickup Location
                    </label>
                    <MapPin className="w-5 h-5 absolute right-4 top-5 text-gray-400" />
                </div>

                {/* Shipping Toggle Switch */}
                <div className="flex items-center justify-between p-5 bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] rounded-3xl">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900">Delivery Available</span>
                        <span className="text-xs text-gray-400 mt-0.5">Offer national shipping directly to renters</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                        className={`w-11 h-6 rounded-full transition-colors relative duration-300 outline-none ${deliveryAvailable ? 'bg-[#C21807]' : 'bg-gray-200'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-sm ${deliveryAvailable ? 'translate-x-5' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>
            </section>

            {/* Persistent Bottom sticky actions */}
            <div className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-gray-100 py-4 shadow-xl">
                <div className="max-w-xl mx-auto flex items-center gap-4 px-4">
                    <button
                        type="button"
                        onClick={() => handlePublish('Drafts')}
                        className="flex-1 h-14 rounded-2xl border-2 border-[#C21807] text-[#C21807] font-semibold hover:bg-[#C21807]/5 transition-all active:scale-95 text-sm"
                    >
                        Save Draft
                    </button>

                    <button
                        type="button"
                        onClick={() => handlePublish('Active')}
                        className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-[#bd1303] to-[#980900] text-white font-semibold shadow-lg shadow-[#bd1303]/20 active:scale-95 transition-all text-sm"
                    >
                        Publish Listing
                    </button>
                </div>
            </div>
        </div>
    );
}
