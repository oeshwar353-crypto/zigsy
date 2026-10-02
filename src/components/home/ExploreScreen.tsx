import React, { useState, useMemo } from 'react';
import {
    ArrowLeft,
    Search,
    Heart,
    SlidersHorizontal,
    ChevronDown,
    LayoutGrid,
    User,
    Home,
    PlusCircle
} from 'lucide-react';
import { Product, ActiveScreen } from '../../types';
import { useSeller } from '../seller/SellerContext';
import { mapListingToProduct } from '../../utils/deposit';

interface ExploreScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
    onSelectProduct: (product: Product) => void;
    wishlist: string[];
    onToggleWishlist: (productId: string) => void;
    defaultSort?: string;
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'booked', label: 'Most Booked' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'trending', label: 'Trending' },
    { value: 'alpha-asc', label: 'Alphabetical A → Z' },
    { value: 'alpha-desc', label: 'Alphabetical Z → A' },
];

export default function ExploreScreen({ onNavigate, onSelectProduct, wishlist, onToggleWishlist, defaultSort }: ExploreScreenProps) {
    const { listings } = useSeller();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState<string>(defaultSort || 'newest');
    const [showSort, setShowSort] = useState(false);

    const activeProducts = useMemo(() => {
        return listings.filter(l => l.status === 'Active' || l.visibility === 'ACTIVE').map(mapListingToProduct);
    }, [listings]);

    const CATEGORIES = useMemo(() => {
        const uniqueCats = Array.from(new Set(activeProducts.map(p => p.category))).filter(Boolean);
        return ['All', ...uniqueCats];
    }, [activeProducts]);

    const filteredProducts = useMemo(() => {
        let list = activeProducts;

        if (selectedCategory !== 'All') {
            list = list.filter(p => p.category === selectedCategory);
        }

        return [...list].sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'popular':
                    return (b.views || 0) - (a.views || 0);
                case 'booked':
                    return (b.bookingsCount || 0) - (a.bookingsCount || 0);
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'trending':
                    return ((b.views || 0) + (b.wishes || 0) * 2) - ((a.views || 0) + (a.wishes || 0) * 2);
                case 'alpha-asc':
                    return a.name.localeCompare(b.name);
                case 'alpha-desc':
                    return b.name.localeCompare(a.name);
                case 'newest':
                default:
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
        });
    }, [activeProducts, selectedCategory, sortBy]);

    const currentSortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label ?? 'Sort';

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-surface-container h-16 flex items-center justify-between px-4 max-w-md mx-auto left-0 right-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onNavigate('home')}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-primary/10 text-primary active:scale-95 transition-all"
                        aria-label="Back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-extrabold text-xl tracking-tight text-on-surface">{defaultSort === 'trending' ? 'Trending Outfits' : 'Explore'}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onNavigate('search')}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container text-on-surface-variant active:scale-95 transition-all"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onNavigate('profile')}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container text-on-surface-variant active:scale-95 transition-all"
                    >
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </header>
 
            <main className="pt-20 px-4">
                {/* Category Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none -mx-4 px-4">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
                                selectedCategory === cat
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sort + Count Row */}
                <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-semibold text-on-surface-variant">
                        {filteredProducts.length} outfits
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setShowSort(p => !p)}
                            className="flex items-center gap-1.5 text-sm font-semibold text-on-surface px-3 py-1.5 rounded-xl border border-surface-container hover:border-primary/30 transition-all"
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                            {currentSortLabel}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSort ? 'rotate-180' : ''}`} />
                        </button>
                        {showSort && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-surface-container z-30 min-w-[180px] overflow-hidden animate-fade-in">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSortBy(opt.value as any); setShowSort(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-surface-container ${
                                            sortBy === opt.value ? 'font-bold text-primary bg-primary/5' : 'text-on-surface'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Listings Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
                        <LayoutGrid className="w-12 h-12 mb-4 opacity-30" />
                        <p className="text-base font-semibold">No outfits in this category</p>
                        <p className="text-sm mt-1 opacity-70">Try selecting a different filter</p>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className="mt-5 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold active:scale-95 transition-all"
                        >
                            Show All
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 pb-8">
                        {filteredProducts.map(product => {
                            const isWishlisted = wishlist.includes(product.id);
                            return (
                                <div key={product.id} className="group flex flex-col cursor-pointer">
                                    <div className="relative aspect-[3/4] bg-surface-container-low rounded-[20px] overflow-hidden mb-3 border border-surface-container">
                                        <img
                                            onClick={() => onSelectProduct(product)}
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <button
                                            onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
                                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-all shadow-sm"
                                        >
                                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary text-primary' : 'text-on-surface-variant'}`} />
                                        </button>
                                        {product.tag && (
                                            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {product.tag}
                                            </span>
                                        )}
                                    </div>
                                    <div onClick={() => onSelectProduct(product)}>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{product.brand}</p>
                                        <h3 className="text-sm font-bold text-on-surface leading-snug mt-0.5 truncate group-hover:text-primary transition-colors">{product.name}</h3>
                                        <div className="flex items-baseline gap-1 mt-1.5">
                                            <span className="text-base font-extrabold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                                            <span className="text-xs text-on-surface-variant">/ day</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Floating Bottom Nav for Mobile */}
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
                    className="flex flex-col items-center justify-center text-primary bg-primary-container/10 rounded-xl px-3 py-1.5"
                >
                    <PlusCircle className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold mt-0.5">Explore</span>
                </button>

                <button
                    onClick={() => onNavigate('wishlist')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative"
                >
                    <Heart className="w-5 h-5" />
                    {wishlist.length > 0 && (
                        <span className="absolute -top-1 right-0 min-w-[16px] h-4 bg-primary rounded-full text-[9px] text-white flex items-center justify-center font-bold px-1 leading-none">
                            {wishlist.length}
                        </span>
                    )}
                    <span className="text-[10px] mt-0.5">Saved</span>
                </button>

                <button
                    onClick={() => onNavigate('profile')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                    <User className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Profile</span>
                </button>
            </nav>
        </div>
    );
}
