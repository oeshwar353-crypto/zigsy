import React from 'react';
import { Menu, ArrowLeft, Share2, Search } from 'lucide-react';
import { SellerScreen } from '../../types';

interface HeaderProps {
    currentScreen: SellerScreen;
    onBack: () => void;
    onOpenMenu?: () => void;
}

export default function Header({ currentScreen, onBack, onOpenMenu }: HeaderProps) {
    const isSubScreen = currentScreen === 'ListingDetails' || currentScreen === 'UploadOutfit';

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Zigsy Fashion',
                text: 'Check out this gorgeous designer fashion rental on Zigsy!',
                url: window.location.href,
            }).catch(() => { });
        } else {
            alert('Link copied to clipboard! Share the high-fashion style with friends.');
        }
    };

    return (
        <header id="zigsy-top-bar" className="w-full top-0 sticky z-50 bg-[#f9f9f9] border-b border-gray-100">
            <div className="flex justify-between items-center px-4 h-16 w-full max-w-7xl mx-auto">
                {/* Left Side */}
                <div className="flex items-center gap-3">
                    <button
                        id="header-back-button"
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-gray-100 text-[#C21807] transition-all duration-200 active:scale-95"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    {!isSubScreen && (
                        <h1 className="font-sans text-2xl font-bold text-[#C21807] tracking-tighter">
                            Zigsy
                        </h1>
                    )}
                </div>

                {/* Center Title for Sub-screens */}
                {isSubScreen && (
                    <h1 className="font-sans text-2xl font-bold text-[#C21807] tracking-tighter mx-auto absolute left-1/2 -translate-x-1/2">
                        Zigsy
                    </h1>
                )}

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {isSubScreen ? (
                        <button
                            id="header-share-button"
                            onClick={handleShare}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-all duration-200 active:scale-95"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    ) : (
                        <>
                            <button
                                id="header-search-button"
                                onClick={() => alert('Search is restricted to buyer discovery views.')}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all duration-200 active:scale-95"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            <div className="w-9 h-9 rounded-full border-2 border-[#C21807] overflow-hidden active:scale-95 transition-transform duration-200 cursor-pointer">
                                <img
                                    className="w-full h-full object-cover"
                                    alt="Seller profile"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5HccDwS8h-dufnRw5hw7CYeuiJm5TlC2rHslOwc4g2OFzY7a18neAoubajSBlnfrrmfjnPJl9Sj2rVHUbpQ0_ZFPCn9Nl8jifL5HH14GjfZu7s7JC6NHjqdrnZ0sd6ymVkPo6VJX-0zvUrIqNaqfHt541vGJUL4CytB11fSqGufJmclIZiQkYfpT6IrD7UECm--0W7trtr58MVTCbDnXo_lS6_aR7jHkumZLo5sfthg3qaHUMMat5"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
