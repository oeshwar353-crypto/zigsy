import React, { useState, useMemo } from 'react';
import {
    ArrowLeft,
    Share2,
    ShoppingBag,
    Heart,
    Star,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    ArrowRight,
    CheckCircle,
    MessageSquare,
    X,
    User,
    Landmark,
    Camera
} from 'lucide-react';
import { Product, ActiveScreen, Outfit } from '../../types';
import { useSeller } from '../seller/SellerContext';
import { mapListingToProduct } from '../../utils/deposit';
import { useBooking } from '../booking/BookingContext';
import { useChat } from '../chat/context/ChatContext';
import { useBuyer } from './BuyerContext';
import { AnimatePresence, motion } from 'motion/react';

interface ProductDetailsScreenProps {
    product: Product;
    onNavigate: (screen: ActiveScreen) => void;
    onSelectProduct: (product: Product) => void;
    wishlist: string[];
    onToggleWishlist: (productId: string) => void;
}

export default function ProductDetailsScreen({
    product,
    onNavigate,
    onSelectProduct,
    wishlist,
    onToggleWishlist
}: ProductDetailsScreenProps) {
    // Carousel active index state
    const [activeImageIdx, setActiveImageIdx] = useState(0);

    // Custom interactive date selector state
    // Let's mock a beautiful custom calendar selection for June 2026!
    // Start date selected at June 4 (index 3 of first row)
    // End date selected at June 7 (index 6 of first row)
    const { setRentalOutfit } = useBooking();
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const { user, updateUserProfile } = useBuyer();
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verificationStep, setVerificationStep] = useState<'idle' | 'id_scan' | 'selfie' | 'success'>('idle');
    const [uploadedAadhaar, setUploadedAadhaar] = useState<{ name: string; size: string } | null>(null);
    const [uploadingState, setUploadingState] = useState<'idle' | 'uploading' | 'done'>('idle');

    const { listings } = useSeller();
    const activeProducts = useMemo(() => {
        return listings.filter(l => l.status === 'Active' || l.visibility === 'ACTIVE').map(mapListingToProduct);
    }, [listings]);

    const isWishlisted = wishlist.includes(product.id);

    // Gallery array
    const gallery = useMemo(() => {
        return product.gallery && product.gallery.length > 0
            ? product.gallery
            : [product.image];
    }, [product]);

    // Hardcoded defaults for dead success modal code (since calendar widget was removed)
    const rentalDaysCount = 1;
    const subtotal = product.price;
    const dateRangeString = 'Select Dates';

    const { conversations, navigate: chatNavigate } = useChat();

    const conversationId = useMemo(() => {
        if (!product.owner) return 'sarah';
        const ownerName = product.owner.name.toLowerCase();
        const found = conversations.find(
            c => c.user.name.toLowerCase().includes(ownerName) || ownerName.includes(c.user.name.toLowerCase())
        );
        return found ? found.id : 'sarah';
    }, [product.owner, conversations]);

    const handleTalkToLister = () => {
        chatNavigate('chat', conversationId);
    };

    const similarOutfits = useMemo(() => {
        // Exclude current product
        const choices = activeProducts.filter(p => p.id !== product.id);
        
        // Score based on: Same Category (+3), Same Occasion (+2), Same Brand (+1)
        const scored = choices.map(p => {
            let score = 0;
            if (p.category === product.category) score += 3;
            if (p.occasion && product.occasion && p.occasion.toLowerCase() === product.occasion.toLowerCase()) score += 2;
            if (p.brand && product.brand && p.brand.toLowerCase() === product.brand.toLowerCase()) score += 1;
            return { product: p, score };
        });

        const sorted = scored.sort((a, b) => b.score - a.score);
        return sorted.map(item => item.product).slice(0, 3);
    }, [product, activeProducts]);

    const handleRentNow = () => {
        if (product.isHighValue && !user.isIdentityVerified) {
            setIsVerifyModalOpen(true);
            setVerificationStep('idle');
            return;
        }

        const outfit: Outfit = {
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            pricePerDay: product.price,
            sellerName: product.owner?.name || 'Sarah J.',
            sellerImage: product.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            sellerRating: product.rating || 4.8,
            securityDeposit: parseInt(product.refundableDeposit?.replace(/[^0-9]/g, '') || '2500', 10),
            rules: [
                'Handle with clean hands and hang properly',
                'Store in the provided dust bag when not in use',
                'No exposure to strong perfumes or body oils',
                'Strictly no alterations or pins allowed'
            ],
            description: product.description,
            isHighValue: product.isHighValue
        };

        setRentalOutfit(outfit);
        onNavigate('date-selection');
    };

    return (
        <div className="bg-surface text-on-surface mb-32 min-h-screen">
            {/* Top AppBar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md h-16 border-b border-surface-container flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <button
                    onClick={() => onNavigate('home')}
                    className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1
                    onClick={() => onNavigate('home')}
                    className="font-sans font-extrabold text-2xl tracking-tighter text-primary cursor-pointer"
                >
                    ZIGSY
                </h1>
                <div className="flex gap-2">
                    <button className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container">
                        <Share2 className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => onNavigate('wishlist')}
                        className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary p-2 rounded-full hover:bg-surface-container relative"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {wishlist.length > 0 && (
                            <span className="absolute top-1 right-1 bg-primary text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm">
                                {wishlist.length}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto pt-16">
                {/* Success Modal */}
                {bookingSuccess && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl text-center border border-surface-container animate-scale-up">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-on-surface">Rental Booking Confirmed!</h3>
                            <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">
                                You have successfully booked the <span className="font-semibold text-primary">{product.name}</span> for the period <span className="font-semibold text-primary">{dateRangeString}</span>. We have notified Sarah J., and she will get back to you shortly.
                            </p>

                            <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container mt-6 text-left space-y-2">
                                <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                                    <span>Daily Rate:</span>
                                    <span>{product.currency}{product.price} / day</span>
                                </div>
                                <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                                    <span>Duration:</span>
                                    <span>{rentalDaysCount} days</span>
                                </div>
                                <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                                    <span>Refundable Deposit:</span>
                                    <span>{product.refundableDeposit || '₹2,500'}</span>
                                </div>
                                <div className="border-t border-surface-container-highest pt-2 flex justify-between text-sm font-bold text-on-surface">
                                    <span>Subtotal Paid:</span>
                                    <span className="text-primary">{product.currency}{subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setBookingSuccess(false);
                                    onNavigate('home');
                                }}
                                className="w-full mt-6 bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-95 transition-all cursor-pointer"
                            >
                                Return to Home Feed
                            </button>
                        </div>
                    </div>
                )}

                {/* Hero Image Carousel with snap scrolling simulation */}
                <section className="relative w-full aspect-[4/5] md:aspect-[16/9] md:max-h-[550px] overflow-hidden bg-surface-container mt-2 shadow-inner border-b border-surface-container">
                    <div className="relative h-full w-full flex items-center justify-center">
                        <img
                            className="w-full h-full object-cover transition-all duration-500"
                            src={gallery[activeImageIdx]}
                            alt={product.name}
                        />

                        {/* Left/Right Carousel Controls */}
                        {gallery.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveImageIdx(prev => (prev === 0 ? gallery.length - 1 : prev - 1))}
                                    className="absolute left-4 w-12 h-12 rounded-full bg-white/40 hover:bg-white backdrop-blur-md flex items-center justify-center text-on-surface shadow-md transition-all cursor-pointer z-20"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => setActiveImageIdx(prev => (prev === gallery.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-4 w-12 h-12 rounded-full bg-white/40 hover:bg-white backdrop-blur-md flex items-center justify-center text-on-surface shadow-md transition-all cursor-pointer z-20"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Floating Favorite Overlay */}
                        <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                            <button
                                onClick={() => onToggleWishlist(product.id)}
                                className="w-12 h-12 bg-white/50 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-on-surface shadow-lg transition-all active:scale-90 cursor-pointer"
                            >
                                <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-primary text-primary' : 'text-on-surface'}`} />
                            </button>
                        </div>

                        {/* Carousel indicators dots */}
                        {gallery.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                                {gallery.map((_, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveImageIdx(i)}
                                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === activeImageIdx ? 'w-6 bg-primary' : 'w-2 bg-white/60'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Product Details Header */}
                <section className="px-4 pt-6 md:px-8">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest">{product.brand}</p>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-on-surface leading-tight">
                                {product.name}
                            </h2>
                        </div>
                        {product.rating && (
                            <div className="bg-surface-container px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 shadow-sm border border-surface-container">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                <span className="font-bold text-sm text-on-surface">{product.rating}</span>
                            </div>
                        )}
                    </div>

                    {/* Owner profile card widget */}
                    <div className="flex items-center gap-4 mt-6 p-4 bg-white rounded-2xl border border-surface-container shadow-sm">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-fixed shrink-0">
                            <img
                                className="w-full h-full object-cover"
                                src={product.owner?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrP4YLmVoPHlWngy73CiZXU-fZf7ngYPYJBMxS9mJf-p-poaxITabUBzk5RiVqzqHgvP963tCDUzaB2ZqZdkKVFa0HC0gWYZWQlbf__6O-IE0ZroNqmYEQ2750zCXfQ3pB0fiVqEnrqksCr9KqP300sC9ncEMGyYSfk1lDoneKp4jEr7dskWah7xS4cVXeFzbHx3xwvxGVm1hUOCkEI68yVCXIXuEZPTF4nucPnZIkyA3tZOnPIdCB'}
                                alt="Product Owner"
                            />
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-1 text-sm font-bold text-on-surface">
                                <span>{product.owner?.name || 'Sarah J.'}</span>
                            </div>
                            <p className="text-xs text-on-surface-variant font-medium">
                                {product.owner?.role || 'Verified Student • Delhi University'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pricing, Description */}
                <section className="px-4 mt-8 md:px-8 max-w-2xl">
                    <div className="bg-white p-6 rounded-3xl border border-surface-container shadow-sm">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-primary">{product.currency}{product.price}</span>
                            <span className="text-sm font-medium text-on-surface-variant">/ day</span>
                        </div>

                        <div className="mt-4 flex flex-col gap-2.5">
                            <div className="flex items-center gap-2.5 p-3 bg-surface-container-low rounded-xl border border-surface-container text-xs font-medium text-on-surface-variant">
                                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                                <p>Refundable Security Deposit: {product.refundableDeposit || '₹2,500'}</p>
                            </div>
                            {product.size && (
                                <div className="flex items-center gap-2.5 p-3 bg-surface-container-low rounded-xl border border-surface-container text-xs font-medium text-on-surface-variant">
                                    <span className="font-black text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider shrink-0">Size</span>
                                    <p>Outfit Size: <span className="font-bold text-on-surface">{product.size}</span></p>
                                </div>
                            )}
                        </div>

                        {product.isHighValue && (
                            <div className="mt-3 flex items-center gap-1.5 px-3 py-2 bg-[#C21807]/10 text-[#C21807] rounded-xl text-[11px] font-extrabold shadow-sm select-none border border-[#C21807]/5">
                                <span>Identity Verification Required</span>
                            </div>
                        )}

                        <div className="mt-6">
                            <h3 className="text-xs font-bold tracking-wider text-on-surface-variant uppercase mb-3">Description</h3>
                            <p className="text-sm text-on-surface leading-relaxed font-light">
                                {product.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="bg-surface-container px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant">Iconic Silhouette</span>
                                <span className="bg-surface-container px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant">Premium Finish</span>
                                <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Sustainable Choice
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Similar Outfits Section */}
                {similarOutfits.length > 0 && (
                    <section className="mt-12 mb-16 px-4 md:px-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-on-surface">Similar Outfits</h3>
                            <button
                                onClick={() => onNavigate('search')}
                                className="text-primary font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
                            >
                                View all
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {similarOutfits.map((similar) => (
                                <div
                                    key={similar.id}
                                    onClick={() => onSelectProduct(similar)}
                                    className="flex-shrink-0 w-44 group cursor-pointer"
                                >
                                    <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden mb-3 shadow-sm border border-surface-container bg-surface-container-low">
                                        <img
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            src={similar.image}
                                            alt={similar.name}
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm">
                                            <span className="font-bold text-xs text-primary">{similar.currency}{similar.price}</span>
                                        </div>
                                    </div>
                                    <p className="font-bold text-xs text-on-surface truncate group-hover:text-primary transition-colors">{similar.name}</p>
                                    {similar.size && <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">Size {similar.size}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Sticky Bottom Bar with CTAs */}
            <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-surface-container z-40">
                <div className="max-w-4xl mx-auto px-4 py-4 md:px-8 flex gap-3 items-center">
                    {/* Compact Wishlist Icon Button */}
                    <button
                        onClick={() => onToggleWishlist(product.id)}
                        className="p-4 border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl flex items-center justify-center cursor-pointer active:scale-95 duration-150 shadow-sm flex-none w-14 h-14"
                        title={isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                    >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-primary' : ''}`} />
                    </button>

                    {/* Chat with Lister Button */}
                    <button
                        onClick={handleTalkToLister}
                        className="flex-1 py-4 border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 duration-150 shadow-sm"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat with Lister</span>
                    </button>

                    {/* Rent Now Button */}
                    <button
                        onClick={handleRentNow}
                        className="flex-[1.2] py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 hover:opacity-95 transition-all active:scale-95 duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Rent Now
                    </button>
                </div>
            </nav>

            {/* Renter Identity Verification Modal Dialog */}
            <AnimatePresence>
                {isVerifyModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsVerifyModalOpen(false)}
                            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[999] flex items-center justify-center p-4"
                        />
                        {/* Dialog Card */}
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl z-[1000] w-[calc(100%-2rem)] max-w-sm flex flex-col space-y-4 border border-gray-100 text-gray-800"
                        >
                            
                            {/* Close Button */}
                            <button
                                onClick={() => setIsVerifyModalOpen(false)}
                                className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {verificationStep === 'idle' && (
                                <div className="space-y-4 text-center">
                                    <div className="w-14 h-14 rounded-full bg-[#C21807]/10 flex items-center justify-center text-[#C21807] mx-auto">
                                        <ShieldCheck className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="font-extrabold text-gray-900 text-base">Identity Verification Required</h3>
                                        <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                                            This is a High-Value outfit (estimated value above ₹10,000).
                                        </p>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            To keep our community safe, renting luxury high-value apparel requires a quick, one-time identity verification.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2 text-left text-[11px] font-medium border border-gray-100">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[8px] font-bold">1</div>
                                            <span>Aadhaar Card Upload</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            updateUserProfile({ highValueVerificationStatus: 'Government ID Submitted' });
                                            setVerificationStep('id_scan');
                                        }}
                                        className="w-full bg-[#C21807] text-white py-3.5 rounded-xl font-bold text-xs shadow-md hover:bg-brand-dark active:scale-[0.98] transition-all"
                                    >
                                        Start Verification
                                    </button>
                                </div>
                            )}

                            {verificationStep === 'id_scan' && (
                                <div className="space-y-4 text-center">
                                    <h3 className="font-extrabold text-gray-900 text-sm">Step 1: Upload Aadhaar Card</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                                        Please upload the front image of your Aadhaar Card to complete verification.
                                    </p>
                                    
                                    {/* Upload Zone */}
                                    <label className="relative aspect-[1.6/1] bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    setUploadedAadhaar({
                                                        name: file.name,
                                                        size: (file.size / 1024).toFixed(1) + " KB"
                                                    });
                                                    setUploadingState('uploading');
                                                    setTimeout(() => {
                                                        setUploadingState('done');
                                                    }, 1200);
                                                }
                                            }}
                                        />
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <div className="w-10 h-10 rounded-full bg-[#C21807]/10 flex items-center justify-center text-[#C21807]">
                                                <Camera className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Choose File or Drag Here</span>
                                            <span className="text-[9px] text-gray-450 font-semibold">Supports PNG, JPG, or PDF</span>
                                        </div>
                                    </label>

                                    {/* Upload Progress */}
                                    {uploadingState === 'uploading' && (
                                        <div className="space-y-1.5 py-1">
                                            <p className="text-[11px] font-bold text-gray-600 animate-pulse">Uploading card front...</p>
                                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#C21807] animate-[shimmer_1.5s_infinite] w-2/3 rounded-full" />
                                            </div>
                                        </div>
                                    )}

                                    {uploadingState === 'done' && uploadedAadhaar && (
                                        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center justify-between text-left">
                                            <div className="min-w-0 flex-1 pr-2">
                                                <p className="text-[10.5px] font-bold text-emerald-800 truncate">
                                                    {uploadedAadhaar.name}
                                                </p>
                                                <p className="text-[9px] font-semibold text-emerald-600 mt-0.5">
                                                    {uploadedAadhaar.size} • Ready
                                                </p>
                                            </div>
                                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            updateUserProfile({ highValueVerificationStatus: 'Verification Pending' });
                                            setVerificationStep('success');
                                        }}
                                        disabled={uploadingState !== 'done'}
                                        className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-md transition-all duration-200 ${
                                            uploadingState === 'done'
                                                ? 'bg-[#C21807] text-white hover:bg-brand-dark active:scale-[0.98]'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Submit Aadhaar Card
                                    </button>
                                </div>
                            )}

                            {verificationStep === 'success' && (
                                <div className="space-y-4 text-center">
                                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-gray-900 text-base">Verification Approved!</h3>
                                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">High Value Verified ✅</p>
                                        <p className="text-xs text-gray-500 leading-relaxed mt-1">
                                            Your identity profile is locked and permanently verified. You can rent all future High Value outfits instantly.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            updateUserProfile({ 
                                                isIdentityVerified: true,
                                                highValueVerificationStatus: 'Verified'
                                            });
                                            setIsVerifyModalOpen(false);
                                        }}
                                        className="w-full bg-[#C21807] text-white py-3.5 rounded-xl font-bold text-xs shadow-md hover:bg-brand-dark active:scale-[0.98] transition-all"
                                    >
                                        Proceed to Booking
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
