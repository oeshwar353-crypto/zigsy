import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing, BookingRequest, ChatMessage, ListingStatus } from '../../types';
import { useBuyer } from '../home/BuyerContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';
import { estimateOriginalValue, calculateSecurityDeposit } from '../../utils/deposit';
import { products as platformProducts } from '../../data';

interface SellerContextType {
    listings: Listing[];
    bookingRequests: BookingRequest[];
    addListing: (listing: Omit<Listing, 'id' | 'views' | 'wishes' | 'bookingsCount' | 'totalRevenue' | 'bookedDates'>) => boolean;
    updateListing: (listing: Listing) => boolean;
    deleteListing: (id: string) => void;
    acceptBookingRequest: (id: string) => void;
    rejectBookingRequest: (id: string) => void;
    sendMessageToBuyer: (requestId: string, text: string, sender?: 'Seller' | 'Buyer') => void;
    isLimitModalOpen: boolean;
    setIsLimitModalOpen: (val: boolean) => void;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

const INITIAL_LISTINGS: Listing[] = [
    {
        id: '1',
        title: 'Valentino Silk Gown',
        description: 'A breathtaking cherry red silk gown from Valentino, featuring elegant drapes and an exquisite fluid silhouette. Perfect for high-fashion runway moments, luxury galas, or red carpet events.',
        size: 'Small (UK 8)',
        price: 2500,
        securityDeposit: 0,
        estimatedOriginalValue: 25000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc0JuUqEPy0BYaTSI1HpZgMXPW7jCktQ6RJ2RjfmoDo-_Q3oTiQxlQmQ5ybm8gdwzZRrJrq7oEHHKz91kTHlXP3JQokpddTRWfji58_nPWRcNoxc6Zjtos3cRyif-lrf6ci0eKge_K7kY11O0oDydDfd68K238i2FLM7e29wl15x6PJd12jwgFXAluqMfAXBheZzPNSwCDlW3x3ENVmqZje9xkKy69LhYcxvwRgZB7YE9Uo7IkxyuX',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDc0JuUqEPy0BYaTSI1HpZgMXPW7jCktQ6RJ2RjfmoDo-_Q3oTiQxlQmQ5ybm8gdwzZRrJrq7oEHHKz91kTHlXP3JQokpddTRWfji58_nPWRcNoxc6Zjtos3cRyif-lrf6ci0eKge_K7kY11O0oDydDfd68K238i2FLM7e29wl15x6PJd12jwgFXAluqMfAXBheZzPNSwCDlW3x3ENVmqZje9xkKy69LhYcxvwRgZB7YE9Uo7IkxyuX',
        ],
        status: 'Active',
        category: 'Dresses',
        brand: 'Valentino',
        color: 'Cherry Red',
        condition: 'New',
        views: 1200,
        wishes: 84,
        bookingsCount: 12,
        totalRevenue: 24000,
        blockedDates: ['2023-10-09', '2023-10-10'],
        bookedDates: ['2023-10-03', '2023-10-04', '2023-10-16', '2023-10-17', '2023-10-18'],
        pickupLocation: 'Vivekananda Global University, Admin Block Lawn',
        deliveryAvailable: true
    },
    {
        id: '2',
        title: 'Gucci Dionysus Bag',
        description: 'A luxurious textured leather Gucci Dionysus shoulder bag with the iconic tiger head spur closure. Styled in deep crimson velvet and leather finish with antique silver-toned hardware.',
        size: 'One Size',
        price: 950,
        securityDeposit: 0,
        estimatedOriginalValue: 8000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-d6teJJm4cvOT9Uf7BVcNgnp7y2uODFfEyndoAg8JIpOSx46Z0KQk9Iy1LucZFXbrWyEluJl83qdJskS6-v1YJW1rRNkGj5O5KrDkm_jkYXmasVWzlZgC5WS-2ktB8Es0Zn6eQkgdPZQoU599z7m5LE6VAhPfOasjkOnxfb4diJijxZfag6egBmIbUzMjoD0BywCPB-VOmUrpodcN2_bZAenvIrvJ7rfePDosuZ3BFJtpkiU8r5Zm',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuA-d6teJJm4cvOT9Uf7BVcNgnp7y2uODFfEyndoAg8JIpOSx46Z0KQk9Iy1LucZFXbrWyEluJl83qdJskS6-v1YJW1rRNkGj5O5KrDkm_jkYXmasVWzlZgC5WS-2ktB8Es0Zn6eQkgdPZQoU599z7m5LE6VAhPfOasjkOnxfb4diJijxZfag6egBmIbUzMjoD0BywCPB-VOmUrpodcN2_bZAenvIrvJ7rfePDosuZ3BFJtpkiU8r5Zm'
        ],
        status: 'Active',
        category: 'Accessories',
        brand: 'Gucci',
        color: 'Wine Red',
        condition: 'Like New',
        views: 942,
        wishes: 56,
        bookingsCount: 6,
        totalRevenue: 8100,
        blockedDates: [],
        bookedDates: [],
        pickupLocation: 'Vivekananda Global University, Admin Block Lawn',
        deliveryAvailable: true
    },
    {
        id: '3',
        title: 'Off-White Puffer',
        description: 'An oversized street-wear down puffer jacket by Off-White, sporting signature monochrome stripe patterns and industrial tags. Designed to provide incredible warmth while making an active high-fashion statement.',
        size: 'Medium',
        price: 1200,
        securityDeposit: 0,
        estimatedOriginalValue: 9600,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiTAxceGI2polgWZAOsCQIO82LVS_kNFmpD8G6UqNYuP4wZCK_9aNz8O9Cko4MfB36Fy2ddCmTiL1grNJaa3CSKyswT8jaZwxC7c6duN5V4ERG1It1I4gNyRvl9ct9QIySt6EXuKdbw_BcK9Ff5jOf6001pGQPs6Wdqlhzmq3pMuBGHSDENBKI8wuhCGRB2hCvpQB0qGoESO7D754RzbbVFJkUxpYtAHtBVwjuTInllFPp-BwM3hRi',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBiTAxceGI2polgWZAOsCQIO82LVS_kNFmpD8G6UqNYuP4wZCK_9aNz8O9Cko4MfB36Fy2ddCmTiL1grNJaa3CSKyswT8jaZwxC7c6duN5V4ERG1It1I4gNyRvl9ct9QIySt6EXuKdbw_BcK9Ff5jOf6001pGQPs6Wdqlhzmq3pMuBGHSDENBKI8wuhCGRB2hCvpQB0qGoESO7D754RzbbVFJkUxpYtAHtBVwjuTInllFPp-BwM3hRi'
        ],
        status: 'Rented',
        category: 'Suits',
        brand: 'Off-White',
        color: 'Grey/Blue',
        condition: 'Good',
        views: 2800,
        wishes: 192,
        bookingsCount: 18,
        totalRevenue: 31000,
        blockedDates: [],
        bookedDates: ['2023-10-25', '2023-10-26', '2023-10-27'],
        pickupLocation: 'Vivekananda Global University, Admin Block Lawn',
        deliveryAvailable: true
    },
    {
        id: '4',
        title: 'Louboutin Heels',
        description: 'Stunning embroidered Christian Louboutin heels with crystalline sparkles and the signature iconic red lacquer sole. Designed to elevate any grand entrance.',
        size: 'UK 6 (EU 39)',
        price: 1600,
        securityDeposit: 0,
        estimatedOriginalValue: 12800,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcouWOkrg_6WeshPqjZ0ar2Z_l6KX0HjJVwWearmEk_u-6LBu6TnwG1SzWC6j5fZkEYqC9D0vhtS1FNFx3YLqiMId-hGk-E0CGgRSRtamw3GPVbJoGHekTb9j8GHRmDzVB8DOIYLbbU_jdLms6dEV8ulboinvymF9UUoWkJu3_9smnvOvVyQI57tK6kx2ZKtN80kLYdWz6LbMChapnBNEH6q9VKm5CsDlZFMCLBLwotOLBVN_ESpVd',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDcouWOkrg_6WeshPqjZ0ar2Z_l6KX0HjJVwWearmEk_u-6LBu6TnwG1SzWC6j5fZkEYqC9D0vhtS1FNFx3YLqiMId-hGk-E0CGgRSRtamw3GPVbJoGHekTb9j8GHRmDzVB8DOIYLbbU_jdLms6dEV8ulboinvymF9UUoWkJu3_9smnvOvVyQI57tK6kx2ZKtN80kLYdWz6LbMChapnBNEH6q9VKm5CsDlZFMCLBLwotOLBVN_ESpVd'
        ],
        status: 'Active',
        category: 'Accessories',
        brand: 'Christian Louboutin',
        color: 'Crimson/Gold',
        condition: 'New',
        views: 512,
        wishes: 22,
        bookingsCount: 4,
        totalRevenue: 6400,
        blockedDates: [],
        bookedDates: [],
        pickupLocation: 'Vivekananda Global University, Admin Block Lawn',
        deliveryAvailable: false
    },
    {
        id: '5',
        title: 'Crimson Silhouette Satin Midi Dress',
        description: 'A stunning cherry red satin midi dress featuring a cowl neckline and adjustable straps. Perfect for evening events, weddings, or high-end galas. Sustainably sourced and maintained in pristine condition.',
        size: 'Medium (UK 10)',
        price: 1000,
        securityDeposit: 0,
        estimatedOriginalValue: 10000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChE4WsviqEbswzz3-ZkeLj_u1lbpe8TYIY5ERcg1Co5zgclRE2NnSM76JkscSGrChJll8xj_3DSKocj53mmk7qowrqKe_80thMJRNT_DRSAfa-BJpepMM9f0bQSEyjuboi9pv_8Wdl3mc4MvXEF3ZRMmwfqgJ-C25psRBQGfTSJ4IJBfB-PsnTCLlGy9oJXwKYybGArdg_riDQuRKkj5mOV0c3rXOjEKMscMhux4KepDHlE-CUIyw3',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuChE4WsviqEbswzz3-ZkeLj_u1lbpe8TYIY5ERcg1Co5zgclRE2NnSM76JkscSGrChJll8xj_3DSKocj53mmk7qowrqKe_80thMJRNT_DRSAfa-BJpepMM9f0bQSEyjuboi9pv_8Wdl3mc4MvXEF3ZRMmwfqgJ-C25psRBQGfTSJ4IJBfB-PsnTCLlGy9oJXwKYybGArdg_riDQuRKkj5mOV0c3rXOjEKMscMhux4KepDHlE-CUIyw3',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDnJ8tV3v5UmoBW5S0CUZRXU6Mqn9TsTPtqQcTvr7nABwvQnfdUH5EbLfDakBP3Wkin_svxrdoOyThq3MmlWP5B5eNCdL4IzCjPdUSzOD40UWqQH8Ye6hiW1CIJYWMoqOHr2hMfK6BnvaRMb4Cev6mgNriiME3hfzOfzBJSFBnWzdn_a3-h8Ul-WIMcC2vnyQP2yiU1DmhqBMSsjj9yIAO442QGUPkzYa1GieQrlpAamTnSVrUN-OTA',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB5k5NnFGRpopLg1iA9K407ZPIAbRY1-ZIN3GibhCcOYdg_enx-tu275hnh9gNRGtV4bsUZV6S_b7SULpKj-XZSu5d8QzY7J6sEmPHmubT1xA7aJz3R0WpskA4j5I1AEyiuse2VwhE4A6xJpU3lnAZiKTid9QCzPEzGaFaUReyLzIighZuNQ8Ab8HLy0beKz1OrJaSChqDTcujtMHKhhkN1Dz6bexaA5OPn7VXKzBVotMfr7JkDwiJB'
        ],
        status: 'Active',
        category: 'Dresses',
        brand: 'Zara Special Edition',
        color: 'Cherry Red',
        condition: 'New',
        views: 1284,
        wishes: 45,
        bookingsCount: 12,
        totalRevenue: 8400,
        blockedDates: ['2023-10-09', '2023-10-10'],
        bookedDates: ['2023-10-03', '2023-10-04', '2023-10-16', '2023-10-17', '2023-10-18'],
        pickupLocation: 'Vivekananda Global University, Admin Block Lawn',
        deliveryAvailable: true
    }
];

