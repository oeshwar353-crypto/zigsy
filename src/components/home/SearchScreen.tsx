import React, { useState, useMemo, useEffect } from 'react';
import {
    ArrowLeft,
    Search,
    SlidersHorizontal,
    Heart,
    X,
    Check,
    Home,
    PlusCircle,
    User,
    ShoppingBag,
    Star,
    MapPin,
    Sliders,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { Product, ActiveScreen, FilterState } from '../../types';
import { useSeller } from '../seller/SellerContext';
import { mapListingToProduct } from '../../utils/deposit';

interface SearchScreenProps {
    onNavigate: (screen: ActiveScreen) => void;
    onSelectProduct: (product: Product) => void;
    wishlist: string[];
    onToggleWishlist: (productId: string) => void;
}

export default function SearchScreen({
    onNavigate,
    onSelectProduct,
    wishlist,
    onToggleWishlist
}: SearchScreenProps) {
    const { listings } = useSeller();
    const activeProducts = useMemo(() => {
        return listings.filter(l => l.status === 'Active' || l.visibility === 'ACTIVE').map(mapListingToProduct);
    }, [listings]);

    const INITIAL_FILTERS: FilterState = {
        priceRange: 5000,
        distance: 'nationwide',
        size: 'M',
        brands: [],
        gender: [],
        sizes: [],
        colors: [],
        occasions: [],
        conditions: [],
        availability: 'All'
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const isFiltersApplied = useMemo(() => {
        return filters.brands.length > 0 ||
               filters.gender.length > 0 ||
               filters.sizes.length > 0 ||
               filters.colors.length > 0 ||
               filters.occasions.length > 0 ||
               filters.conditions.length > 0 ||
               filters.availability !== 'All' ||
               filters.priceRange !== 5000;
    }, [filters]);

    // Category navigation/search mappings
    const categoriesMap = [
        { name: 'DRESSES', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5C8kFAcJ_8XrBSY9_t-n6ZlOBrte9Pd-yFRLUV1Wial29XzD9W_deIiiSM4DGZesQ4HN7dQ_hpEz4hn_hinv7BRPQIu7dRKs4BwQfEaDP-Gw4UMowMOcJeGgPuY7hPvbvYf_H6afEBDZ77l6a6akj7e2HyZBdO3MGJTzlwuMiX65l6dGK1rEqd5EbQ_j2kBw4GqiJBmkRh-A8ByPpSCWYEL9rFcL5xpOsLR44_zyeh8uE7upnDj7t', search: 'dress' },
        { name: 'OUTERWEAR', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtEXvHI7nJEII7D9fguu8oCD4pqoS58ei5untN6ipqOovj76S-jO7FsUegClF72w5_BjSJr-Z3TLO9QC1qneoT9-fZzx-e6wKGk6be0d1OczbIruNeEqX0nEnFy-d4bBUxlwJe-8sjTprEdXkOmebvDTWHAJKatDZ_mTxnsZhajlPJugPVfZEQD09PNKIwQBidiO7eo14_DsUxyh8CB5zS0AFtqnP_5n9vhxmcW76fJk7UhZ7MmxHY', search: 'trench' },
        { name: 'ACCESSORIES', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACv2X3PLQuQAdeMtlD2bBR9nEzA1UEBH712Dt5_ky0Yek-POq8E8CCPFHHBTwJMl19VRNvMrpROcwThe66f_20sON6IbBmQwpby7dz_nsqWOErgNu7ZTtjHBdyKTe5o3nKeGsa6cpMwBnk3jrTgOeD5u1RkwI-ITGMNjzib8EY3jcjHvf-kEHUdloMTtG84hIeRvE4CsFoabxIjno4X2SWD7VYJtN-8MiibHMc7qLvmh_pqAypu9e0', search: 'bag' },
        { name: 'ETHNIC', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkrNWPJbZDmHkL4UOzuF97oMm_Y5TFb9BZ0VzKoKE4s1-Epcls18E8JHs9qMltrkHtjD261lIDHzRV9XjiJ83PNY8TrJJGGmOPCLbZal4efuN7GD_AjOGOs28DtOmkfyk-3YSa8JtGHCWbpQYAVKBOS-FDIDXOsnG61CIL_9ZtglueC-c7MiUFhEp0r_4nRyH3divrCyOeLSAUFqLMg7mTWlm00y3S_TuZbC7kcPV377RzZDRYwe3L', search: 'silk' }
    ];

    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        const saved = localStorage.getItem('zigsy_recent_searches');
        return saved ? JSON.parse(saved) : ['Silk Scarf', 'Vintage Denim', 'Black Blazer'];
    });

    const addRecentSearch = (query: string) => {
        const cleanQuery = query.trim();
        if (!cleanQuery) return;
        setRecentSearches(prev => {
            const filtered = prev.filter(q => q.toLowerCase() !== cleanQuery.toLowerCase());
            const updated = [cleanQuery, ...filtered].slice(0, 5);
            localStorage.setItem('zigsy_recent_searches', JSON.stringify(updated));
            return updated;
        });
    };

    const trendingProducts = useMemo(() => {
        return [...activeProducts]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 8);
    }, [activeProducts]);

    useEffect(() => {
        if (!searchQuery.trim()) return;
        const handler = setTimeout(() => {
            addRecentSearch(searchQuery);
        }, 1200);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Generate brand and color dynamically from active listings
    const availableBrands = useMemo(() => {
        return Array.from(new Set(activeProducts.map(p => p.brand))).filter(Boolean).sort();
    }, [activeProducts]);

    const availableColors = useMemo(() => {
        return Array.from(new Set(activeProducts.map(p => p.color))).filter(Boolean).sort();
    }, [activeProducts]);

    // Dynamically filter, search and sort items
    const filteredProducts = useMemo(() => {
        let matches = activeProducts;

        // 1. Search Query text check
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            matches = matches.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                (p.color && p.color.toLowerCase().includes(query)) ||
                (p.occasion && p.occasion.toLowerCase().includes(query))
            );
        }

        // 2. Price limit
        matches = matches.filter(p => p.price <= filters.priceRange);

        // 3. Gender
        if (filters.gender.length > 0) {
            matches = matches.filter(p => p.gender && filters.gender.includes(p.gender));
        }

        // 4. Sizes
        if (filters.sizes.length > 0) {
            matches = matches.filter(p => p.size && filters.sizes.some(sz => p.size!.toLowerCase().includes(sz.toLowerCase())));
        }

        // 5. Brands
        if (filters.brands.length > 0) {
            matches = matches.filter(p => filters.brands.some(b => p.brand.toLowerCase() === b.toLowerCase()));
        }

        // 6. Colors
        if (filters.colors.length > 0) {
            matches = matches.filter(p => p.color && filters.colors.some(c => p.color!.toLowerCase() === c.toLowerCase()));
        }

        // 7. Occasions
        if (filters.occasions.length > 0) {
            matches = matches.filter(p => p.occasion && filters.occasions.some(o => p.occasion!.toLowerCase() === o.toLowerCase()));
        }

        // 8. Conditions
        if (filters.conditions.length > 0) {
            matches = matches.filter(p => p.condition && filters.conditions.some(c => p.condition!.toLowerCase() === c.toLowerCase()));
        }

        // 9. Availability
        if (filters.availability !== 'All') {
            matches = matches.filter(p => p.availability === filters.availability);
        }

        // 10. Sort matches
        return [...matches].sort((a, b) => {
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
    }, [searchQuery, filters, sortBy, activeProducts]);

    const handleBrandToggle = (brandName: string) => {
        setFilters(prev => {
            const alreadyChecked = prev.brands.includes(brandName);
            return {
                ...prev,
                brands: alreadyChecked ? prev.brands.filter(b => b !== brandName) : [...prev.brands, brandName]
            };
        });
    };

    const handleColorToggle = (colorName: string) => {
        setFilters(prev => {
            const alreadyChecked = prev.colors.includes(colorName);
            return {
                ...prev,
                colors: alreadyChecked ? prev.colors.filter(c => c !== colorName) : [...prev.colors, colorName]
            };
        });
    };

    const handleGenderToggle = (g: string) => {
        setFilters(prev => {
            const alreadyChecked = prev.gender.includes(g);
            return {
                ...prev,
                gender: alreadyChecked ? prev.gender.filter(item => item !== g) : [...prev.gender, g]
            };
        });
    };

    const handleSizeToggle = (sz: string) => {
        setFilters(prev => {
            const alreadyChecked = prev.sizes.includes(sz);
            return {
                ...prev,
                sizes: alreadyChecked ? prev.sizes.filter(item => item !== sz) : [...prev.sizes, sz]
            };
        });
    };

    const handleOccasionToggle = (occ: string) => {
        setFilters(prev => {
            const alreadyChecked = prev.occasions.includes(occ);
            return {
                ...prev,
                occasions: alreadyChecked ? prev.occasions.filter(item => item !== occ) : [...prev.occasions, occ]
            };
        });
    };

    const handleConditionToggle = (cond: string) => {
        setFilters(prev => {
            const alreadyChecked = prev.conditions.includes(cond);
            return {
                ...prev,
                conditions: alreadyChecked ? prev.conditions.filter(item => item !== cond) : [...prev.conditions, cond]
            };
        });
    };

    const handleApplyFilters = () => {
        setIsFilterOpen(false);
    };

    return (
        <div className="bg-surface min-h-screen text-on-surface pb-32">
            {/* Sticky Header and Search Bar Container */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-container max-w-7xl mx-auto">
                {/* Top AppBar */}
                <div className="h-16 flex justify-between items-center px-4 md:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onNavigate('home')}
                            className="text-primary hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center w-9 h-9 rounded-xl hover:bg-primary/10 active:scale-95"
                            aria-label="Back to Home"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1
                            onClick={() => onNavigate('home')}
                            className="font-sans font-extrabold text-2xl tracking-tighter text-primary cursor-pointer"
                        >
                            ZIGSY
                        </h1>
                    </div>
                </div>

                {/* Constant Search Input Box */}
                <div className="px-4 md:px-8 pb-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                        <input
                            type="text"
                            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary rounded-2xl py-3.5 pl-12 pr-12 text-sm font-semibold text-on-surface transition-all outline-none shadow-sm"
                            placeholder="Search blazers, dresses, streetwear..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addRecentSearch(searchQuery);
                                }
                            }}
                        />
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-secondary transition-colors cursor-pointer p-1 rounded-lg"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Container */}
            <main className="pt-40 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">

                {/* Pre-search Empty Input State */}
                {!searchQuery.trim() && !isFiltersApplied && (
                    <div className="animate-fade-in">
                        {/* Recent Searches */}
                        <section className="mb-8">
                            <h2 className="text-lg font-bold text-on-surface mb-4">Recent Searches</h2>
                            <div className="flex flex-wrap gap-2.5">
                                {recentSearches.map((search, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setSearchQuery(search)}
                                        className="bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant cursor-pointer transition-colors"
                                    >
                                        {search}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Trending Now */}
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-on-surface">Trending Now</h2>
                                <button
                                    onClick={() => onNavigate('trending-all')}
                                    className="text-primary font-bold text-xs flex items-center gap-0.5 hover:underline cursor-pointer"
                                >
                                    View all
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                                {trendingProducts.map((product) => {
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

                        {/* Popular Categories Grid */}
                        <section className="mb-8">
                            <h2 className="text-lg font-bold text-on-surface mb-4">Popular Categories</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {categoriesMap.map((cat, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setSearchQuery(cat.search);
                                        }}
                                        className="aspect-[4/5] relative rounded-2xl overflow-hidden group cursor-pointer border border-surface-container"
                                    >
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/55 transition-colors z-10"></div>
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url('${cat.img}')` }}
                                        ></div>
                                        <span className="absolute bottom-4 left-4 z-20 font-bold text-xs tracking-wider text-white">
                                            {cat.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Search Results Display */}
                {(searchQuery.trim() || isFiltersApplied) && (
                    <section className="animate-fade-in">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <p className="text-sm text-on-surface-variant">
                                {searchQuery.trim() ? (
                                    <>Showing {filteredProducts.length} results for <span className="font-bold text-on-surface">"{searchQuery}"</span></>
                                ) : (
                                    <>Showing {filteredProducts.length} filtered results</>
                                )}
                            </p>
                            <div className="relative flex items-center gap-2">
                                <span className="text-xs font-semibold text-on-surface-variant">Sort By:</span>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowSortDropdown(prev => !prev)}
                                        className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 text-xs font-bold text-on-surface border border-surface-container-high"
                                    >
                                        <span>{
                                            sortBy === 'newest' ? 'Newest First' :
                                            sortBy === 'oldest' ? 'Oldest First' :
                                            sortBy === 'price-asc' ? 'Price: Low → High' :
                                            sortBy === 'price-desc' ? 'Price: High → Low' :
                                            sortBy === 'popular' ? 'Most Popular' :
                                            sortBy === 'booked' ? 'Most Booked' :
                                            sortBy === 'rating' ? 'Highest Rated' :
                                            sortBy === 'trending' ? 'Trending' :
                                            sortBy === 'alpha-asc' ? 'Alphabetical A → Z' :
                                            sortBy === 'alpha-desc' ? 'Alphabetical Z → A' : 'Sort'
                                        }</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showSortDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)}></div>
                                            <div className="absolute right-0 mt-2 bg-white rounded-2xl shadow-xl border border-surface-container z-50 min-w-[200px] py-2 overflow-hidden animate-scale-up origin-top-right max-h-[300px] overflow-y-auto">
                                                {[
                                                    { value: 'newest', label: 'Newest First' },
                                                    { value: 'oldest', label: 'Oldest First' },
                                                    { value: 'price-asc', label: 'Price: Low → High' },
                                                    { value: 'price-desc', label: 'Price: High → Low' },
                                                    { value: 'popular', label: 'Most Popular' },
                                                    { value: 'booked', label: 'Most Booked' },
                                                    { value: 'rating', label: 'Highest Rated' },
                                                    { value: 'trending', label: 'Trending' },
                                                    { value: 'alpha-asc', label: 'Alphabetical A → Z' },
                                                    { value: 'alpha-desc', label: 'Alphabetical Z → A' }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => {
                                                            setSortBy(opt.value);
                                                            setShowSortDropdown(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-surface-container cursor-pointer ${
                                                            sortBy === opt.value ? 'font-bold text-primary bg-[#C21807]/5' : 'text-on-surface font-medium'
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-surface-container-low rounded-[32px] border border-dashed border-outline-variant mt-4">
                                <Sliders className="w-12 h-12 text-on-surface-variant/40 mb-3" />
                                <h3 className="text-base font-bold text-on-surface">No outfits match your filters.</h3>
                                <button
                                    onClick={() => {
                                        setFilters(INITIAL_FILTERS);
                                        setSortBy('newest');
                                    }}
                                    className="mt-4 bg-primary text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md active:scale-95 duration-150 cursor-pointer"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            /* Results Grid */
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {filteredProducts.map((product) => {
                                    const isWishlisted = wishlist.includes(product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className="flex flex-col group cursor-pointer"
                                        >
                                            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-3 bg-surface-container shadow-sm border border-surface-container">
                                                <img
                                                    onClick={() => onSelectProduct(product)}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    src={product.image}
                                                    alt={product.name}
                                                />

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onToggleWishlist(product.id);
                                                    }}
                                                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-sm hover:text-primary transition-all active:scale-90"
                                                >
                                                    <Heart
                                                        className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-primary text-primary' : 'text-on-surface-variant'
                                                            }`}
                                                    />
                                                </button>

                                                {product.tag && (
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <span className="bg-primary text-white text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider shadow-sm">
                                                            {product.tag}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="px-1" onClick={() => onSelectProduct(product)}>
                                                <div className="flex justify-between items-start mb-1 gap-1">
                                                    <h3 className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors flex-1">
                                                        {product.name}
                                                    </h3>
                                                    <span className="font-extrabold text-sm text-primary whitespace-nowrap">
                                                        {product.currency}{product.price}/day
                                                    </span>
                                                </div>
                                                <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                                                    {product.size && <span>Size: {product.size}</span>}
                                                    {product.distance && (
                                                        <>
                                                            <span className="text-outline-variant">•</span>
                                                            <span className="flex items-center gap-0.5">
                                                                <MapPin className="w-3 h-3" />
                                                                {product.distance}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* Advanced Filter Modal / Bottom Sheet */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsFilterOpen(false)}
            ></div>

            <div
                className={`fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-[32px] z-[101] max-h-[85vh] overflow-y-auto px-6 pt-6 pb-12 transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'
                    } max-w-2xl mx-auto`}
            >
                <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">Filters</h2>
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Price Range Slider */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface-variant mb-4">Price Range (per day)</h3>
                        <div className="relative pt-2">
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                step="50"
                                value={filters.priceRange}
                                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: parseInt(e.target.value) }))}
                                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between mt-3 text-sm text-on-surface font-semibold">
                                <span>₹100</span>
                                <span className="font-extrabold text-primary text-base">₹{filters.priceRange}</span>
                                <span>₹5000</span>
                            </div>
                        </div>
                    </div>

                    {/* Gender Filter */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface-variant mb-4">Gender</h3>
                        <div className="flex gap-2 flex-wrap">
                            {['Male', 'Female', 'Unisex'].map((g) => {
                                const isSel = filters.gender.includes(g);
                                return (
                                    <button
                                        key={g}
                                        onClick={() => handleGenderToggle(g)}
                                        className={`px-5 py-2.5 rounded-2xl font-semibold text-xs transition-all cursor-pointer border ${isSel
                                            ? 'bg-primary border-primary text-white shadow-sm'
                                            : 'bg-surface-container border-transparent text-on-surface hover:bg-surface-container-high'
                                            }`}
                                    >
                                        {g}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Size Choice Checklist */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface-variant mb-4">Size</h3>
                        <div className="grid grid-cols-6 gap-2">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                                const isSel = filters.sizes.includes(sz);
                                return (
                                    <button
                                        key={sz}
                                        onClick={() => handleSizeToggle(sz)}
                                        className={`h-10 w-full flex items-center justify-center rounded-xl font-bold text-xs border transition-all cursor-pointer ${isSel
                                            ? 'border-primary text-primary bg-primary/5 border-2 scale-105 shadow-sm'
                                            : 'border-surface-container text-on-surface hover:border-on-surface-variant'
                                            }`}
                                    >
                                        {sz}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dynamic Brands Checklist */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface-variant mb-4">Brands</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableBrands.map((b) => {
                                const isChecked = filters.brands.includes(b);
                                return (
                                    <button
                                        key={b}
                                        onClick={() => handleBrandToggle(b)}
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${isChecked
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-surface-container text-on-surface hover:border-on-surface-variant'
                                            }`}
                                    >
                                        {b}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dynamic Colors Checklist */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface-variant mb-4">Colors</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableColors.map((c) => {
                                const isChecked = filters.colors.includes(c);
                                return (
                                    <button
                                        key={c}
                                        onClick={() => handleColorToggle(c)}
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${isChecked
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-surface-container text-on-surface hover:border-on-surface-variant'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Occasion Checklist */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface-variant mb-4">Occasions</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Casual', 'College', 'Party', 'Wedding', 'Fest', 'Formal', 'Photoshoot'].map((occ) => {
                                const isSel = filters.occasions.includes(occ);
                                return (
                                    <button
                                        key={occ}
                                        onClick={() => handleOccasionToggle(occ)}
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${isSel
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-surface-container text-on-surface hover:border-on-surface-variant'
                                            }`}
                                    >
                                        {occ}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Condition Checklist */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface-variant mb-4">Conditions</h3>
                        <div className="flex gap-2">
                            {['Like New', 'Excellent', 'Good'].map((cond) => {
                                const isSel = filters.conditions.includes(cond);
                                return (
                                    <button
                                        key={cond}
                                        onClick={() => handleConditionToggle(cond)}
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${isSel
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-surface-container text-on-surface hover:border-on-surface-variant'
                                            }`}
                                    >
                                        {cond}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Availability Selection */}
                    <div>
                        <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface-variant mb-4">Availability</h3>
                        <div className="flex gap-2">
                            {['All', 'Available', 'Booked'].map((av) => {
                                const isSel = filters.availability === av;
                                return (
                                    <button
                                        key={av}
                                        onClick={() => setFilters(prev => ({ ...prev, availability: av as any }))}
                                        className={`px-5 py-2.5 rounded-2xl font-semibold text-xs transition-all cursor-pointer border ${isSel
                                            ? 'bg-primary border-primary text-white shadow-sm'
                                            : 'bg-surface-container border-transparent text-on-surface hover:bg-surface-container-high'
                                            }`}
                                    >
                                        {av}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Apply Filters Button */}
                <div className="sticky bottom-0 pt-6 mt-8 bg-white border-t border-surface-container">
                    <button
                        onClick={handleApplyFilters}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/10 hover:opacity-95 transition-all active:scale-[0.98] duration-150 cursor-pointer text-center"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Mobile bottom nav anchor */}
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
                    className="flex flex-col items-center justify-center text-primary bg-primary-container/10 rounded-xl px-3 py-1.5"
                >
                    <Search className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold mt-0.5">Search</span>
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
        </div>
    );
}
