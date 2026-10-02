import React, { useState, useMemo } from 'react';
import {
    Menu,
    ShoppingBag,
    Trash2,
    CalendarDays,
    Heart,
    Home,
    Search,
    PlusCircle,
    User,
    ArrowRight
} from 'lucide-react';
import { Product, ActiveScreen } from '../../types';
import { useSeller } from '../seller/SellerContext';
import { mapListingToProduct } from '../../utils/deposit';

interface WishlistScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
    onSelectProduct: (product: Product) => void;
    wishlist: string[];
    onToggleWishlist: (productId: string) => void;
}

export default function WishlistScreen({
    onNavigate,
    onSelectProduct,
    wishlist,
    onToggleWishlist
}: WishlistScreenProps) {
    const { listings } = useSeller();
    const activeProducts = useMemo(() => {
        return listings.filter(l => l.status === 'Active' || l.visibility === 'ACTIVE').map(mapListingToProduct);
    }, [listings]);

    const [sortBy, setSortBy] = useState<'recent' | 'price'>('recent');
    const [removedItems, setRemovedItems] = useState<string[]>([]);

    // Get full Product objects for active wishlist IDs
    const wishlistProducts = useMemo(() => {
        // Filter standard products that are in the user's wishlist
        const list = activeProducts.filter(p => wishlist.includes(p.id) && !removedItems.includes(p.id));

        if (sortBy === 'price') {
            return [...list].sort((a, b) => b.price - a.price); // high to low
        }

        return list;
    }, [wishlist, sortBy, removedItems]);

    const handleRemoveItem = (id: string) => {
        // Stage removal for smooth animation exit
        setRemovedItems(prev => [...prev, id]);

        // Actually remove it from the global wishlist array after the slide-out animation completes
        setTimeout(() => {
            onToggleWishlist(id);
            setRemovedItems(prev => prev.filter(item => item !== id));
        }, 300);
    };

    return (
        <div className="bg-surface text-on-surface font-body-md min-h-screen pb-32">
            {/* Top Navigation */}
            <header className="fixed top-0 w-full z-50 bg-white/95 border-b border-surface-container h-16">
                <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onNavigate('home')}
                            className="text-primary hover:opacity-80 transition-opacity cursor-pointer p-1 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1
                            onClick={() => onNavigate('home')}
                            className="font-sans font-extrabold text-2xl tracking-tighter text-primary cursor-pointer"
                        >
                            ZIGSY
                        </h1>
                    </div>
                    <button className="text-primary hover:opacity-80 transition-opacity cursor-pointer">
                        <ShoppingBag className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="pt-24 px-4 md:px-8 max-w-4xl mx-auto min-h-screen">
                {wishlistProducts.length > 0 ? (
                    <div className="animate-fade-in">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">Saved Items</h2>
                                <p className="text-sm text-on-surface-variant mt-1.5 font-medium">
                                    {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your luxury rotation
                                </p>
                            </div>

                            {/* Sorting Tabs */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                                <button
                                    onClick={() => setSortBy('recent')}
                                    className={`px-6 py-2.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 duration-150 ${sortBy === 'recent'
                                        ? 'bg-primary text-white border-primary shadow-sm'
                                        : 'bg-white border-outline-variant text-on-surface-variant hover:bg-surface-container'
                                        }`}
                                >
                                    Recently Added
                                </button>
                                <button
                                    onClick={() => setSortBy('price')}
                                    className={`px-6 py-2.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 duration-150 ${sortBy === 'price'
                                        ? 'bg-primary text-white border-primary shadow-sm'
                                        : 'bg-white border-outline-variant text-on-surface-variant hover:bg-surface-container'
                                        }`}
                                >
                                    Price
                                </button>
                            </div>
                        </div>

                        {/* Wishlist List */}
                        <div className="space-y-6">
                            {wishlistProducts.map((product) => {
                                const isLeaving = removedItems.includes(product.id);
                                return (
                                    <div
                                        key={product.id}
                                        className={`group relative flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-sm border border-surface-container transition-all hover:translate-y-[-2px] hover:shadow-md duration-300 ${isLeaving ? 'translate-x-[150%] opacity-0 duration-300 ease-out' : 'translate-x-0 opacity-100'
                                            }`}
                                    >
                                        <div className="w-full md:w-64 h-72 md:h-60 flex-shrink-0 overflow-hidden relative bg-surface-container">
                                            <img
                                                onClick={() => onSelectProduct(product)}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                                                src={product.image}
                                                alt={product.name}
                                            />
                                            {product.tag && (
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="bg-primary px-3 py-1 rounded-full text-on-primary text-[9px] font-extrabold uppercase tracking-widest shadow-lg">
                                                        {product.tag}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex flex-col justify-between flex-grow">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <p className="text-[10px] font-extrabold text-primary tracking-wider uppercase mb-1">{product.brand}</p>
                                                    <h3
                                                        onClick={() => onSelectProduct(product)}
                                                        className="text-lg md:text-xl font-bold text-on-surface leading-snug cursor-pointer hover:text-primary transition-colors"
                                                    >
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-xs text-on-surface-variant font-medium mt-2">
                                                        {product.size ? `Size: ${product.size}` : product.color ? `Color: ${product.color}` : 'Standard Size'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-extrabold text-lg text-primary">
                                                        {product.currency}{product.price.toLocaleString()} <span className="text-xs font-medium text-on-surface-variant">/ day</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
                                                <div className="flex gap-2 shrink-0">
                                                    <button
                                                        onClick={() => onSelectProduct(product)}
                                                        className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold text-xs hover:opacity-90 active:scale-95 duration-150 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                                                    >
                                                        <CalendarDays className="w-4 h-4" />
                                                        Rent Now
                                                    </button>
                                                    <button
                                                        onClick={() => onSelectProduct(product)}
                                                        className="border border-outline px-6 py-3 rounded-xl font-bold text-xs hover:bg-surface-container active:scale-95 duration-150 transition-all text-on-surface cursor-pointer"
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(product.id)}
                                                    className="text-on-surface-variant hover:text-primary flex items-center gap-1 text-xs font-semibold transition-colors p-2 rounded-lg hover:bg-primary/5 cursor-pointer active:scale-95"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Empty Wishlist State */
                    <div className="flex flex-col items-center justify-center text-center py-20 px-4 animate-fade-in">
                        <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant/40 mb-6 border border-surface-container">
                            <Heart className="w-12 h-12 stroke-[1.5]" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-on-surface">Your wishlist is empty</h3>
                        <p className="text-on-surface-variant text-sm mt-3 max-w-sm mx-auto leading-relaxed font-light">
                            Start curating your dream rotation with the world's most coveted designer pieces.
                        </p>
                        <button
                            onClick={() => onNavigate('home')}
                            className="mt-8 bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/10 active:scale-95 duration-150 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mx-auto"
                        >
                            Continue Browsing
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </main>

            {/* Bottom Navigation Bar */}
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
                    className="flex flex-col items-center justify-center text-primary bg-primary-container/10 rounded-xl px-3 py-1.5 relative"
                >
                    <Heart className="w-5 h-5 text-primary fill-primary" />
                    <span className="text-[10px] font-bold mt-0.5">Saved</span>
                </button>

                <button
                    onClick={() => onNavigate('profile')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                    <User className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Profile</span>
                </button>
            </nav>
        </div>
    );
}
