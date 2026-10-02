import React, { useState } from 'react';
import { SellerProvider } from './SellerContext';
import Header from './Header';
import BottomNav from './BottomNav';
import SellerDashboard from './SellerDashboard';
import MyListings from './MyListings';
import UploadOutfit from './UploadOutfit';
import ListingDetails from './ListingDetails';
import BookingRequests from './BookingRequests';
import { SellerScreen, ActiveScreen } from '../../types';

interface SellerFlowProps {
    onNavigate: (screen: ActiveScreen) => void;
}

export default function SellerFlow({ onNavigate }: SellerFlowProps) {
    const [screen, setScreen] = useState<SellerScreen>('Dashboard');
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

    const handleBack = () => {
        if (screen === 'Dashboard') {
            onNavigate('profile');
        } else if (screen === 'ListingDetails') {
            setScreen('MyListings');
        } else if (screen === 'UploadOutfit') {
            setScreen('Dashboard');
        } else {
            setScreen('Dashboard');
        }
    };

    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#f9f9f9] text-gray-800 pb-20 relative">
                <Header 
                    currentScreen={screen} 
                    onBack={handleBack} 
                    onOpenMenu={() => alert('Seller drawer menu is locked in this demonstration.')} 
                />
                
                <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-12">
                    {screen === 'Dashboard' && (
                        <SellerDashboard setScreen={setScreen} />
                    )}
                    {screen === 'MyListings' && (
                        <MyListings 
                            setScreen={setScreen} 
                            setSelectedListingId={setSelectedListingId} 
                        />
                    )}
                    {screen === 'UploadOutfit' && (
                        <UploadOutfit 
                            setScreen={setScreen} 
                            setSelectedListingId={setSelectedListingId} 
                        />
                    )}
                    {screen === 'ListingDetails' && (
                        <ListingDetails 
                            listingId={selectedListingId || '1'} 
                            setScreen={setScreen} 
                        />
                    )}
                    {screen === 'BookingRequests' && (
                        <BookingRequests />
                    )}
                </main>

                <BottomNav 
                    currentScreen={screen} 
                    setScreen={setScreen} 
                    onExitSeller={() => onNavigate('profile')} 
                />
            </div>
        </>
    );
}
