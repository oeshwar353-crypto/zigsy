import React, { createContext, useContext } from 'react';
import { UserProfile } from '../../types';

interface BuyerContextType {
    user: UserProfile;
    wishlist: string[];
    toggleWishlist: (productId: string) => void;
    updateUserProfile: (profile: Partial<UserProfile>) => void;
    resetSession: () => void;
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const useBuyer = () => {
    const context = useContext(BuyerContext);
    if (!context) throw new Error('useBuyer must be used within BuyerProvider');
    return context;
};

interface BuyerProviderProps {
    userProfile: UserProfile;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
    wishlist: string[];
    handleToggleWishlist: (productId: string) => void;
    handleReset: () => void;
    children: React.ReactNode;
}

export function BuyerProvider({
    userProfile,
    setUserProfile,
    wishlist,
    handleToggleWishlist,
    handleReset,
    children
}: BuyerProviderProps) {
    const updateUserProfile = (profile: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...profile }));
    };

    return (
        <BuyerContext.Provider
            value={{
                user: userProfile,
                wishlist,
                toggleWishlist: handleToggleWishlist,
                updateUserProfile,
                resetSession: handleReset
            }}
        >
            {children}
        </BuyerContext.Provider>
    );
}