const INITIAL_BOOKING_REQUESTS: BookingRequest[] = [
    {
        id: 'req_1',
        buyerName: 'Maya Rodriguez',
        buyerRating: 4.9,
        buyerRentalsCount: 12,
        buyerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy8S-lczyx0MQyi96QUNfQZY3r1A4OngVCUjkNv6RjQHVKKzPbGgOGcXNlva6P5PHSmfbCk_gEFKlZ0xlFcMbBzy4IFJr6SP4WHl6HTianRzpPDRehezDENHh-qxKxmchTrEWWMXU1es4DZCLSPdNrmcftdoVIGyPpDK3uifCpk2M-kEv22XLZOMjL75TfchS-T3M5F_6g-IR6K_slCjBH-TqBbF4xTZXFxK-6njN_PtDQPiryl6g0',
        listingId: '5',
        listingTitle: 'Vintage Crimson Slip',
        listingImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQoPK8S-pBWBZE0H51NVNst4sv1QA33ALeGagSE9lbknDUHKlKgP6RHal9qkVrRZdr0Mr2Y8ZSJgN5s2HfM3ssXIV8UBaUXZrh5Ji0c2yD1vpMXZBILm238eB2q1rKyRDKkFNSp3i-YHfHrnOnHhRrOtsyBPfvd6LHXF5Kg-sgtM_YxfWvv4XeB61Tz6Zwc_CR3gspBUOgs--fz1e2m1UzNf2k-ehEV6QNSd8HlP53KuMMtEkZye17',
        startDate: 'Oct 12',
        endDate: 'Oct 15',
        price: 84.00,
        status: 'Pending',
        messages: [
            {
                id: 'm1',
                sender: 'Buyer',
                text: 'Hi there! I absolutely love this crimson slip. I am attending an editorial photoshoot on the 13th. Is there any chance I could arrange an early afternoon pickup?',
                timestamp: '10:30 AM'
            }
        ]
    },
    {
        id: 'req_2',
        buyerName: 'Liam Chen',
        buyerRating: 5.0,
        buyerRentalsCount: 28,
        buyerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdqiIPN65VXELaDK19MjV7Bzf41WqYr017bPZ137Reckv4DCNIXnfTntaKGJJYi_roPf5PcA_RSii5CnKS2ToQVEaV1v3Uau5a9mSO5QEVGm9bDBCVOXsGKcLIEjWbLstC7ZKximL5L7WfZU0tx8BKOFfB3209BVtve2Aatfa43aRsjpdV-jtnq_dTCnyf4FB7pGkppUKYldmpuG9B0dxk7SRS_J4QdeNd_9tR9_vphsfU6T_3jwKF',
        listingId: 'new_boots',
        listingTitle: 'Maison Leather Boots',
        listingImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfMAz9PDaKIZKYgoW79fNqfendZY1DzkJr-HqihnXN-eFP-JwjhkbaDQNm9VpYJ5rH5BRSYkkZy1yUXUxfWqOexTgxVpZFGYSGayIkYOMN2qddpUoE5ePcC01-3MIevFGPAQOZ-ydu3LFLAzlwMLsysYJ5KwqwmC9lMqPhPq3ELZ1F8GRFjgBkFBJQCigmET9VZ9K3r4SOl7KzOSwd678QhhhnInDqIm8KAaJUBffyFfLpnLuCEQiF',
        startDate: 'Oct 20',
        endDate: 'Oct 22',
        price: 120.00,
        isExpiringSoon: true,
        status: 'Pending',
        messages: [
            {
                id: 'm2',
                sender: 'Buyer',
                text: 'Hello! Are these boots TTS (true to size)? I would like to rent them for a weekend exhibition in London.',
                timestamp: '9:15 AM'
            }
        ]
    },
    {
        id: 'req_3',
        buyerName: 'Chloe Simmons',
        buyerRating: 4.7,
        buyerRentalsCount: 5,
        buyerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7YpvH8vHEKfT8MZr0ig1oSgPsSBXg3taiqpSd-9CtukvCfYVEvoXmtwar_PufjUW_DMij9Cb5rqenD4G40BbRj_A11XHnX-tyuKcLV7fBpUOPy1XVQBhevQlZFpOwbx0qZG17mF8HI6lgPiJ85Qvwk-F--AqI-8POs3Pg2-6abJuRFfPP-TyQ2jSIFCkSc52ejHYW5QBFvf5AMsCVLS7QYEX9OdUcDuveKbo3n7DOz5x624LH794',
        listingId: 'new_scarf',
        listingTitle: 'Abstract Silk Scarf',
        listingImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7OKXQPMo5JWW5PatoPLd8OOJlGo-1y5wcPldEYYN1qZh6nid_HPajCACE7_Wicz8WrXTTLh7CDla3xzXsLfOZuzpDuBGnatbta5jLmowxB6NOUeg0COvPDiR_n5MZuLGfd_Iu2P8oMCpWNivdkfJSOuN4n8IUopf9gnuQp35p38pii6nfAVUCq5S71gEJTK1EoinuAmMvzp7iotvNbNseQLVuqwBVUh3HzJRYUsKClXI4ErsELwvW',
        startDate: 'Oct 15',
        endDate: 'Oct 16',
        price: 35.00,
        status: 'Pending',
        messages: [
            {
                id: 'm3',
                sender: 'Buyer',
                text: 'Hi Chloe here. Just wondering if this silk is high-grade mulberry silk or a blend? It looks gorgeous.',
                timestamp: 'Yesterday'
            }
        ]
    }
];

