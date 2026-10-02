import { Product, Listing } from '../types';

export const HIGH_VALUE_THRESHOLD = 10000;

export const CATEGORY_RANGES: Record<string, { min: number; max: number; defaultMultiplier: number }> = {
    't-shirt': { min: 500, max: 2000, defaultMultiplier: 5 },
    'shirt': { min: 1500, max: 4000, defaultMultiplier: 6 },
    'jeans': { min: 1500, max: 5000, defaultMultiplier: 6 },
    'dress': { min: 4000, max: 15000, defaultMultiplier: 10 },
    'blazer': { min: 4000, max: 12000, defaultMultiplier: 8 },
    'jacket': { min: 3000, max: 12000, defaultMultiplier: 8 },
    'suit': { min: 8000, max: 25000, defaultMultiplier: 10 },
    'lehenga': { min: 8000, max: 35000, defaultMultiplier: 12 },
    'shoes': { min: 3000, max: 15000, defaultMultiplier: 8 },
    'accessories': { min: 1000, max: 8000, defaultMultiplier: 6 }
};

/**
 * Estimates the internal original value of an outfit based on its rental price and category.
 */
export function estimateOriginalValue(price: number, category: string): number {
    const catLower = category.toLowerCase();
    let key = 'accessories';
    
    if (catLower.includes('t-shirt') || catLower.includes('tshirt')) key = 't-shirt';
    else if (catLower.includes('shirt')) key = 'shirt';
    else if (catLower.includes('jeans')) key = 'jeans';
    else if (catLower.includes('dress')) key = 'dress';
    else if (catLower.includes('blazer')) key = 'blazer';
    else if (catLower.includes('jacket')) key = 'jacket';
    else if (catLower.includes('suit')) key = 'suit';
    else if (catLower.includes('lehenga')) key = 'lehenga';
    else if (catLower.includes('shoe')) key = 'shoes';
    
    const range = CATEGORY_RANGES[key] || CATEGORY_RANGES['accessories'];
    const calculated = price * range.defaultMultiplier;
    
    return Math.max(range.min, calculated);
}

/**
 * Calculates the security deposit according to the Zigsy system algorithm:
 * - baseDeposit = max(rentalPrice * 1.20, estimatedOriginalValue * 0.20)
 * - Apply category multiplier (Dress: 1.10, Blazer/Jacket: 1.20, Suit: 1.30, Lehenga: 1.50, others: 1.00)
 * - Round to nearest ₹50
 * - Clamp between ₹200 and ₹2,000
 */
export function calculateSecurityDeposit(
    rentalPrice: number,
    category: string,
    estimatedOriginalValue: number
): number {
    const baseDeposit = Math.max(rentalPrice * 1.20, estimatedOriginalValue * 0.20);

    let multiplier = 1.00;
    const catLower = category.toLowerCase();
    
    if (catLower.includes('t-shirt') || catLower.includes('tshirt')) {
        multiplier = 1.00;
    } else if (catLower.includes('shirt')) {
        multiplier = 1.00;
    } else if (catLower.includes('jeans')) {
        multiplier = 1.00;
    } else if (catLower.includes('dress')) {
        multiplier = 1.10;
    } else if (catLower.includes('blazer')) {
        multiplier = 1.20;
    } else if (catLower.includes('jacket')) {
        multiplier = 1.20;
    } else if (catLower.includes('suit')) {
        multiplier = 1.30;
    } else if (catLower.includes('lehenga')) {
        multiplier = 1.50;
    }

    const calculated = baseDeposit * multiplier;
    const rounded = Math.round(calculated / 50) * 50;
    const finalDeposit = Math.max(200, Math.min(2000, rounded));

    return finalDeposit;
}

