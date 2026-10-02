import React, { useState, useMemo } from 'react';
import {
    Bell,
    MapPin,
    Search,
    SlidersHorizontal,
    ChevronRight,
    ChevronDown,
    Star,
    Heart,
    Plus,
    Home,
    PlusCircle,
    MessageSquare,
    User,
    ShoppingBag,
    ArrowUpDown,
    Ruler,
    DollarSign,
    LayoutGrid,
    ArrowLeft
} from 'lucide-react';
import logoImg from '../../../images/logo.png';
import { Product, ActiveScreen } from '../../types';
import { useSeller } from '../seller/SellerContext';
import { mapListingToProduct } from '../../utils/deposit';
import { useBuyer } from './BuyerContext';

interface HomeFeedProps {
    key?: any;
    defaultCategory?: string;
    onNavigate: (screen: ActiveScreen) => void;
    onSelectProduct: (product: Product) => void;
    wishlist: string[];
    onToggleWishlist: (productId: string) => void;
}

export default function HomeFeed({
    defaultCategory,
    onNavigate,
    onSelectProduct,
    wishlist,
    onToggleWishlist
}: HomeFeedProps) {
    const { user } = useBuyer();
    const { listings } = useSeller();

    const activeProducts = useMemo(() => {
        return listings.filter(l => l.status === 'Active' || l.visibility === 'ACTIVE').map(mapListingToProduct);
    }, [listings]);

    const [selectedCategory, setSelectedCategory] = useState(defaultCategory || 'For You');
    const [sortBy, setSortBy] = useState<string>('newest');
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const categoryProducts = useMemo(() => {
        let list = activeProducts;
        if (selectedCategory !== 'For You') {
            list = activeProducts.filter(p => p.category === selectedCategory);
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

    const displayCategories = useMemo(() => {
        const uniqueCats = Array.from(new Set(activeProducts.map(p => p.category))).filter(Boolean);
        return [
            { name: 'For You', count: activeProducts.length },
            ...uniqueCats.map(cat => ({
                name: cat,
                count: activeProducts.filter(p => p.category === cat).length
            }))
        ];
    }, [activeProducts]);

    const sections = useMemo(() => {
        return [
            {
                title: 'Trending',
                products: [...activeProducts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4)
            }
        ].filter(s => s.products.length > 0);
    }, [activeProducts]);

    return (
        <div id="home-feed-screen" className="bg-surface min-h-screen text-on-surface">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md h-16 border-b border-surface-container flex justify-between items-center px-4 md:px-8 max-w-7xl mx-auto left-0 right-0">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="Zigsy Logo" className="w-12 h-12 object-contain" />
                    <h1 className="font-sans font-extrabold text-2xl tracking-tighter text-primary">ZIGSY</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onNavigate('chat-notifications')}
                        className="relative cursor-pointer hover:opacity-80 transition-opacity active:scale-95 duration-150 text-on-surface-variant"
                    >
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full"></span>
                    </button>
                    <div 
                        onClick={() => onNavigate('profile')}
                        className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden cursor-pointer hover:opacity-80 transition-opacity active:scale-95 duration-150 bg-neutral-100 flex items-center justify-center"
                    >
                        {user.profilePhoto ? (
                            <img
                                className="w-full h-full object-cover"
                                src={user.profilePhoto}
                                alt="User profile"
                            />
                        ) : (
                            <User className="w-5 h-5 text-neutral-400" />
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-20 pb-28 md:pb-8 max-w-7xl mx-auto">
                {/* Header & Location */}
                <section className="px-4 md:px-8 mb-6 mt-4">

                    {/* Search Box */}
                    <div
                        onClick={() => onNavigate('search')}
                        className="relative cursor-pointer group bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all shadow-sm"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                        <div className="w-full py-4 pl-12 pr-12 text-sm text-on-surface-variant/85 select-none">
                            Search outfits, brands, occasions...
                        </div>
                        <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    </div>
                </section>
                           {/* Banner Section */}
                <section className="px-4 md:px-8 mb-10">
                    <div
                        onClick={() => {
                            // Clicking the featured banner can open details for Valentino Silk Gown as it is the grand dress
                            const item = activeProducts.find(p => p.id === '1' || p.id === 'valentino-silk-gown');
                            if (item) onSelectProduct(item);
                        }}
                        className="relative rounded-[24px] overflow-hidden h-[380px] md:h-[450px] group cursor-pointer shadow-xl border border-surface-container"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10"></div>
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwDTKxSTssmf4kX-qpvW6cgVlX2kyAKdJP2_ibyfwiKgLhASPPB0N-qRLdRFz1YPgRvtAaMNYkueYmY8Onnmo9oi-nEZmgah-kGymRLInZ414sUQQg4TU-dytbghcabW87OnOCgbIToQpreL--mLQd50iXTW95ZRhNNocmJMLulBj5GwJusA6htZbw1ruH2BUp2JQK8XpprdCMYgJGdrkmWe74SbVCuqog0MMGY3zry3uile-ZWmQG')" }}
                        ></div>

                        <div className="absolute bottom-0 left-0 p-6 z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <span className="inline-block px-3 py-1 bg-primary rounded-full text-white font-bold text-[10px] tracking-wider mb-2">FEATURED</span>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-2">Luxury Redefined</h2>
                                <p className="text-white/85 text-sm max-w-sm font-light">Elevate your evening with our exclusive collection of designer gowns and bespoke tailoring.</p>
                            </div>
                            <button className="bg-white hover:bg-surface-container text-primary px-6 py-3 rounded-xl font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 w-fit cursor-pointer active:scale-95 duration-150">
                                Explore Now
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Dynamic Sections */}
                {sections.map((sec) => (
                    <section key={sec.title} className="px-4 md:px-8 mb-10">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-on-surface">{sec.title}</h3>
                            <button
                                onClick={() => onNavigate('trending-all')}
                                className="text-primary font-bold text-xs flex items-center gap-0.5 hover:underline"
                            >
                                View all
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                            {sec.products.map((product) => {
                                const isWishlisted = wishlist.includes(product.id);
                                return (
                                    <div
                                        key={product.id}
                                        className="min-w-[145px] w-[145px] md:w-[165px] shrink-0 snap-start group flex flex-col cursor-pointer"
                                    >
                                        <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden mb-2.5 shadow-sm border border-surface-container bg-surface-container-low">
                                            <img
                                                onClick={() => onSelectProduct(product)}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                src={product.image}
                                                alt={product.name}
                                            />

                                            {product.tag && (
                                                <div className="absolute top-2.5 left-2.5 z-10">
                                                    <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-primary font-bold text-[9px] shadow-sm">
                                                        {product.tag}
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleWishlist(product.id);
                                                }}
                                                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/70 hover:bg-white backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary shadow-sm transition-all active:scale-90 cursor-pointer"
                                            >
                                                <Heart
                                                    className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-primary text-primary' : 'text-on-surface-variant'}`}
                                                />
                                            </button>
                                        </div>

                                        <div className="space-y-1">
                                            {product.brand && (
                                                <span className="text-on-surface-variant font-bold text-[9px] uppercase tracking-wider block">
                                                    {product.brand}
                                                </span>
                                            )}
                                            <h4
                                                onClick={() => onSelectProduct(product)}
                                                className="font-bold text-xs text-on-surface leading-snug mt-0.5 truncate group-hover:text-primary transition-colors"
                                            >
                                                {product.name}
                                            </h4>
                                            <div className="flex items-center gap-1">
                                                <span className="font-extrabold text-sm text-primary">{product.currency}{product.price.toLocaleString()}</span>
                                                <span className="text-[10px] text-on-surface-variant">/ day</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-0.5">
                                                {product.rating && (
                                                    <div className="flex items-center gap-0.5 text-[10px] font-semibold text-on-surface">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        <span>{product.rating}</span>
                                                    </div>
                                                )}
                                                {product.distance && (
                                                    <div className="flex items-center gap-0.5 text-[10px] text-on-surface-variant">
                                                        <MapPin className="w-3 h-3 text-on-surface-variant" />
                                                        <span>{product.distance}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </main>

            {/* Floating Bottom Nav for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-surface-container flex justify-around items-center pt-2 pb-6 px-4 z-40">
                <button
                    onClick={() => {
                        setSelectedCategory('For You');
                        onNavigate('home');
                    }}
                    className="flex flex-col items-center justify-center text-primary bg-primary-container/10 rounded-xl px-3 py-1.5"
                >
                    <Home className="w-5 h-5 text-primary" />
                    <span className="text-[10px] mt-0.5 font-bold">Home</span>
                </button>

                <button
                    onClick={() => onNavigate('search')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Search</span>
                </button>

                <button
                    onClick={() => {
                        onNavigate('category');
                    }}
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
                        <span className="absolute -top-1 right-0 min-w-[16px] h-4 bg-primary rounded-full text-[9px] text-white flex items-center justify-center font-bold px-1 leading-none">
                            {wishlist.length}
                        </span>
                    )}
                    <span className="text-[10px] mt-0.5">Saved</span>
                </button>

                <button
                    onClick={() => onNavigate('profile')}
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                    <User className="w-5 h-5" />
                    <span className="text-[10px] mt-0.5">Profile</span>
                </button>
            </nav>

            {/* FAB for Messages / Bookings */}
            <button
                onClick={() => {
                    onNavigate('chat-inbox');
                }}
                className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 md:bottom-12 md:right-12 cursor-pointer"
            >
                <MessageSquare className="w-7 h-7" />
            </button>
        </div>
    );
}