export const SellerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [listings, setListings] = useState<Listing[]>(() => {
        // Map platform products from data.ts to Listing structures
        const mappedPlatformProducts: Listing[] = platformProducts.map(p => {
            const depStr = p.refundableDeposit || '0';
            const depVal = typeof p.securityDeposit === 'number' ? p.securityDeposit : parseInt(depStr.replace(/[^0-9]/g, ''), 10) || 0;
            return {
                id: p.id,
                title: p.name,
                description: p.description,
                size: p.size || 'One Size',
                price: p.price,
                securityDeposit: depVal,
                image: p.image,
                images: p.gallery || [p.image],
                status: 'Active',
                category: p.category,
                brand: p.brand,
                color: p.color || 'Unspecified',
                condition: 'Like New',
                views: Math.floor(Math.random() * 200) + 50,
                wishes: Math.floor(Math.random() * 30) + 5,
                bookingsCount: Math.floor(Math.random() * 5),
                totalRevenue: 0,
                blockedDates: [],
                bookedDates: [],
                pickupLocation: p.distance ? `${p.distance} away` : 'Vivekananda Global University, Admin Block Lawn',
                deliveryAvailable: true,
                estimatedOriginalValue: p.estimatedOriginalValue || 0,
                isHighValue: p.isHighValue || false,
                ownerId: p.owner?.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'platform_seller',
                ownerName: p.owner?.name || 'Sarah J.',
                ownerAvatar: p.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                ownerRole: p.owner?.role || 'Elite Lister',
                visibility: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        });

        // Only load USER listings from localStorage — platform listings are always fresh from data.ts
        const saved = localStorage.getItem('zigsy_user_listings_v2');
        let userListings: Listing[] = [];
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    // Only restore listings that genuinely belong to user_123
                    userListings = parsed
                        .filter((item: any) => item.ownerId === 'user_123')
                        .map((item: any) => ({
                            ...item,
                            price: Number(item.price) || 0,
                            securityDeposit: Number(item.securityDeposit) || 0,
                            views: Number(item.views) || 0,
                            wishes: Number(item.wishes) || 0,
                            bookingsCount: Number(item.bookingsCount) || 0,
                            totalRevenue: Number(item.totalRevenue) || 0,
                            visibility: item.visibility || (item.status === 'Active' ? 'ACTIVE' : item.status === 'Drafts' ? 'DRAFT' : 'ARCHIVED')
                        }));
                }
            } catch (e) {
                console.error("Error parsing listings:", e);
            }
        }
        // Note: if no saved data, user starts with zero listings (correct!)
        // INITIAL_LISTINGS are seeded separately if needed for demo purposes

        // Always merge with fresh platform listings — never from cache
        const platformIds = new Set(mappedPlatformProducts.map(p => p.id));
        // Remove any stale platform listings that may have been cached previously
        const cleanUserListings = userListings.filter(l => !platformIds.has(l.id));

        return [...cleanUserListings, ...mappedPlatformProducts];
    });

    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(() => {
        const saved = localStorage.getItem('zigsy_booking_requests');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed.map((item: any) => ({
                        ...item,
                        price: Number(item.price) || 0,
                    }));
                }
            } catch (e) {
                console.error("Error parsing booking requests:", e);
            }
        }
        return INITIAL_BOOKING_REQUESTS;
    });

    useEffect(() => {
        // Only persist the current user's own listings — NOT platform listings
        const userOnly = listings.filter(l => l.ownerId === 'user_123');
        localStorage.setItem('zigsy_user_listings_v2', JSON.stringify(userOnly));
    }, [listings]);

    useEffect(() => {
        localStorage.setItem('zigsy_booking_requests', JSON.stringify(bookingRequests));
    }, [bookingRequests]);

    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const { user, updateUserProfile } = useBuyer();

    useEffect(() => {
        const userListings = listings.filter(l => l.ownerId === 'user_123');
        const totalEarningsVal = userListings.reduce((sum, item) => {
            const val = typeof item.totalRevenue === 'number' ? item.totalRevenue : parseInt(String(item.totalRevenue || 0).replace(/[^0-9]/g, ''), 10);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);
        const listingsCount = userListings.length;

        updateUserProfile({
            listingsCount,
            totalEarnings: totalEarningsVal
        });
    }, [listings]);

    const activeListingsCount = listings.filter(l => l.ownerId === 'user_123' && l.status === 'Active').length;

    const addListing = (
        newListing: Omit<Listing, 'id' | 'views' | 'wishes' | 'bookingsCount' | 'totalRevenue' | 'bookedDates' | 'ownerId' | 'ownerName' | 'ownerAvatar' | 'ownerRole' | 'visibility'>
    ) => {
        if (user.isVerifiedStudent && newListing.status === 'Active' && activeListingsCount >= 5) {
            setIsLimitModalOpen(true);
            return false;
        }

        const calculatedOriginalValue = estimateOriginalValue(newListing.price, newListing.category);
        const calculatedDeposit = calculateSecurityDeposit(newListing.price, newListing.category, calculatedOriginalValue);
        const vis: 'ACTIVE' | 'ARCHIVED' | 'DRAFT' = newListing.status === 'Active' ? 'ACTIVE' : 'DRAFT';

        const listing: Listing = {
            ...newListing,
            id: `list_${Date.now()}`,
            views: 0,
            wishes: 0,
            bookingsCount: 0,
            totalRevenue: 0,
            bookedDates: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedOriginalValue: calculatedOriginalValue,
            securityDeposit: calculatedDeposit,
            isHighValue: calculatedOriginalValue > 10000,
            ownerId: 'user_123',
            ownerName: user.fullName || 'Om Shrivastava',
            ownerAvatar: user.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
            ownerRole: 'Lister (You)',
            visibility: vis
        };

        setListings((prev) => [listing, ...prev]);

        // Auto-simulate a booking request for this listing from Aarav Mehta
        if (listing.status === 'Active') {
            const simulatedRequest: BookingRequest = {
                id: `req_${Date.now()}`,
                buyerName: 'Aarav Mehta',
                buyerRating: 4.8,
                buyerRentalsCount: 15,
                buyerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
                listingId: listing.id,
                listingTitle: listing.title,
                listingImage: listing.image,
                startDate: 'Oct 24',
                endDate: 'Oct 27',
                price: listing.price * 3, // 3 days rental
                status: 'Pending',
                messages: [
                    {
                        id: `msg_${Date.now()}`,
                        sender: 'Buyer',
                        text: `Hey! I love your ${listing.title}. Is it available for these dates?`,
                        timestamp: 'Just now'
                    }
                ]
            };
            setTimeout(() => {
                setBookingRequests((prev) => [simulatedRequest, ...prev]);
            }, 1500);
        }

        return true;
    };

    const updateListing = (updated: Listing) => {
        const existing = listings.find((l) => l.id === updated.id);
        const isNowActive = updated.status === 'Active' || updated.visibility === 'ACTIVE';
        const wasActive = existing ? (existing.status === 'Active' || existing.visibility === 'ACTIVE') : false;

        if (
            user.isVerifiedStudent &&
            isNowActive &&
            !wasActive &&
            activeListingsCount >= 5
        ) {
            setIsLimitModalOpen(true);
            return false;
        }

        const calculatedOriginalValue = estimateOriginalValue(updated.price, updated.category);
        const calculatedDeposit = calculateSecurityDeposit(updated.price, updated.category, calculatedOriginalValue);
        const vis: 'ACTIVE' | 'ARCHIVED' | 'DRAFT' = updated.status === 'Active' ? 'ACTIVE' : updated.status === 'Drafts' ? 'DRAFT' : 'ARCHIVED';

        const finalized: Listing = {
            ...updated,
            estimatedOriginalValue: calculatedOriginalValue,
            securityDeposit: calculatedDeposit,
            isHighValue: calculatedOriginalValue > 10000,
            visibility: vis,
            updatedAt: new Date().toISOString()
        };

        setListings((prev) => prev.map((l) => (l.id === updated.id ? finalized : l)));
        return true;
    };

    const deleteListing = (id: string) => {
        setListings((prev) => prev.filter((l) => l.id !== id));
    };

    const acceptBookingRequest = (id: string) => {
        setBookingRequests((prev) =>
            prev.map((r) => {
                if (r.id === id) {
                    // If accepting, let's also update the associated listing booked dates
                    const startNum = parseInt(r.startDate.replace(/[^0-9]/g, '')) || 12;
                    const endNum = parseInt(r.endDate.replace(/[^0-9]/g, '')) || 15;
                    const datesToBook: string[] = [];
                    for (let i = startNum; i <= endNum; i++) {
                        datesToBook.push(`2023-10-${i < 10 ? '0' + i : i}`);
                    }

                    // Find and update listing
                    setListings((prevListings) =>
                        prevListings.map((l) => {
                            if (l.id === r.listingId) {
                                return {
                                    ...l,
                                    bookedDates: Array.from(new Set([...l.bookedDates, ...datesToBook])),
                                    bookingsCount: l.bookingsCount + 1,
                                    totalRevenue: l.totalRevenue + r.price,
                                };
                            }
                            return l;
                        })
                    );

                    return { ...r, status: 'Accepted' as const };
                }
                return r;
            })
        );
    };

    const rejectBookingRequest = (id: string) => {
        setBookingRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' as const } : r))
        );
    };

    const sendMessageToBuyer = (requestId: string, text: string, sender: 'Seller' | 'Buyer' = 'Seller') => {
        setBookingRequests((prev) =>
            prev.map((r) => {
                if (r.id === requestId) {
                    const newMsg: ChatMessage = {
                        id: `msg_${Date.now()}`,
                        sender,
                        text,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    return {
                        ...r,
                        messages: [...r.messages, newMsg],
                    };
                }
                return r;
            })
        );
    };

    return (
        <SellerContext.Provider
            value={{
                listings,
                bookingRequests,
                addListing,
                updateListing,
                deleteListing,
                acceptBookingRequest,
                rejectBookingRequest,
                sendMessageToBuyer,
                isLimitModalOpen,
                setIsLimitModalOpen,
            }}
        >
            {children}

            {/* Global Student Active Listing Limit Modal Dialog */}
            <AnimatePresence>
                {isLimitModalOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            key="limit-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLimitModalOpen(false)}
                            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[999] flex items-center justify-center p-4"
                        />
                        {/* Modal Container */}
                        <motion.div
                            key="limit-modal"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl z-[1000] w-[calc(100%-2rem)] max-w-sm flex flex-col items-center text-center space-y-5 border border-gray-100"
                        >
                            {/* Close Button in top right */}
                            <button
                                onClick={() => setIsLimitModalOpen(false)}
                                className="absolute top-4 right-4 p-1.5 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Locked Visual Icon */}
                            <div className="w-16 h-16 rounded-full bg-[#C21807]/10 flex items-center justify-center text-[#C21807]">
                                <Lock className="w-7 h-7" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                                    Active Listing Limit Reached
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                                    Free student accounts can have up to 5 active outfits.
                                </p>
                                <p className="text-xs text-gray-400 font-medium">
                                    Archive or delete an existing outfit to publish another.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsLimitModalOpen(false)}
                                className="w-full bg-brand-cherry text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-brand-dark active:scale-95 transition-all text-xs"
                            >
                                Got It
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </SellerContext.Provider>
    );
};

export const useSeller = () => {
    const context = useContext(SellerContext);
    if (!context) {
        throw new Error('useSeller must be used within a SellerProvider');
    }
    return context;
};