export function getDynamicCategory(title: string, originalCategory: string): string {
    const t = title.toLowerCase();
    if (t.includes('dress') || t.includes('gown') || t.includes('slip') || t.includes('lehenga') || t.includes('sari') || t.includes('ethnic') || t.includes('traditional') || t.includes('sherwani') || t.includes('anarkali') || t.includes('kurta') || t.includes('kurti')) {
        if (t.includes('lehenga') || t.includes('sari') || t.includes('sherwani') || t.includes('ethnic') || t.includes('traditional') || t.includes('anarkali') || t.includes('kurta') || t.includes('kurti')) {
            return 'Traditional Wear';
        }
        return 'Dresses';
    }
    if (t.includes('blazer') || t.includes('suit') || t.includes('tuxedo')) {
        return 'Blazers';
    }
    if (t.includes('jacket') || t.includes('trench') || t.includes('coat') || t.includes('puffer') || t.includes('parka') || t.includes('outerwear') || t.includes('hoodie') || t.includes('cardigan') || t.includes('sweater')) {
        return 'Jackets';
    }
    if (t.includes('shoe') || t.includes('boot') || t.includes('heel') || t.includes('sneaker') || t.includes('loafer') || t.includes('footwear') || t.includes('sandal') || t.includes('slide')) {
        return 'Footwear';
    }
    if (t.includes('bag') || t.includes('scarf') || t.includes('sunglasses') || t.includes('belt') || t.includes('hat') || t.includes('watch') || t.includes('accessories') || t.includes('tie') || t.includes('jewelry')) {
        return 'Accessories';
    }
    if (t.includes('pant') || t.includes('jean') || t.includes('cargo') || t.includes('trouser') || t.includes('skirt') || t.includes('shorts') || t.includes('bottom') || t.includes('leggings')) {
        return 'Bottoms';
    }
    if (t.includes('tee') || t.includes('shirt') || t.includes('top') || t.includes('blouse') || t.includes('crop') || t.includes('tank')) {
        return 'Tops';
    }
    
    // Fallback based on originalCategory
    const cat = originalCategory.toLowerCase();
    if (cat.includes('dress') || cat.includes('gown')) return 'Dresses';
    if (cat.includes('outerwear') || cat.includes('jacket') || cat.includes('coat') || cat.includes('hoodie')) return 'Jackets';
    if (cat.includes('suit') || cat.includes('blazer')) return 'Blazers';
    if (cat.includes('shoe') || cat.includes('boot') || cat.includes('footwear') || cat.includes('sneaker')) return 'Footwear';
    if (cat.includes('accessory') || cat.includes('bag') || cat.includes('scarf')) return 'Accessories';
    if (cat.includes('pant') || cat.includes('bottom') || cat.includes('jean') || cat.includes('cargo') || cat.includes('trouser')) return 'Bottoms';
    if (cat.includes('shirt') || cat.includes('top') || cat.includes('tee')) return 'Tops';

    return 'Dresses'; // default fallback
}

export function mapListingToProduct(l: Listing): Product {
    return {
        id: l.id,
        name: l.title,
        price: l.price,
        currency: '₹',
        brand: l.brand,
        description: l.description,
        size: l.size,
        color: l.color || 'Unspecified',
        image: l.image,
        rating: 4.8,
        distance: l.ownerId === 'user_123' ? '0.5 km' : (l.pickupLocation?.toLowerCase().includes('away') ? l.pickupLocation : '1.2 km'),
        category: getDynamicCategory(l.title, l.category),
        gallery: l.images && l.images.length > 0 ? l.images : [l.image],
        refundableDeposit: `₹${l.securityDeposit.toLocaleString('en-IN')}`,
        owner: {
            name: l.ownerName || 'Sarah J.',
            avatar: l.ownerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            role: l.ownerRole || 'Elite Lister'
        },
        condition: l.condition || 'Like New',
        estimatedOriginalValue: l.estimatedOriginalValue,
        isHighValue: l.isHighValue,
        securityDeposit: l.securityDeposit,
        gender: l.gender || 'Unisex',
        subcategory: l.subcategory || '',
        occasion: l.occasion || 'Casual',
        rentalPrice: l.rentalPrice || l.price,
        availability: l.availability || (l.status === 'Rented' ? 'Booked' : 'Available'),
        status: l.status,
        visibility: l.visibility || (l.status === 'Active' ? 'ACTIVE' : 'DRAFT'),
        ownerId: l.ownerId || 'platform_seller',
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
        views: l.views || 0,
        wishes: l.wishes || 0,
        bookingsCount: l.bookingsCount || 0
    };
}
